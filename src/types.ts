export type UserRole = 'visitor' | 'subscriber' | 'admin';

export type SubscriptionPlan = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'inactive' | 'lapsed' | 'cancelled';

export interface GolfScore {
  id: string;
  points: number; // 1 - 45 Stableford
  date: string;   // YYYY-MM-DD
  courseName?: string;
  notes?: string;
}

export interface Charity {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Health & Medical' | 'Youth & Sport' | 'Veterans & First Responders' | 'Mental Health' | 'Environment & Community';
  logoUrl: string;
  coverImage: string;
  websiteUrl: string;
  totalRaised: number;
  upcomingEvents: {
    title: string;
    date: string;
    venue: string;
    description: string;
  }[];
  isFeatured?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  handicap?: number;
  homeClub?: string;
  subscription: {
    status: SubscriptionStatus;
    plan: SubscriptionPlan;
    startDate: string;
    renewalDate: string;
    amount: number;
    autoRenew: boolean;
  };
  scores: GolfScore[]; // strictly latest 5 rolling scores
  charityId: string;
  charityPercentage: number; // min 10%
  totalDonated: number;
  drawsEnteredCount: number;
  winnings: UserWinning[];
}

export type PaymentStatus = 'pending_verification' | 'approved' | 'paid' | 'rejected';

export interface UserWinning {
  id: string;
  drawId: string;
  drawMonth: string;
  matchTier: '5-match' | '4-match' | '3-match';
  matchedNumbers: number[];
  amount: number;
  status: PaymentStatus;
  proofScreenshotUrl?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  paidAt?: string;
  transactionRef?: string;
}

export type DrawLogicType = 'random' | 'algorithmic';

export interface DrawTierSummary {
  matchTier: '5-match' | '4-match' | '3-match';
  poolSharePercent: number; // 40, 35, 25
  poolAmount: number;
  winnerCount: number;
  payoutPerWinner: number;
  rolloverAmount: number;
}

export interface DrawRecord {
  id: string;
  month: string; // e.g., "March 2026"
  drawDate: string;
  drawLogic: DrawLogicType;
  winningNumbers: number[]; // 5 unique numbers (1-45)
  totalPrizePool: number;
  rolloverFromPrevious: number;
  charityImpactTotal: number;
  activeSubscriberCount: number;
  isPublished: boolean;
  tiers: DrawTierSummary[];
  winners: {
    userId: string;
    userName: string;
    userEmail: string;
    matchTier: '5-match' | '4-match' | '3-match';
    matchedNumbers: number[];
    amount: number;
    verificationStatus: PaymentStatus;
    proofUrl?: string;
  }[];
}

export interface DrawSimulationResult {
  winningNumbers: number[];
  drawLogic: DrawLogicType;
  totalSubscribers: number;
  totalPrizePool: number;
  rolloverIn: number;
  tier5Winners: { userId: string; name: string; numbers: number[]; matches: number[] }[];
  tier4Winners: { userId: string; name: string; numbers: number[]; matches: number[] }[];
  tier3Winners: { userId: string; name: string; numbers: number[]; matches: number[] }[];
  summary: {
    tier5Amount: number;
    tier4Amount: number;
    tier3Amount: number;
    tier5PerWinner: number;
    tier4PerWinner: number;
    tier3PerWinner: number;
    tier5RolloverOut: number;
  };
}

export interface DirectDonation {
  id: string;
  userId?: string;
  userName: string;
  charityId: string;
  charityName: string;
  amount: number;
  date: string;
  message?: string;
}

export interface NewSubscriberPayload {
  name: string;
  email: string;
  password?: string;
  homeClub?: string;
  handicap?: number;
  plan: SubscriptionPlan;
  charityId: string;
  charityPercentage: number;
  initialScores?: number[];
}

export type NavigationTab = 'home' | 'charities' | 'draws' | 'dashboard' | 'admin' | 'login' | 'signup';

