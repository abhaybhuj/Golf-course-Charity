import { Charity, UserProfile, DrawRecord, DirectDonation } from '../types';

export const INITIAL_CHARITIES: Charity[] = [
  {
    id: 'charity-1',
    name: 'Fairway Heroes for Veterans',
    tagline: 'Rehabilitation, mental health, and community through adaptive golf programs.',
    description: 'Providing wounded service members and first responders with adaptive equipment, peer mentorship, and therapy on golf courses nationwide. Every round supports trauma recovery and transition to civilian life.',
    category: 'Veterans & First Responders',
    logoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://veteransfairway.org',
    totalRaised: 148200,
    upcomingEvents: [
      {
        title: '2026 Spring Veterans Invitational',
        date: '2026-04-12',
        venue: 'The Dunes Golf Links',
        description: 'Annual 18-hole charity scramble pairing veterans with junior champions.'
      },
      {
        title: 'Adaptive Golf Clinic & Dinner',
        date: '2026-05-18',
        venue: 'St. Andrews Park Club',
        description: 'Demonstration of robotic prosthetics and inclusive swing dynamics.'
      }
    ],
    isFeatured: true
  },
  {
    id: 'charity-2',
    name: 'Children’s Heartline Foundation',
    tagline: 'Funding life-saving pediatric cardiology research and family housing.',
    description: 'Supporting children born with congenital heart defects and their families throughout hospital stays and surgical journeys. 100% of community contributions directly sponsor surgical equipment and bedside care.',
    category: 'Health & Medical',
    logoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://heartlinefoundation.org',
    totalRaised: 236400,
    upcomingEvents: [
      {
        title: 'Tiny Hearts Charity Classic',
        date: '2026-04-28',
        venue: 'Wentworth Estate Club',
        description: 'Pro-Am charity tournament with live silent auction and youth clinics.'
      }
    ],
    isFeatured: true
  },
  {
    id: 'charity-3',
    name: 'NextGen Fairways Trust',
    tagline: 'Empowering underprivileged youth through mentorship, education, and golf.',
    description: 'Providing under-resourced public school students with free equipment, STEM-based golf physics coaching, and college scholarship pathways.',
    category: 'Youth & Sport',
    logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://nextgenfairways.org',
    totalRaised: 94800,
    upcomingEvents: [
      {
        title: 'Urban Youth Drive & Putt Day',
        date: '2026-05-02',
        venue: 'Metropolitan Community Links',
        description: 'Interactive skills challenge and college scholarship awards.'
      }
    ],
    isFeatured: true
  },
  {
    id: 'charity-4',
    name: 'MindFairway Mental Health Alliance',
    tagline: 'Breaking the silence on athletic depression and men’s mental health.',
    description: 'Delivering confidential 24/7 crisis support lines, community wellness walks, and sports psychology workshops across clubs.',
    category: 'Mental Health',
    logoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://mindfairway.org',
    totalRaised: 182500,
    upcomingEvents: [
      {
        title: 'Mind & Momentum Charity Day',
        date: '2026-06-10',
        venue: 'Pine Ridge Championship Course',
        description: 'Mindfulness on the green followed by a panel discussion.'
      }
    ],
    isFeatured: false
  },
  {
    id: 'charity-5',
    name: 'Canopy & Waterways Sanctuary',
    tagline: 'Restoring native wildlife corridors and wetlands surrounding sports grounds.',
    description: 'Transforming golf courses into thriving biodiversity sanctuaries by planting native flora, filtering runoff, and installing owl nesting boxes.',
    category: 'Environment & Community',
    logoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://canopysanctuary.org',
    totalRaised: 112000,
    upcomingEvents: [
      {
        title: 'Greens to Wild Wetland Restoration',
        date: '2026-04-19',
        venue: 'Coastal Heathlands Reserve',
        description: 'Tree planting morning and community brunch.'
      }
    ],
    isFeatured: false
  }
];

