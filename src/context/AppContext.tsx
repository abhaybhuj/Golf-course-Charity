import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  UserRole,
  UserProfile,
  GolfScore,
  Charity,
  DrawRecord,
  DrawLogicType,
  DrawSimulationResult,
  DirectDonation,
  SubscriptionPlan,
  SubscriptionStatus,
  PaymentStatus,
  UserWinning,
  NewSubscriberPayload
} from '../types';
import {
  INITIAL_CHARITIES,
  INITIAL_SUBSCRIBER,
  MOCK_COMMUNITY_SUBSCRIBERS,
  INITIAL_PAST_DRAWS,
  INITIAL_DIRECT_DONATIONS
} from '../data/initialData';

interface AppContextType {
  // Role & Session
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  allSubscribers: UserProfile[];
  loginAs: (email: string) => boolean;
  registerSubscriber: (payload: NewSubscriberPayload) => UserProfile;
  logout: () => void;

  // Subscription
  subscribe: (plan: SubscriptionPlan, charityId: string, charityPercentage: number) => void;
  cancelSubscription: () => void;
  resumeSubscription: () => void;
  updateSubscriptionStatus: (userId: string, status: SubscriptionStatus) => void;
  updateUserCharityChoice: (charityId: string, percentage: number) => void;

  // Scores
  addGolfScore: (points: number, date: string, courseName?: string, notes?: string) => { success: boolean; error?: string };
  editGolfScore: (scoreId: string, points: number, date: string, courseName?: string, notes?: string) => { success: boolean; error?: string };
  deleteGolfScore: (scoreId: string) => void;
  adminUpdateUserScores: (userId: string, scores: GolfScore[]) => void;

  // Charities
  charities: Charity[];
  addCharity: (charity: Omit<Charity, 'id' | 'totalRaised'>) => void;
  updateCharity: (id: string, updates: Partial<Charity>) => void;
  deleteCharity: (id: string) => void;
  donateDirectly: (charityId: string, amount: number, donorName: string, message?: string) => void;
  directDonations: DirectDonation[];

  // Draws & Simulations
  pastDraws: DrawRecord[];
  activeDrawMonth: string;
  activePoolAmount: number;
  rolloverJackpot: number;
  runDrawSimulation: (logicType: DrawLogicType) => DrawSimulationResult;
  publishOfficialDraw: (simulation: DrawSimulationResult) => void;

  // Winner Verification
  submitWinnerProof: (winningId: string, proofUrl: string) => void;
  adminReviewWinner: (userId: string, winningId: string, decision: 'approved' | 'rejected', notes?: string) => void;
  adminMarkPayoutComplete: (userId: string, winningId: string) => void;