export const INITIAL_SUBSCRIBER: UserProfile = {
  id: 'usr-subscriber-01',
  name: 'Alex Vance',
  email: 'subscriber@digitalheroes.com',
  role: 'subscriber',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  handicap: 14.2,
  homeClub: 'Bayside Golf & Country Club',
  subscription: {
    status: 'active',
    plan: 'yearly',
    startDate: '2026-01-15',
    renewalDate: '2027-01-15',
    amount: 290,
    autoRenew: true
  },
  scores: [
    { id: 'sc-1', points: 38, date: '2026-03-18', courseName: 'Bayside Championship Links', notes: 'Great putting day' },
    { id: 'sc-2', points: 34, date: '2026-03-12', courseName: 'Pine Ridge Pines', notes: 'Windy back nine' },
    { id: 'sc-3', points: 41, date: '2026-03-05', courseName: 'Royal Heathcourse', notes: 'Career best Stableford!' },
    { id: 'sc-4', points: 29, date: '2026-02-27', courseName: 'Bayside North 9', notes: 'Tough bunkers' },
    { id: 'sc-5', points: 36, date: '2026-02-20', courseName: 'Oak Valley Golf Club', notes: 'Solid iron play' }
  ],
  charityId: 'charity-1',
  charityPercentage: 20, // 20% voluntarily set (above 10% min)
  totalDonated: 116,
  drawsEnteredCount: 3,
  winnings: [
    {
      id: 'win-feb-01',
      drawId: 'draw-2026-02',
      drawMonth: 'February 2026',
      matchTier: '4-match',
      matchedNumbers: [34, 36, 38, 29],
      amount: 450,
      status: 'pending_verification',
      proofScreenshotUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&auto=format&fit=crop&q=80',
      submittedAt: '2026-03-02',
      reviewNotes: 'Awaiting official admin validation of scorecard screenshot.'
    },
    {
      id: 'win-jan-02',
      drawId: 'draw-2026-01',
      drawMonth: 'January 2026',
      matchTier: '3-match',
      matchedNumbers: [34, 38, 41],
      amount: 120,
      status: 'paid',
      proofScreenshotUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&auto=format&fit=crop&q=80',
      submittedAt: '2026-02-02',
      reviewedAt: '2026-02-03',
      paidAt: '2026-02-05',
      transactionRef: 'DH-PAY-882910'
    }
  ]
};

// Additional mock active subscribers to simulate realistic draw frequency weighting and ticket matching
export const MOCK_COMMUNITY_SUBSCRIBERS: UserProfile[] = [
  {
    id: 'usr-sub-02',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    role: 'subscriber',
    subscription: { status: 'active', plan: 'monthly', startDate: '2026-02-01', renewalDate: '2026-04-01', amount: 29, autoRenew: true },
    scores: [
      { id: 'sc-m1', points: 38, date: '2026-03-15' },
      { id: 'sc-m2', points: 41, date: '2026-03-09' },
      { id: 'sc-m3', points: 35, date: '2026-03-01' },
      { id: 'sc-m4', points: 32, date: '2026-02-22' },
      { id: 'sc-m5', points: 36, date: '2026-02-14' }
    ],
    charityId: 'charity-2',
    charityPercentage: 15,
    totalDonated: 43.5,
    drawsEnteredCount: 2,
    winnings: []
  },
  {
    id: 'usr-sub-03',
    name: 'Sarah Jenkins',
    email: 's.jenkins@golfclub.org',
    role: 'subscriber',
    subscription: { status: 'active', plan: 'yearly', startDate: '2026-01-10', renewalDate: '2027-01-10', amount: 290, autoRenew: true },
    scores: [
      { id: 'sc-s1', points: 42, date: '2026-03-17' },
      { id: 'sc-s2', points: 38, date: '2026-03-10' },
      { id: 'sc-s3', points: 39, date: '2026-03-03' },
      { id: 'sc-s4', points: 34, date: '2026-02-25' },
      { id: 'sc-s5', points: 28, date: '2026-02-18' }
    ],
    charityId: 'charity-3',
    charityPercentage: 25,
    totalDonated: 72.5,
    drawsEnteredCount: 3,
    winnings: []
  },
  {
    id: 'usr-sub-04',
    name: 'David O’Connor',
    email: 'doconnor@fairway.ie',
    role: 'subscriber',
    subscription: { status: 'active', plan: 'monthly', startDate: '2026-02-12', renewalDate: '2026-04-12', amount: 29, autoRenew: true },
    scores: [
      { id: 'sc-d1', points: 37, date: '2026-03-14' },
      { id: 'sc-d2', points: 34, date: '2026-03-08' },
      { id: 'sc-d3', points: 31, date: '2026-02-28' },
      { id: 'sc-d4', points: 40, date: '2026-02-21' },
      { id: 'sc-d5', points: 36, date: '2026-02-11' }
    ],
    charityId: 'charity-1',
    charityPercentage: 10,
    totalDonated: 29,
    drawsEnteredCount: 2,
    winnings: []
  },
  {
    id: 'usr-sub-05',
    name: 'Elena Rostova',
    email: 'elena.rostova@teeoff.com',
    role: 'subscriber',
    subscription: { status: 'active', plan: 'yearly', startDate: '2026-01-05', renewalDate: '2027-01-05', amount: 290, autoRenew: true },
    scores: [
      { id: 'sc-e1', points: 41, date: '2026-03-16' },
      { id: 'sc-e2', points: 36, date: '2026-03-07' },
      { id: 'sc-e3', points: 38, date: '2026-02-26' },
      { id: 'sc-e4', points: 35, date: '2026-02-19' },
      { id: 'sc-e5', points: 30, date: '2026-02-12' }
    ],
    charityId: 'charity-4',
    charityPercentage: 20,
    totalDonated: 58,
    drawsEnteredCount: 3,
    winnings: []
  },
  {
    id: 'usr-sub-06',
    name: 'Harrison Bradley',
    email: 'harrison.b@linksclub.co.uk',
    role: 'subscriber',
    subscription: { status: 'active', plan: 'monthly', startDate: '2026-03-01', renewalDate: '2026-04-01', amount: 29, autoRenew: true },
    scores: [
      { id: 'sc-h1', points: 34, date: '2026-03-18' },
      { id: 'sc-h2', points: 36, date: '2026-03-11' },
      { id: 'sc-h3', points: 33, date: '2026-03-04' },
      { id: 'sc-h4', points: 38, date: '2026-02-24' },
      { id: 'sc-h5', points: 27, date: '2026-02-15' }
    ],
    charityId: 'charity-5',
    charityPercentage: 10,
    totalDonated: 2.9,
    drawsEnteredCount: 1,
    winnings: []
  }
];

export const INITIAL_PAST_DRAWS: DrawRecord[] = [
  {
    id: 'draw-2026-02',
    month: 'February 2026',
    drawDate: '2026-02-28',
    drawLogic: 'algorithmic',
    winningNumbers: [34, 36, 38, 29, 15],
    totalPrizePool: 12500,
    rolloverFromPrevious: 3200,
    charityImpactTotal: 18450,
    activeSubscriberCount: 420,
    isPublished: true,
    tiers: [
      {
        matchTier: '5-match',
        poolSharePercent: 40,
        poolAmount: 5000,
        winnerCount: 0,
        payoutPerWinner: 0,
        rolloverAmount: 5000 // Unclaimed rollover to March!
      },
      {
        matchTier: '4-match',
        poolSharePercent: 35,
        poolAmount: 4375,
        winnerCount: 3,
        payoutPerWinner: 1458.33,
        rolloverAmount: 0
      },
      {
        matchTier: '3-match',
        poolSharePercent: 25,
        poolAmount: 3125,
        winnerCount: 14,
        payoutPerWinner: 223.21,
        rolloverAmount: 0
      }
    ],
    winners: [
      {
        userId: 'usr-subscriber-01',
        userName: 'Alex Vance',
        userEmail: 'subscriber@digitalheroes.com',
        matchTier: '4-match',
        matchedNumbers: [34, 36, 38, 29],
        amount: 450,
        verificationStatus: 'pending_verification',
        proofUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&auto=format&fit=crop&q=80'
      },
      {
        userId: 'usr-sub-04',
        userName: 'David O’Connor',
        userEmail: 'doconnor@fairway.ie',
        matchTier: '4-match',
        matchedNumbers: [34, 36, 31, 15],
        amount: 1458.33,
        verificationStatus: 'paid',
        proofUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'draw-2026-01',
    month: 'January 2026',
    drawDate: '2026-01-31',
    drawLogic: 'random',
    winningNumbers: [34, 38, 41, 22, 19],
    totalPrizePool: 9800,
    rolloverFromPrevious: 0,
    charityImpactTotal: 14200,
    activeSubscriberCount: 365,
    isPublished: true,
    tiers: [
      {
        matchTier: '5-match',
        poolSharePercent: 40,
        poolAmount: 3920,
        winnerCount: 0,
        payoutPerWinner: 0,
        rolloverAmount: 3200
      },
      {
        matchTier: '4-match',
        poolSharePercent: 35,
        poolAmount: 3430,
        winnerCount: 2,
        payoutPerWinner: 1715,
        rolloverAmount: 0
      },
      {
        matchTier: '3-match',
        poolSharePercent: 25,
        poolAmount: 2450,
        winnerCount: 11,
        payoutPerWinner: 222.72,
        rolloverAmount: 0
      }
    ],
    winners: [
      {
        userId: 'usr-subscriber-01',
        userName: 'Alex Vance',
        userEmail: 'subscriber@digitalheroes.com',
        matchTier: '3-match',
        matchedNumbers: [34, 38, 41],
        amount: 120,
        verificationStatus: 'paid'
      }
    ]
  }
];

export const INITIAL_DIRECT_DONATIONS: DirectDonation[] = [
  {
    id: 'don-1',
    userName: 'Golfers Against Cancer Society',
    charityId: 'charity-2',
    charityName: 'Children’s Heartline Foundation',
    amount: 500,
    date: '2026-03-14',
    message: 'Dedicated in honor of junior champion Liam.'
  },
  {
    id: 'don-2',
    userName: 'Bayside Senior Golf Tour',
    charityId: 'charity-1',
    charityName: 'Fairway Heroes for Veterans',
    amount: 750,
    date: '2026-03-10',
    message: 'Proceeds from our annual spring breakfast scramble.'
  }
];