  // Utilities
  resetToDefaultData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY = 'digital_heroes_platform_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or use initial defaults
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved state from localStorage', e);
    }
    return null;
  };

  const initialLoaded = loadSavedState();

  const [role, setRole] = useState<UserRole>('subscriber');
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    initialLoaded?.currentUser || INITIAL_SUBSCRIBER
  );
  const [allSubscribers, setAllSubscribers] = useState<UserProfile[]>(
    initialLoaded?.allSubscribers || [INITIAL_SUBSCRIBER, ...MOCK_COMMUNITY_SUBSCRIBERS]
  );
  const [charities, setCharities] = useState<Charity[]>(
    initialLoaded?.charities || INITIAL_CHARITIES
  );
  const [pastDraws, setPastDraws] = useState<DrawRecord[]>(
    initialLoaded?.pastDraws || INITIAL_PAST_DRAWS
  );
  const [directDonations, setDirectDonations] = useState<DirectDonation[]>(
    initialLoaded?.directDonations || INITIAL_DIRECT_DONATIONS
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        currentUser,
        allSubscribers,
        charities,
        pastDraws,
        directDonations
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }, [currentUser, allSubscribers, charities, pastDraws, directDonations]);

  // Keep currentUser in sync with allSubscribers array
  useEffect(() => {
    const updated = allSubscribers.find(s => s.id === currentUser.id);
    if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) {
      setCurrentUser(updated);
    }
  }, [allSubscribers]);

  // Calculations for current active pool
  const activeSubscribersCount = useMemo(() => {
    return allSubscribers.filter(s => s.subscription.status === 'active').length + 420; // 420 network base members
  }, [allSubscribers]);

  // Find rollover from latest draw
  const rolloverJackpot = useMemo(() => {
    if (pastDraws.length === 0) return 5000;
    const latest = pastDraws[0];
    const tier5 = latest.tiers.find(t => t.matchTier === '5-match');
    return tier5?.rolloverAmount || 5000;
  }, [pastDraws]);

  // Fixed portion per subscriber towards pool ($18 per member monthly contribution) + rollover
  const activePoolAmount = useMemo(() => {
    const freshMonthlyAdd = activeSubscribersCount * 18.5;
    return Math.round(freshMonthlyAdd + rolloverJackpot);
  }, [activeSubscribersCount, rolloverJackpot]);

  const activeDrawMonth = 'March 2026';

  // Login handler
  const loginAs = (email: string): boolean => {
    if (email.toLowerCase().includes('admin')) {
      setRole('admin');
      showToast('Logged in as Platform Administrator');
      return true;
    }
    const found = allSubscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setRole('subscriber');
      showToast(`Welcome back, ${found.name}!`);
      return true;
    }
    // Fallback: log in as default test subscriber
    setCurrentUser(INITIAL_SUBSCRIBER);
    setRole('subscriber');
    showToast('Logged in as Alex Vance (Verified Test Subscriber)');
    return true;
  };

  // Register New Member (§03 Authentication & Registration)
  const registerSubscriber = (payload: NewSubscriberPayload): UserProfile => {
    const amount = payload.plan === 'monthly' ? 29 : 290;
    const renewalDays = payload.plan === 'monthly' ? 30 : 365;
    const renewalDate = new Date(Date.now() + renewalDays * 86400000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    // Build initial rolling 5 scores
    const defaultScoresPoints = payload.initialScores && payload.initialScores.length === 5 
      ? payload.initialScores 
      : [36, 38, 34, 39, 35];
    
    const initialScores: GolfScore[] = defaultScoresPoints.map((pts, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (idx * 3));
      return {
        id: `sc-new-${Date.now()}-${idx}`,
        points: pts,
        date: d.toISOString().split('T')[0],
        courseName: payload.homeClub || 'Home Links Club',
        notes: `Round #${5 - idx}`
      };
    });

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: payload.name.trim(),
      email: payload.email.trim(),
      role: 'subscriber',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
      handicap: payload.handicap || 14.0,
      homeClub: payload.homeClub || 'St. Andrews Club',
      subscription: {
        status: 'active',
        plan: payload.plan,
        startDate: today,
        renewalDate,
        amount,
        autoRenew: true
      },
      scores: initialScores,
      charityId: payload.charityId,
      charityPercentage: Math.max(10, payload.charityPercentage || 20),
      totalDonated: Math.round(amount * (payload.charityPercentage / 100)),
      drawsEnteredCount: 1,
      winnings: []
    };

    setAllSubscribers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setRole('subscriber');

    // Add charity funds
    const charityCut = (amount * (payload.charityPercentage / 100));
    setCharities(prev =>
      prev.map(c => c.id === payload.charityId ? { ...c, totalRaised: c.totalRaised + charityCut } : c)
    );

    showToast(`Welcome to Digital Heroes, ${newUser.name}! Your account is active and entered into the ${activeDrawMonth} draw.`);
    return newUser;
  };

  const logout = () => {
    setRole('visitor');
    showToast('Signed out of Digital Heroes.');
  };

  // Subscription Actions
  const subscribe = (plan: SubscriptionPlan, charityId: string, charityPercentage: number) => {
    const amount = plan === 'monthly' ? 29 : 290;
    const renewalDays = plan === 'monthly' ? 30 : 365;
    const renewalDate = new Date(Date.now() + renewalDays * 86400000).toISOString().split('T')[0];

    const updatedUser: UserProfile = {
      ...currentUser,
      role: 'subscriber',
      subscription: {
        status: 'active',
        plan,
        startDate: new Date().toISOString().split('T')[0],
        renewalDate,
        amount,
        autoRenew: true
      },
      charityId,
      charityPercentage: Math.max(10, charityPercentage)
    };

    setCurrentUser(updatedUser);
    setAllSubscribers(prev => {
      const idx = prev.findIndex(u => u.id === updatedUser.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedUser;
        return next;
      }
      return [updatedUser, ...prev];
    });

    // Update charity raised amount
    const charityCut = (amount * (charityPercentage / 100));
    setCharities(prev =>
      prev.map(c => c.id === charityId ? { ...c, totalRaised: c.totalRaised + charityCut } : c)
    );

    setRole('subscriber');
    showToast(`Subscription activated (${plan === 'yearly' ? 'Yearly' : 'Monthly'})! Welcome to Digital Heroes.`);
  };

  const cancelSubscription = () => {
    setCurrentUser(prev => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        autoRenew: false,
        status: 'cancelled'
      }
    }));
    setAllSubscribers(prev =>
      prev.map(u => u.id === currentUser.id ? {
        ...u,
        subscription: { ...u.subscription, autoRenew: false, status: 'cancelled' }
      } : u)
    );
    showToast('Subscription auto-renew cancelled. Access remains active through end of billing period.');
  };

  const resumeSubscription = () => {
    setCurrentUser(prev => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        autoRenew: true,
        status: 'active'
      }
    }));
    setAllSubscribers(prev =>
      prev.map(u => u.id === currentUser.id ? {
        ...u,
        subscription: { ...u.subscription, autoRenew: true, status: 'active' }
      } : u)
    );
    showToast('Subscription resumed successfully.');
  };

  const updateSubscriptionStatus = (userId: string, status: SubscriptionStatus) => {
    setAllSubscribers(prev =>
      prev.map(u => u.id === userId ? {
        ...u,
        subscription: { ...u.subscription, status }
      } : u)
    );
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        subscription: { ...prev.subscription, status }
      }));
    }
    showToast(`Updated user subscription status to ${status}`);
  };

  const updateUserCharityChoice = (charityId: string, percentage: number) => {
    const validPct = Math.max(10, Math.min(100, Math.round(percentage)));
    setCurrentUser(prev => ({
      ...prev,
      charityId,
      charityPercentage: validPct
    }));
    setAllSubscribers(prev =>
      prev.map(u => u.id === currentUser.id ? {
        ...u,
        charityId,
        charityPercentage: validPct
      } : u)
    );
    showToast(`Charity contribution preference updated to ${validPct}%`);
  };

  // Score Management System (§05)
  // Input requirements:
  // - 1-45 points (Stableford)
  // - date required
  // - Only one score entry is permitted per date. Duplicate scores for the same date are not allowed.
  // - Only the latest 5 scores are retained at any time (rolling buffer: new replaces oldest).
  // - Reverse chronological order.
  const addGolfScore = (
    points: number,
    date: string,
    courseName?: string,
    notes?: string
  ): { success: boolean; error?: string } => {
    // §04 Subscription Access check: inactive users cannot enter new scores
    if (currentUser.subscription.status !== 'active') {
      return {
        success: false,
        error: 'Your subscription is currently inactive. You can view your dashboard, but an active membership is required to enter new scores and participate in prize draws.'
      };
    }

    if (points < 1 || points > 45 || isNaN(points)) {
      return { success: false, error: 'Stableford score must be between 1 and 45 points.' };
    }
    if (!date) {
      return { success: false, error: 'Date is required for golf score.' };
    }

    // Duplicate date check: §05 Block entry of multiple scores for the same date
    const existingDate = currentUser.scores.find(s => s.date === date);
    if (existingDate) {
      return {
        success: false,
        error: 'A score already exists for this date.'
      };
    }

    const newScore: GolfScore = {
      id: `sc-${Date.now()}`,
      points,
      date,
      courseName: courseName?.trim() || 'Local Club',
      notes: notes?.trim()
    };

    // Add and sort reverse chronological
    const combined = [newScore, ...currentUser.scores].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Retain strictly latest 5
    const latest5 = combined.slice(0, 5);

    setCurrentUser(prev => ({ ...prev, scores: latest5 }));
    setAllSubscribers(prev =>
      prev.map(u => u.id === currentUser.id ? { ...u, scores: latest5 } : u)
    );

    showToast(`Score of ${points} pts on ${date} logged! 5-score ticket updated.`);
    return { success: true };
  };

  const editGolfScore = (
    scoreId: string,
    points: number,
    date: string,
    courseName?: string,
    notes?: string
  ): { success: boolean; error?: string } => {
    if (points < 1 || points > 45 || isNaN(points)) {
      return { success: false, error: 'Stableford score must be between 1 and 45 points.' };
    }
    if (!date) {
      return { success: false, error: 'Date is required.' };
    }

    // Duplicate date check (excluding the current score being edited)
    const duplicate = currentUser.scores.find(s => s.id !== scoreId && s.date === date);
    if (duplicate) {
      return {
        success: false,
        error: 'A score already exists for this date.'
      };
    }

    const updated = currentUser.scores.map(s => {
      if (s.id === scoreId) {
        return {
          ...s,
          points,
          date,
          courseName: courseName?.trim() || s.courseName,
          notes: notes?.trim()
        };
      }
      return s;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    setCurrentUser(prev => ({ ...prev, scores: updated }));
    setAllSubscribers(prev =>
      prev.map(u => u.id === currentUser.id ? { ...u, scores: updated } : u)
    );

    showToast('Golf score updated successfully.');
    return { success: true };
  };

  const deleteGolfScore = (scoreId: string) => {
    const filtered = currentUser.scores.filter(s => s.id !== scoreId);
    setCurrentUser(prev => ({ ...prev, scores: filtered }));
    setAllSubscribers(prev =>
      prev.map(u => u.id === currentUser.id ? { ...u, scores: filtered } : u)
    );
    showToast('Score deleted from rolling buffer.');
  };

  const adminUpdateUserScores = (userId: string, scores: GolfScore[]) => {
    // Sort and limit to 5
    const cleanScores = [...scores]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    setAllSubscribers(prev =>
      prev.map(u => u.id === userId ? { ...u, scores: cleanScores } : u)
    );
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, scores: cleanScores }));
    }
    showToast('Admin updated subscriber scores.');
  };

  // Charity Directory Management
  const addCharity = (charity: Omit<Charity, 'id' | 'totalRaised'>) => {
    const newCharity: Charity = {
      ...charity,
      id: `charity-${Date.now()}`,
      totalRaised: 0
    };
    setCharities(prev => [newCharity, ...prev]);
    showToast(`New charity "${newCharity.name}" added to directory.`);
  };

  const updateCharity = (id: string, updates: Partial<Charity>) => {
    setCharities(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Charity profile updated.');
  };

  const deleteCharity = (id: string) => {
    setCharities(prev => prev.filter(c => c.id !== id));
    showToast('Charity removed from directory.');
  };

  const donateDirectly = (charityId: string, amount: number, donorName: string, message?: string) => {
    const charity = charities.find(c => c.id === charityId);
    if (!charity || amount <= 0) return;

    const donation: DirectDonation = {
      id: `don-${Date.now()}`,
      userId: currentUser.id,
      userName: donorName || currentUser.name,
      charityId,
      charityName: charity.name,
      amount,
      date: new Date().toISOString().split('T')[0],
      message
    };

    setDirectDonations(prev => [donation, ...prev]);
    setCharities(prev =>
      prev.map(c => c.id === charityId ? { ...c, totalRaised: c.totalRaised + amount } : c)
    );
    setCurrentUser(prev => ({
      ...prev,
      totalDonated: prev.totalDonated + amount
    }));

    showToast(`Direct gift of $${amount} to ${charity.name} processed! Thank you for being a hero.`);
  };

  // Draw & Simulation Engine (§06, §07)
  const runDrawSimulation = (logicType: DrawLogicType): DrawSimulationResult => {
    let winningNumbers: number[] = [];

    if (logicType === 'random') {
      // Pick 5 unique random numbers between 1 and 45
      const pool = Array.from({ length: 45 }, (_, i) => i + 1);
      for (let i = 0; i < 5; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        winningNumbers.push(pool[idx]);
        pool.splice(idx, 1);
      }
      winningNumbers.sort((a, b) => a - b);
    } else {
      // Algorithmic: Weighted by score frequency across all active subscribers' scores
      const freqMap = new Map<number, number>();
      for (let n = 1; n <= 45; n++) freqMap.set(n, 1); // baseline weight

      allSubscribers.forEach(sub => {
        sub.scores.forEach(sc => {
          if (sc.points >= 1 && sc.points <= 45) {
            freqMap.set(sc.points, (freqMap.get(sc.points) || 1) + 4);
          }
        });
      });

      // Sample 5 unique numbers based on frequency distribution
      const selected = new Set<number>();
      while (selected.size < 5) {
        let totalWeight = 0;
        freqMap.forEach((weight, num) => {
          if (!selected.has(num)) totalWeight += weight;
        });

        let rnd = Math.random() * totalWeight;
        for (const [num, weight] of freqMap.entries()) {
          if (selected.has(num)) continue;
          rnd -= weight;
          if (rnd <= 0) {
            selected.add(num);
            break;
          }
        }
      }
      winningNumbers = Array.from(selected).sort((a, b) => a - b);
    }

    // Now evaluate every subscriber with 5 scores (strictly active subscribers only per §04)
    const tier5Winners: { userId: string; name: string; numbers: number[]; matches: number[] }[] = [];
    const tier4Winners: { userId: string; name: string; numbers: number[]; matches: number[] }[] = [];
    const tier3Winners: { userId: string; name: string; numbers: number[]; matches: number[] }[] = [];

    allSubscribers.forEach(sub => {
      // Inactive subscribers can view the dashboard but cannot participate in draws (§04)
      if (sub.subscription.status !== 'active') return;
      if (sub.scores.length === 0) return;
      const userNumbers = sub.scores.map(s => s.points);
      const matches = userNumbers.filter(n => winningNumbers.includes(n));

      const winnerData = {
        userId: sub.id,
        name: sub.name,
        numbers: userNumbers,
        matches
      };

      if (matches.length >= 5) {
        tier5Winners.push(winnerData);
      } else if (matches.length === 4) {
        tier4Winners.push(winnerData);
      } else if (matches.length === 3) {
        tier3Winners.push(winnerData);
      }
    });

    // Prize pool splits:
    // 5-match: 40% (with rollover)
    // 4-match: 35% (no rollover)
    // 3-match: 25% (no rollover)
    const freshMonthlyPool = activeSubscribersCount * 18.5;
    const pool5Base = freshMonthlyPool * 0.40 + rolloverJackpot;
    const pool4 = freshMonthlyPool * 0.35;
    const pool3 = freshMonthlyPool * 0.25;

    const tier5RolloverOut = tier5Winners.length === 0 ? pool5Base : 0;
    const tier5PerWinner = tier5Winners.length > 0 ? Math.round((pool5Base / tier5Winners.length) * 100) / 100 : 0;
    const tier4PerWinner = tier4Winners.length > 0 ? Math.round((pool4 / tier4Winners.length) * 100) / 100 : 0;
    const tier3PerWinner = tier3Winners.length > 0 ? Math.round((pool3 / tier3Winners.length) * 100) / 100 : 0;

    return {
      winningNumbers,
      drawLogic: logicType,
      totalSubscribers: activeSubscribersCount,
      totalPrizePool: Math.round(pool5Base + pool4 + pool3),
      rolloverIn: rolloverJackpot,
      tier5Winners,
      tier4Winners,
      tier3Winners,
      summary: {
        tier5Amount: Math.round(pool5Base),
        tier4Amount: Math.round(pool4),
        tier3Amount: Math.round(pool3),
        tier5PerWinner,
        tier4PerWinner,
        tier3PerWinner,
        tier5RolloverOut: Math.round(tier5RolloverOut)
      }
    };
  };

  const publishOfficialDraw = (sim: DrawSimulationResult) => {
    const drawId = `draw-${Date.now()}`;
    const allWinnersList: DrawRecord['winners'] = [];

    // Tiers structure
    const tiers: DrawRecord['tiers'] = [
      {
        matchTier: '5-match',
        poolSharePercent: 40,
        poolAmount: sim.summary.tier5Amount,
        winnerCount: sim.tier5Winners.length,
        payoutPerWinner: sim.summary.tier5PerWinner,
        rolloverAmount: sim.summary.tier5RolloverOut
      },
      {
        matchTier: '4-match',
        poolSharePercent: 35,
        poolAmount: sim.summary.tier4Amount,
        winnerCount: sim.tier4Winners.length,
        payoutPerWinner: sim.summary.tier4PerWinner,
        rolloverAmount: 0
      },
      {
        matchTier: '3-match',
        poolSharePercent: 25,
        poolAmount: sim.summary.tier3Amount,
        winnerCount: sim.tier3Winners.length,
        payoutPerWinner: sim.summary.tier3PerWinner,
        rolloverAmount: 0
      }
    ];

    sim.tier5Winners.forEach(w => {
      allWinnersList.push({
        userId: w.userId,
        userName: w.name,
        userEmail: allSubscribers.find(s => s.id === w.userId)?.email || 'user@example.com',
        matchTier: '5-match',
        matchedNumbers: w.matches,
        amount: sim.summary.tier5PerWinner,
        verificationStatus: 'pending_verification'
      });
    });

    sim.tier4Winners.forEach(w => {
      allWinnersList.push({
        userId: w.userId,
        userName: w.name,
        userEmail: allSubscribers.find(s => s.id === w.userId)?.email || 'user@example.com',
        matchTier: '4-match',
        matchedNumbers: w.matches,
        amount: sim.summary.tier4PerWinner,
        verificationStatus: 'pending_verification'
      });
    });

    sim.tier3Winners.forEach(w => {
      allWinnersList.push({
        userId: w.userId,
        userName: w.name,
        userEmail: allSubscribers.find(s => s.id === w.userId)?.email || 'user@example.com',
        matchTier: '3-match',
        matchedNumbers: w.matches,
        amount: sim.summary.tier3PerWinner,
        verificationStatus: 'pending_verification'
      });
    });

    const newRecord: DrawRecord = {
      id: drawId,
      month: activeDrawMonth,
      drawDate: new Date().toISOString().split('T')[0],
      drawLogic: sim.drawLogic,
      winningNumbers: sim.winningNumbers,
      totalPrizePool: sim.totalPrizePool,
      rolloverFromPrevious: sim.rolloverIn,
      charityImpactTotal: Math.round(activeSubscribersCount * 5.8),
      activeSubscriberCount: sim.totalSubscribers,
      isPublished: true,
      tiers,
      winners: allWinnersList
    };

    setPastDraws(prev => [newRecord, ...prev]);

    // Check if current user won and award winning record
    const currentUserMatches = currentUser.scores.map(s => s.points).filter(p => sim.winningNumbers.includes(p));
    if (currentUserMatches.length >= 3) {
      const matchTier: '5-match' | '4-match' | '3-match' = currentUserMatches.length >= 5 ? '5-match' : currentUserMatches.length === 4 ? '4-match' : '3-match';
      const amount = matchTier === '5-match' ? sim.summary.tier5PerWinner : matchTier === '4-match' ? sim.summary.tier4PerWinner : sim.summary.tier3PerWinner;

      const winningItem: UserWinning = {
        id: `win-${Date.now()}`,
        drawId,
        drawMonth: activeDrawMonth,
        matchTier,
        matchedNumbers: currentUserMatches,
        amount,
        status: 'pending_verification' as PaymentStatus,
        submittedAt: new Date().toISOString().split('T')[0]
      };

      setCurrentUser(prev => ({
        ...prev,
        winnings: [winningItem, ...prev.winnings]
      }));

      setAllSubscribers(prev =>
        prev.map(u => u.id === currentUser.id ? {
          ...u,
          winnings: [winningItem, ...u.winnings]
        } : u)
      );
    }

    showToast(`Official Draw for ${activeDrawMonth} published! Winning numbers: ${sim.winningNumbers.join(' · ')}`);
  };

  // Winner Verification System (§09)
  const submitWinnerProof = (winningId: string, proofUrl: string) => {
    const updateWinning = (w: any) =>
      w.id === winningId
        ? { ...w, proofScreenshotUrl: proofUrl, status: 'pending_verification', submittedAt: new Date().toISOString().split('T')[0] }
        : w;

    setCurrentUser(prev => ({
      ...prev,
      winnings: prev.winnings.map(updateWinning)
    }));

    setAllSubscribers(prev =>
      prev.map(u => ({
        ...u,
        winnings: u.winnings.map(updateWinning)
      }))
    );

    // Also update in pastDraws
    setPastDraws(prev =>
      prev.map(draw => ({
        ...draw,
        winners: draw.winners.map(winner => {
          if (winner.userId === currentUser.id) {
            return { ...winner, proofUrl, verificationStatus: 'pending_verification' };
          }
          return winner;
        })
      }))
    );

    showToast('Scorecard proof uploaded! Admin has been notified for verification.');
  };

  const adminReviewWinner = (userId: string, winningId: string, decision: 'approved' | 'rejected', notes?: string) => {
    const status: PaymentStatus = decision === 'approved' ? 'approved' : 'rejected';

    setAllSubscribers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            winnings: u.winnings.map(w => w.id === winningId ? {
              ...w,
              status,
              reviewedAt: new Date().toISOString().split('T')[0],
              reviewNotes: notes || (decision === 'approved' ? 'Verified by Administrator' : 'Scorecard proof was rejected.')
            } : w)
          };
        }
        return u;
      })
    );

    if (currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        winnings: prev.winnings.map(w => w.id === winningId ? {
          ...w,
          status,
          reviewedAt: new Date().toISOString().split('T')[0],
          reviewNotes: notes || (decision === 'approved' ? 'Verified by Administrator' : 'Scorecard proof was rejected.')
        } : w)
      }));
    }

    setPastDraws(prev =>
      prev.map(d => ({
        ...d,
        winners: d.winners.map(w => w.userId === userId ? { ...w, verificationStatus: status } : w)
      }))
    );

    showToast(`Submission marked as ${decision.toUpperCase()}.`);
  };

  const adminMarkPayoutComplete = (userId: string, winningId: string) => {
    const txRef = `DH-TX-${Math.floor(100000 + Math.random() * 900000)}`;

    setAllSubscribers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            winnings: u.winnings.map(w => w.id === winningId ? {
              ...w,
              status: 'paid',
              paidAt: new Date().toISOString().split('T')[0],
              transactionRef: txRef
            } : w)
          };
        }
        return u;
      })
    );

    if (currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        winnings: prev.winnings.map(w => w.id === winningId ? {
          ...w,
          status: 'paid',
          paidAt: new Date().toISOString().split('T')[0],
          transactionRef: txRef
        } : w)
      }));
    }

    setPastDraws(prev =>
      prev.map(d => ({
        ...d,
        winners: d.winners.map(w => w.userId === userId ? { ...w, verificationStatus: 'paid' } : w)
      }))
    );

    showToast(`Payout marked as PAID. Reference: ${txRef}`);
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(INITIAL_SUBSCRIBER);
    setAllSubscribers([INITIAL_SUBSCRIBER, ...MOCK_COMMUNITY_SUBSCRIBERS]);
    setCharities(INITIAL_CHARITIES);
    setPastDraws(INITIAL_PAST_DRAWS);
    setDirectDonations(INITIAL_DIRECT_DONATIONS);
    setRole('subscriber');
    showToast('Platform reset to initial test dataset!');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        allSubscribers,
        loginAs,
        registerSubscriber,
        logout,

        subscribe,
        cancelSubscription,
        resumeSubscription,
        updateSubscriptionStatus,
        updateUserCharityChoice,

        addGolfScore,
        editGolfScore,
        deleteGolfScore,
        adminUpdateUserScores,

        charities,
        addCharity,
        updateCharity,
        deleteCharity,
        donateDirectly,
        directDonations,

        pastDraws,
        activeDrawMonth,
        activePoolAmount,
        rolloverJackpot,
        runDrawSimulation,
        publishOfficialDraw,

        submitWinnerProof,
        adminReviewWinner,
        adminMarkPayoutComplete,

        resetToDefaultData,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
