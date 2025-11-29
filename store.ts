



import { create } from 'zustand';
import { UserRole, Crop, Offer, RiskLevel, ForumPost, Expert, Order, StorageRequest, DeployedUnit, RetailerRequest, Negotiation, Comment, ExpertQuestion, Message, BarterListing, RentalHistory, BarterRequest, Notification, UnitType, RetailerAnalytics, ServiceTask, ServiceTaskType, DeliveryTracking, PromotionPlan } from './types';

export interface UserProfile {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    district?: string;
    // Role specific fields
    farmName?: string;
    companyName?: string;
    serviceArea?: string;
    specialization?: string;
}

interface AppState {
  currentUserRole: UserRole | null;
  userProfile: UserProfile | null; // New: To store logged in user details
  isAuthenticated: boolean;
  setUserRole: (role: UserRole) => void;
  setUserProfile: (profile: UserProfile) => void; // New action
  login: () => void;
  logout: () => void;
  
  // Mock Data Store
  crops: Crop[];
  offers: Offer[];
  orders: Order[];
  posts: ForumPost[];
  experts: Expert[];
  expertQuestions: ExpertQuestion[];
  credits: number;
  
  // Mobile Storage
  storageRequests: StorageRequest[];
  deployedUnits: DeployedUnit[];
  rentalHistory: RentalHistory[];
  
  retailerRequests: RetailerRequest[];
  negotiations: Negotiation[];
  barterListings: BarterListing[];
  barterRequests: BarterRequest[];
  
  // Split Notifications
  farmerNotifications: Notification[];
  retailerNotifications: Notification[];
  serviceNotifications: Notification[];

  // Service Role Data
  serviceTasks: ServiceTask[];

  // New Retailer Features
  watchlist: string[]; // List of Crop IDs
  retailerAnalytics: RetailerAnalytics;
  isRetailerVerified: boolean;
  
  // Actions
  addCrop: (crop: Crop) => void;
  updateCrop: (updatedCrop: Crop) => void;
  deleteCrop: (id: string) => void;
  togglePromote: (id: string) => void;
  promoteCrop: (id: string, plan: PromotionPlan) => void;
  checkPromotionStatus: () => void;
  
  addOffer: (offer: Offer) => void;
  withdrawOffer: (id: string) => void;
  updateOfferStatus: (id: string, status: Offer['status']) => void;
  addOfferMessage: (offerId: string, message: Message) => void;
  
  // Mobile Storage Actions
  createStorageRequest: (request: StorageRequest) => void;
  cancelRequest: (id: string) => void;
  extendRental: (id: string, days: number) => void;
  rentAgain: (historyId: string) => void;
  requestMaintenance: (unitId: string, issue: string, priority?: string, preferredTime?: string) => void;
  
  togglePostLike: (postId: string) => void;
  addPostComment: (postId: string, comment: Comment) => void;
  createPost: (post: ForumPost) => void;
  deletePost: (postId: string) => void;
  
  // Expert Actions
  askExpertQuestion: (question: ExpertQuestion) => void;
  sendExpertMessage: (questionId: string, message: string, attachment?: string) => void;
  replyToFarmer: (questionId: string, message: string, attachment?: string) => void;
  resolveExpertQuestion: (questionId: string) => void;
  rateExpertSession: (questionId: string, rating: number, feedback: string) => void;
  
  convertRequestToOffer: (requestId: string, offer: Negotiation) => void;
  rejectRetailerRequest: (requestId: string) => void;
  
  updateNegotiation: (id: string, message: Message, newPrice?: number) => void;
  acceptNegotiation: (id: string) => void;

  addBarterListing: (listing: BarterListing) => void;
  requestBarterService: (listing: BarterListing) => boolean;
  acceptBarterService: (requestId: string) => void;
  completeBarterService: (requestId: string) => void;
  rateBarterService: (requestId: string, rating: number, feedback: string) => void;
  raiseDispute: (requestId: string, reason: string) => void;
  resolveDispute: (requestId: string, outcome: 'REFUND' | 'RELEASE') => void;
  
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Retailer Actions
  toggleWatchlist: (cropId: string) => void;
  requestQACheck: (cropId: string) => void;
  triggerPriceDropAlert: () => void; // For demo
  
  // Service Actions
  acceptServiceTask: (id: string) => void;
  updateServiceTaskStatus: (id: string, status: ServiceTask['status']) => void;
  completeServiceTask: (id: string, resolution?: string) => void;
  approveQACheck: (cropId: string) => void;
  updateDeliveryStep: (taskId: string, stepIndex: number) => void;
  updateMaintenanceStage: (taskId: string, stage: 'DIAGNOSTIC' | 'FIXING', notes?: string) => void;
  sendServiceMessage: (taskId: string, text: string, sender: 'Service' | 'Farmer' | 'System', attachment?: string) => void;
  markTaskRead: (taskId: string) => void;
  escalateTask: (taskId: string, targetType: ServiceTaskType, note: string) => void;
  
  // Delivery Tracking Actions
  startDeliverySimulation: (taskId: string) => void;
  updateDeliveryProgress: (taskId: string, progress: number) => void;
  stopDeliverySimulation: (taskId: string) => void;
}

// ... MOCK DATA SEEDING ...

// 1. CROPS (MARKET CONNECTOR LISTINGS)
const MOCK_CROPS: Crop[] = [
  {
    id: '1', name: 'Nendran Banana', variety: 'Organic Changeolikodan', location: 'Wayanad, Kerala', farmerName: 'John Doe', farmerRating: 4.8, storageUnitId: 'UNIT-104', quantity: 500, pricePerKg: 45, harvestDate: '2023-10-25', imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=500&auto=format&fit=crop', isPromoted: true, views: 230, inquiries: 15, visibilityScore: 95, priority: 'URGENT', category: 'Fruits',
    monitoring: { temperature: 18.5, humidity: 92, aiRiskScore: 92, riskLevel: RiskLevel.HIGH, recommendation: 'Take action within 8 hrs.', explanation: 'Temp 5.5°C above ideal. Ethylene accumulation detected.', confidence: 94, spoilageHours: 24 },
    priceHistory: [{ date: 'Mon', price: 48 }, { date: 'Tue', price: 47 }, { date: 'Wed', price: 46 }, { date: 'Thu', price: 45 }, { date: 'Fri', price: 45 }], qaStatus: 'VERIFIED'
  },
  {
    id: '2', name: 'Green Cardamom', variety: 'Alleppey Green', location: 'Idukki, Kerala', farmerName: 'John Doe', farmerRating: 4.5, storageUnitId: 'UNIT-202', quantity: 120, pricePerKg: 1200, harvestDate: '2023-10-20', imageUrl: 'https://images.unsplash.com/photo-1550397623-287db30d0fb3?q=80&w=500&auto=format&fit=crop', isPromoted: false, views: 42, inquiries: 4, visibilityScore: 40, priority: 'HIGH', category: 'Spices',
    monitoring: { temperature: 22.2, humidity: 95, aiRiskScore: 88, riskLevel: RiskLevel.HIGH, recommendation: 'Immediate ventilation needed.', explanation: 'Humidity >90% causing rapid fungal growth risk.', confidence: 89, spoilageHours: 18 },
    priceHistory: [{ date: 'Mon', price: 1250 }, { date: 'Tue', price: 1230 }, { date: 'Wed', price: 1210 }, { date: 'Thu', price: 1200 }, { date: 'Fri', price: 1200 }], qaStatus: 'NONE'
  },
  {
    id: '3', name: 'Black Pepper', variety: 'Tellicherry Extra Bold', location: 'Munnar, Kerala', farmerName: 'John Doe', farmerRating: 4.9, storageUnitId: 'UNIT-305', quantity: 800, pricePerKg: 450, harvestDate: '2023-10-28', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&auto=format&fit=crop', isPromoted: true, views: 156, inquiries: 28, visibilityScore: 88, priority: 'NORMAL', category: 'Spices',
    monitoring: { temperature: 22.0, humidity: 78, aiRiskScore: 55, riskLevel: RiskLevel.MODERATE, recommendation: 'Monitor temp fluctuations.', explanation: 'Slight temperature variance detected.', confidence: 75, spoilageHours: 65 },
    priceHistory: [{ date: 'Mon', price: 440 }, { date: 'Tue', price: 445 }, { date: 'Wed', price: 450 }, { date: 'Thu', price: 450 }, { date: 'Fri', price: 450 }], qaStatus: 'VERIFIED'
  },
  {
    id: '4', name: 'Ginger', variety: 'Wayanad Local', location: 'Wayanad, Kerala', farmerName: 'John Doe', farmerRating: 4.8, storageUnitId: 'N/A', quantity: 200, pricePerKg: 60, harvestDate: '2023-11-01', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=500&auto=format&fit=crop', isPromoted: false, views: 12, inquiries: 1, visibilityScore: 45, priority: 'NORMAL', category: 'Tubers',
    monitoring: { temperature: 24, humidity: 65, aiRiskScore: 20, riskLevel: RiskLevel.LOW, recommendation: 'Stable condition.', explanation: 'Storage conditions optimal.', confidence: 90, spoilageHours: 120 },
    priceHistory: [], qaStatus: 'NONE'
  },
  {
    id: '5', name: 'Tapioca', variety: 'Malabar Special', location: 'Wayanad, Kerala', farmerName: 'John Doe', farmerRating: 4.8, storageUnitId: 'N/A', quantity: 1000, pricePerKg: 25, harvestDate: '2023-10-30', imageUrl: 'https://images.unsplash.com/photo-1592186309879-fb54893cb9e4?q=80&w=500&auto=format&fit=crop', isPromoted: false, views: 30, inquiries: 5, visibilityScore: 60, priority: 'HIGH', category: 'Tubers',
    monitoring: { temperature: 26, humidity: 70, aiRiskScore: 15, riskLevel: RiskLevel.LOW, recommendation: 'Sell within 3 days.', explanation: 'Post-harvest shelf life limited.', confidence: 85, spoilageHours: 72 },
    priceHistory: [], qaStatus: 'NONE'
  },
  // Expanded Data for Retailer Browsing
  {
    id: '6', name: 'Nutmeg', variety: 'Viswashree', location: 'Thrissur, Kerala', farmerName: 'Vinu George', farmerRating: 4.7, storageUnitId: 'UNIT-401', quantity: 300, pricePerKg: 550, harvestDate: '2023-11-05', imageUrl: 'https://images.unsplash.com/photo-1597528351508-4c94747c3208?q=80&w=500&auto=format&fit=crop', isPromoted: false, views: 45, inquiries: 8, visibilityScore: 55, priority: 'NORMAL', category: 'Spices',
    monitoring: { temperature: 26, humidity: 60, aiRiskScore: 12, riskLevel: RiskLevel.LOW, recommendation: 'Good condition.', explanation: 'Dry storage maintained.', confidence: 92, spoilageHours: 140 },
    priceHistory: [{ date: 'Mon', price: 540 }, { date: 'Tue', price: 545 }, { date: 'Wed', price: 550 }, { date: 'Thu', price: 550 }, { date: 'Fri', price: 550 }], qaStatus: 'VERIFIED'
  },
  {
    id: '7', name: 'Turmeric', variety: 'Prathibha', location: 'Palakkad, Kerala', farmerName: 'Ramesh K', farmerRating: 4.6, storageUnitId: 'N/A', quantity: 1500, pricePerKg: 85, harvestDate: '2023-10-15', imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e99099928b3?q=80&w=500&auto=format&fit=crop', isPromoted: true, views: 110, inquiries: 12, visibilityScore: 85, priority: 'HIGH', category: 'Spices',
    monitoring: { temperature: 28, humidity: 55, aiRiskScore: 25, riskLevel: RiskLevel.LOW, recommendation: 'Stable.', explanation: 'Low moisture content.', confidence: 95, spoilageHours: 300 },
    priceHistory: [], qaStatus: 'NONE'
  },
  {
    id: '8', name: 'Coconut', variety: 'WCT (West Coast Tall)', location: 'Kozhikode, Kerala', farmerName: 'Soman P', farmerRating: 4.9, storageUnitId: 'N/A', quantity: 2000, pricePerKg: 32, harvestDate: '2023-11-10', imageUrl: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?q=80&w=500&auto=format&fit=crop', isPromoted: false, views: 65, inquiries: 5, visibilityScore: 60, priority: 'NORMAL', category: 'Others',
    monitoring: { temperature: 27, humidity: 70, aiRiskScore: 10, riskLevel: RiskLevel.LOW, recommendation: 'No issues.', explanation: 'Standard ambient storage.', confidence: 98, spoilageHours: 168 },
    priceHistory: [], qaStatus: 'VERIFIED'
  }
];

// 2. STORAGE REQUESTS (PENDING)
const MOCK_STORAGE_REQUESTS: StorageRequest[] = [
    {
        id: 'sr1',
        unitType: 'Portable Fresh Storage',
        crop: 'Tomato',
        quantity: 200,
        duration: 7,
        startDate: '2023-11-10',
        location: 'Wayanad',
        cost: 5250,
        status: 'REQUESTED',
        requestDate: '2023-11-01',
        timeline: [{ status: 'REQUESTED', date: '2023-11-01', completed: true }]
    },
    {
        id: 'sr2',
        unitType: 'Multi-Crop Storage',
        crop: 'Potato',
        quantity: 800,
        duration: 14,
        startDate: '2023-11-12',
        location: 'Idukki',
        cost: 16800,
        status: 'ASSIGNED',
        requestDate: '2023-10-28',
        serviceMember: 'Ramesh Kumar',
        timeline: [
            { status: 'REQUESTED', date: '2023-10-28', completed: true },
            { status: 'ASSIGNED', date: '2023-10-29', completed: true }
        ]
    },
    {
        id: 'sr3',
        unitType: 'Controlled Atmosphere (CA)',
        crop: 'Apple',
        quantity: 1500,
        duration: 30,
        startDate: '2023-11-15',
        location: 'Munnar',
        cost: 75000,
        status: 'DISPATCHED',
        requestDate: '2023-10-25',
        serviceMember: 'Team Logistics',
        eta: '4 hours',
        timeline: [
            { status: 'REQUESTED', date: '2023-10-25', completed: true },
            { status: 'ASSIGNED', date: '2023-10-26', completed: true },
            { status: 'DISPATCHED', date: '2023-11-01', completed: true }
        ]
    }
];

// 3. DEPLOYED UNITS (ACTIVE)
const MOCK_DEPLOYED_UNITS: DeployedUnit[] = [
    {
        id: 'du1',
        unitId: 'UNIT-104',
        unitType: 'Portable Fresh Storage',
        name: 'FarmFresh Mini #104',
        crop: 'Nendran Banana',
        load: '500 kg',
        deployedDate: '2023-10-20',
        pickupDate: '2023-11-05',
        remainingDays: 5,
        location: 'Wayanad Farm, Sector 4',
        temperature: { current: 18.5, target: 13 },
        humidity: { current: 92, target: 85 },
        battery: 78,
        status: 'Active',
        riskLevel: 'High',
        recommendation: 'Cooling system strain detected.',
        alerts: ['Temp Spike'],
        telemetryHistory: Array.from({length: 10}, (_,i) => ({ time: `${10+i}:00`, temp: 18+Math.random(), humidity: 90+Math.random() })),
        maintenanceTicket: undefined
    },
    {
        id: 'du2',
        unitId: 'UNIT-202',
        unitType: 'Multi-Crop Storage',
        name: 'MultiCrop Pro #202',
        crop: 'Green Cardamom',
        load: '120 kg',
        deployedDate: '2023-10-15',
        pickupDate: '2023-11-15',
        remainingDays: 12,
        location: 'Idukki Estate',
        temperature: { current: 22.2, target: 22 },
        humidity: { current: 60, target: 60 },
        battery: 95,
        status: 'Active',
        riskLevel: 'Low',
        recommendation: 'Optimal conditions.',
        alerts: [],
        telemetryHistory: Array.from({length: 10}, (_,i) => ({ time: `${10+i}:00`, temp: 22+Math.random(), humidity: 60+Math.random() })),
        maintenanceTicket: undefined
    },
    {
        id: 'du3',
        unitId: 'UNIT-305',
        unitType: 'Ethylene Ripening Chamber',
        name: 'Ripening Pod #305',
        crop: 'Mango',
        load: '400 kg',
        deployedDate: '2023-11-01',
        pickupDate: '2023-11-04',
        remainingDays: 2,
        location: 'Kottayam',
        temperature: { current: 25, target: 25 },
        humidity: { current: 80, target: 80 },
        battery: 40,
        status: 'Maintenance',
        riskLevel: 'Moderate',
        recommendation: 'Filter check required.',
        alerts: ['Filter Warning'],
        telemetryHistory: Array.from({length: 10}, (_,i) => ({ time: `${10+i}:00`, temp: 25+Math.random(), humidity: 80+Math.random() })),
        maintenanceTicket: { issue: 'Filter clog warning', date: 'Yesterday', status: 'OPEN' }
    }
];

// 4. RENTAL HISTORY
const MOCK_RENTAL_HISTORY: RentalHistory[] = [
    {
        id: 'rh1',
        unitType: 'Portable Fresh Storage',
        crop: 'Chilli',
        dates: 'Sept 10 - Sept 20',
        location: 'Wayanad',
        cost: 7500,
        status: 'COMPLETED',
        rating: 5
    },
    {
        id: 'rh2',
        unitType: 'Controlled Atmosphere (CA)',
        crop: 'Apple',
        dates: 'Aug 01 - Aug 30',
        location: 'Munnar',
        cost: 75000,
        status: 'COMPLETED',
        rating: 4
    },
    {
        id: 'rh3',
        unitType: 'Multi-Crop Storage',
        crop: 'Onion',
        dates: 'Oct 05 - Oct 10',
        location: 'Palakkad',
        cost: 6000,
        status: 'CANCELLED'
    },
    {
        id: 'rh4',
        unitType: 'Portable Fresh Storage',
        crop: 'Tomato',
        dates: 'Jul 15 - Jul 22',
        location: 'Wayanad',
        cost: 5250,
        status: 'COMPLETED',
        rating: 5
    }
];

// 5. RETAILER REQUESTS
const MOCK_RETAILER_REQUESTS: RetailerRequest[] = [
    {
        id: 'rr1',
        cropName: 'Nendran Banana',
        retailerName: 'FreshMart Ltd.',
        retailerRating: 4.8,
        location: 'Kochi',
        quantityNeeded: 1000,
        maxPrice: 50,
        deadline: '2 days',
        responses: 3,
        requirements: 'Organic certified, medium size',
        urgency: 'High',
        status: 'Open'
    },
    {
        id: 'rr2',
        cropName: 'Cardamom',
        retailerName: 'Kochi Spices',
        retailerRating: 4.5,
        location: 'Kochi',
        quantityNeeded: 200,
        maxPrice: 1300,
        deadline: '1 week',
        responses: 5,
        requirements: 'Export quality, 8mm bold',
        urgency: 'Medium',
        status: 'Open'
    },
    {
        id: 'rr3',
        cropName: 'Pineapple',
        retailerName: 'Lulu Hypermarket',
        retailerRating: 4.9,
        location: 'Edappally',
        quantityNeeded: 5000,
        maxPrice: 35,
        deadline: '5 days',
        responses: 12,
        requirements: 'Vazhakulam variety only',
        urgency: 'High',
        status: 'Open'
    },
    {
        id: 'rr4',
        cropName: 'Ginger',
        retailerName: 'Roots & Tubers Co.',
        retailerRating: 4.2,
        location: 'Calicut',
        quantityNeeded: 500,
        maxPrice: 70,
        deadline: '3 days',
        responses: 2,
        requirements: 'Washed and dried',
        urgency: 'Low',
        status: 'Closed'
    }
];

// 6. NEGOTIATIONS
const MOCK_NEGOTIATIONS: Negotiation[] = [
    {
        id: 'neg1',
        retailerName: 'FreshMart Ltd.',
        retailerId: 'ret1',
        cropName: 'Nendran Banana',
        cropId: '1',
        date: 'Yesterday',
        offeredPrice: 42,
        quantity: 500,
        retailerMessage: 'Can you do 42/kg if we take all 500kg?',
        history: [
            { id: '1', sender: 'Retailer', content: 'Offer received for 500kg at 45/kg.', timestamp: 'Yesterday' },
            { id: '2', sender: 'Retailer', content: 'Can you do 42/kg if we take all 500kg?', timestamp: 'Yesterday' }
        ],
        status: 'Negotiating'
    },
    {
        id: 'neg2',
        retailerName: 'Kerala Spices Export',
        retailerId: 'ret2',
        cropName: 'Black Pepper',
        cropId: '3',
        date: '2 days ago',
        offeredPrice: 450,
        quantity: 800,
        retailerMessage: 'Price accepted. Please confirm delivery date.',
        history: [
            { id: '1', sender: 'Retailer', content: 'We accept your price of 450/kg.', timestamp: '2 days ago' },
            { id: '2', sender: 'Retailer', content: 'Price accepted. Please confirm delivery date.', timestamp: '2 days ago' }
        ],
        status: 'Accepted'
    }
];

// 7. FORUM POSTS
const MOCK_FORUM_POSTS: ForumPost[] = [
    {
        id: 'fp1',
        author: 'Ravi Verma',
        role: 'Farmer',
        location: 'Wayanad',
        title: 'Yellowing leaves in Pepper vines?',
        content: 'Noticed sudden yellowing in my pepper vines after the rains. Is this quick wilt? What immediate measures can I take?',
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&auto=format&fit=crop',
        likes: 12,
        commentsCount: 4,
        commentsList: [
            { id: 'c1', author: 'Dr. Aruna', role: 'Expert', content: 'It could be quick wilt. Check for root rot. Apply Bordeaux mixture.', timestamp: '1 hour ago' },
            { id: 'c2', author: 'Suresh K', role: 'Farmer', content: 'I faced this last year. Drainage is key.', timestamp: '30 mins ago' }
        ],
        timeAgo: '2 hours ago',
        tags: ['Disease', 'Pepper', 'Urgent'],
        isOwner: false,
        isLiked: false
    },
    {
        id: 'fp2',
        author: 'Biju Thomas',
        role: 'Farmer',
        location: 'Idukki',
        title: 'Heavy rains predicted for next week',
        content: 'IMD has issued an orange alert. Secure your storage units and harvest mature crops if possible.',
        likes: 45,
        commentsCount: 12,
        commentsList: [],
        timeAgo: '5 hours ago',
        tags: ['Weather', 'Alert'],
        isOwner: false,
        isLiked: true
    },
    {
        id: 'fp3',
        author: 'John Doe',
        role: 'Farmer',
        location: 'Wayanad',
        title: 'Best time to harvest Nendran?',
        content: 'My bananas are 80% mature. Should I wait for full maturity or harvest now given the rain forecast?',
        likes: 5,
        commentsCount: 2,
        commentsList: [],
        timeAgo: '1 day ago',
        tags: ['Banana', 'Harvest'],
        isOwner: true,
        isLiked: false
    }
];

// 8. EXPERT QUESTIONS
const MOCK_EXPERT_QUESTIONS: ExpertQuestion[] = [
    {
        id: 'eq1',
        farmerName: 'John Doe',
        crop: 'Nendran Banana',
        title: 'Yellow spots on leaves',
        description: 'I noticed these yellow spots spreading on the lower leaves. Is it fungal?',
        status: 'IN_PROGRESS',
        date: '2 hours ago',
        unreadCount: 1,
        history: [
            { id: '1', sender: 'Farmer', content: 'I noticed these yellow spots spreading on the lower leaves. Is it fungal?', timestamp: '2 hours ago', type: 'text', isRead: true },
            { id: '2', sender: 'Farmer', content: 'Attached photo of leaf', timestamp: '2 hours ago', type: 'image', attachmentUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&auto=format&fit=crop', isRead: true },
            { id: '3', sender: 'Expert', content: 'Hello! This looks like Sigatoka Leaf Spot. Are you seeing this on young leaves too?', timestamp: '1 hour ago', type: 'text', isRead: false }
        ]
    },
    {
        id: 'eq2',
        farmerName: 'John Doe',
        crop: 'Cardamom',
        title: 'Capsule Rot Prevention',
        description: 'Heavy rains expected. How to prevent rot?',
        status: 'RESOLVED',
        date: '2 days ago',
        rating: 5,
        history: [
            { id: '1', sender: 'Farmer', content: 'Heavy rains expected. How to prevent rot?', timestamp: '2 days ago', type: 'text', isRead: true },
            { id: '2', sender: 'Expert', content: 'Ensure proper drainage immediately. Apply 1% Bordeaux mixture as a prophylactic spray.', timestamp: '2 days ago', type: 'text', isRead: true },
            { id: '3', sender: 'Farmer', content: 'Thank you! Will do.', timestamp: '2 days ago', type: 'text', isRead: true },
            { id: '4', sender: 'System', content: 'This conversation has been marked as resolved.', timestamp: '2 days ago', type: 'system', isRead: true }
        ]
    },
    {
        id: 'eq3',
        farmerName: 'Ravi Verma',
        crop: 'Black Pepper',
        title: 'Wilt Disease Management',
        description: 'Pepper vines showing signs of quick wilt. Need advice on soil treatment.',
        status: 'OPEN',
        date: '1 day ago',
        unreadCount: 0,
        history: [
            { id: '1', sender: 'Farmer', content: 'My pepper vines are wilting rapidly after the last rain. I suspect Quick Wilt.', timestamp: '1 day ago', type: 'text', isRead: true }
        ]
    },
    {
        id: 'eq4',
        farmerName: 'Soman P',
        crop: 'Coconut',
        title: 'Nut fall issue',
        description: 'Premature nut fall in 5 year old trees.',
        status: 'OPEN',
        date: '3 hours ago',
        unreadCount: 0,
        history: [
            { id: '1', sender: 'Farmer', content: 'Seeing a lot of immature nuts falling. Is this due to boron deficiency?', timestamp: '3 hours ago', type: 'text', isRead: true }
        ]
    }
];

// 9. BARTER LISTINGS
const MOCK_BARTER_LISTINGS: BarterListing[] = [
    {
        id: 'bl1',
        providerName: 'Soman P',
        providerId: 'prov1',
        serviceType: 'Tractor Rental',
        description: 'Mahindra Tractor available for plowing. 4 hours minimum.',
        district: 'Wayanad',
        creditCost: 150,
        status: 'AVAILABLE',
        date: '1 day ago',
        providerRating: 4.8,
        reviewsCount: 15
    },
    {
        id: 'bl2',
        providerName: 'Vinu George',
        providerId: 'prov2',
        serviceType: 'Harvesting Labor',
        description: 'Team of 4 skilled laborers for paddy harvesting.',
        district: 'Palakkad',
        creditCost: 400,
        status: 'BUSY',
        date: '2 days ago',
        providerRating: 4.5,
        reviewsCount: 8
    },
    {
        id: 'bl3',
        providerName: 'Mani T',
        providerId: 'prov3',
        serviceType: 'Pickup Truck',
        description: 'Tata Ace for local transport (up to 50km).',
        district: 'Idukki',
        creditCost: 200,
        status: 'AVAILABLE',
        date: '3 days ago',
        providerRating: 4.9,
        reviewsCount: 22
    }
];

// 10. BARTER REQUESTS
const MOCK_BARTER_REQUESTS: BarterRequest[] = [
    {
        id: 'br1',
        listingId: 'bl4',
        serviceType: 'Pesticide Spraying',
        requesterId: 'curr-user',
        requesterName: 'John Doe',
        providerId: 'prov4',
        providerName: 'Rahul K',
        creditCost: 100,
        status: 'COMPLETED',
        requestDate: 'Last week',
        rating: 5,
        feedback: 'Great job, very efficient.'
    },
    {
        id: 'br2',
        listingId: 'bl5',
        serviceType: 'Water Pump Rental',
        requesterId: 'curr-user',
        requesterName: 'John Doe',
        providerId: 'prov5',
        providerName: 'Anil B',
        creditCost: 50,
        status: 'ACCEPTED',
        requestDate: 'Yesterday'
    }
];

// 11. SERVICE TASKS
const MOCK_SERVICE_TASKS: ServiceTask[] = [
    {
        id: 'st_del_1',
        type: 'DELIVERY',
        title: 'Cold Chain Pickup',
        description: 'Pickup 500kg Bananas from Ramesh Kumar. Reefer truck required to maintain 13°C.',
        requesterName: 'Ramesh Kumar',
        location: 'Wayanad -> Kochi',
        priority: 'HIGH',
        status: 'ACCEPTED',
        date: '2 hours ago',
        earnings: 150,
        metadata: {
            deliverySteps: [
                { name: 'Arrive at Farm (Wayanad)', completed: true, time: '08:30 AM' },
                { name: 'Quality Check & Load', completed: false },
                { name: 'Transit to Kochi Hub', completed: false },
                { name: 'Unload at Terminal', completed: false }
            ],
            chatHistory: [
                { id: '1', sender: 'Farmer', content: 'Truck is here. Loading started.', timestamp: '08:45 AM', type: 'text' }
            ],
            tracking: {
                isActive: true,
                currentLocation: { lat: 11.6854, lng: 76.1320, name: 'Kalpetta Highway' },
                origin: { lat: 11.6084, lng: 76.0820, name: 'Ramesh Farm, Wayanad' },
                destination: { lat: 9.9312, lng: 76.2673, name: 'Kochi Terminal' },
                route: [{ lat: 11.6084, lng: 76.0820 }, { lat: 9.9312, lng: 76.2673 }],
                status: 'EN_ROUTE',
                estimatedArrival: '2 hrs 15 mins',
                progress: 35
            }
        }
    },
    {
        id: 'st_maint_1',
        type: 'MAINTENANCE',
        title: 'Temp Fluctuation Alert',
        description: 'Unit #104 showing erratic temperature readings (±5°C). Verify thermostat.',
        requesterName: 'System Alert (IoT)',
        location: 'Wayanad Farm',
        priority: 'HIGH',
        status: 'ACCEPTED',
        date: '1 hour ago',
        earnings: 80, 
        metadata: { unitId: 'UNIT-104', maintenanceStage: 'DIAGNOSTIC' }
    },
    {
        id: 'st_qa_1',
        type: 'QA_CHECK',
        title: 'Banana Quality QA',
        description: 'Inspect "Organic Nendran" batch for export grade certification (Size > 8 inches).',
        requesterName: 'Joseph Thomas',
        location: 'Idukki, Sector 7',
        priority: 'MEDIUM',
        status: 'AVAILABLE',
        date: 'Yesterday',
        earnings: 40,
        metadata: { 
            cropId: '1',
            checklist: [
                { item: 'Visual Defects < 5%', checked: false },
                { item: 'Size Uniformity', checked: false },
                { item: 'Moisture Content Optimal', checked: false },
                { item: 'Pest Free', checked: false }
            ]
        }
    },
    // NEW SUPPORT TASKS
    {
        id: 'chat_1',
        type: 'EXTENSION',
        title: 'Rental Extension Request',
        description: 'Requesting 2 additional days for Unit #104.',
        requesterName: 'Ramesh',
        location: 'Kothamangalam',
        priority: 'MEDIUM',
        status: 'COMPLETED',
        date: '2 hours ago',
        earnings: 0,
        unreadCount: 0,
        metadata: {
            unitId: 'UNIT-104',
            chatHistory: [
                { id: 'm1', sender: 'Farmer', content: 'Hi, can I extend my cold storage unit for 2 more days?', timestamp: '10:00 AM', type: 'text', isRead: true },
                { id: 'm2', sender: 'Service', content: 'Sure, I’ll notify the logistics team.', timestamp: '10:05 AM', type: 'text', isRead: true },
                { id: 'm3', sender: 'Farmer', content: 'Thank you.', timestamp: '10:06 AM', type: 'text', isRead: true },
                { id: 'm4', sender: 'Service', content: 'Extension approved. Updated in your dashboard.', timestamp: '10:30 AM', type: 'text', isRead: true }
            ]
        }
    },
    {
        id: 'chat_2',
        type: 'SUPPORT',
        title: 'Temperature Fluctuation',
        description: 'Farmer reported unstable cooling.',
        requesterName: 'Praveen',
        location: 'Muvattupuzha',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        date: '1 hour ago',
        earnings: 0,
        unreadCount: 1,
        metadata: {
            unitId: 'UNIT-205',
            chatHistory: [
                { id: 'm1', sender: 'Farmer', content: 'There is a temperature fluctuation in my unit.', timestamp: '11:15 AM', type: 'text', isRead: true },
                { id: 'm2', sender: 'Service', content: 'Noted. Assigning a maintenance technician now.', timestamp: '11:16 AM', type: 'text', isRead: true },
                { id: 'm3', sender: 'Service', content: 'I’m on the way to inspect.', timestamp: '11:25 AM', type: 'text', isRead: true }
            ]
        }
    },
    {
        id: 'chat_3',
        type: 'SUPPORT',
        title: 'Delivery Status Query',
        description: 'Tracking update requested for portable unit.',
        requesterName: 'Abdul Rahman',
        location: 'Aluva',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        date: '30 mins ago',
        earnings: 0,
        unreadCount: 0,
        metadata: {
            chatHistory: [
                { id: 'm1', sender: 'Farmer', content: 'Where is my portable storage unit?', timestamp: '12:00 PM', type: 'text', isRead: true },
                { id: 'm2', sender: 'Service', content: 'It left Muvattupuzha 10 minutes ago.', timestamp: '12:02 PM', type: 'text', isRead: true },
                { id: 'm3', sender: 'Service', content: 'Estimated arrival: 22 minutes.', timestamp: '12:02 PM', type: 'text', isRead: true }
            ]
        }
    },
    {
        id: 'chat_4',
        type: 'SUPPORT',
        title: 'Payment Issue',
        description: 'Transaction failure on rental renewal.',
        requesterName: 'Meera',
        location: 'Kakkanad',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        date: '10 mins ago',
        earnings: 0,
        unreadCount: 2,
        metadata: {
            chatHistory: [
                { id: 'm1', sender: 'Farmer', content: 'My payment failed just now. What to do?', timestamp: '12:45 PM', type: 'text', isRead: true },
                { id: 'm2', sender: 'Service', content: 'Please try again in 2 minutes; the gateway is stable now.', timestamp: '12:46 PM', type: 'text', isRead: true }
            ]
        }
    },
    {
        id: 'chat_5',
        type: 'SUPPORT',
        title: 'Listing Help',
        description: 'Assistance with "Pay & Promote" feature.',
        requesterName: 'Suni',
        location: 'Kattappana',
        priority: 'LOW',
        status: 'COMPLETED',
        date: 'Yesterday',
        earnings: 0,
        unreadCount: 0,
        metadata: {
            chatHistory: [
                { id: 'm1', sender: 'Farmer', content: 'How do I promote my listing?', timestamp: 'Yesterday', type: 'text', isRead: true },
                { id: 'm2', sender: 'Service', content: 'Go to Market Connector → My Listings → Promote.', timestamp: 'Yesterday', type: 'text', isRead: true }
            ]
        }
    },
    {
        id: 'chat_6',
        type: 'SUPPORT',
        title: 'App Usage Question',
        description: 'Query about community forum rules.',
        requesterName: 'Jose',
        location: 'Perumbavoor',
        priority: 'LOW',
        status: 'COMPLETED',
        date: '2 days ago',
        earnings: 0,
        unreadCount: 0,
        metadata: {
            chatHistory: [
                { id: 'm1', sender: 'Farmer', content: 'Can I post selling ads in the community forum?', timestamp: '2 days ago', type: 'text', isRead: true },
                { id: 'm2', sender: 'Service', content: 'No, please use the Marketplace tab for selling. Community is for discussions.', timestamp: '2 days ago', type: 'text', isRead: true },
                { id: 'm3', sender: 'Farmer', content: 'Understood, thanks.', timestamp: '2 days ago', type: 'text', isRead: true }
            ]
        }
    }
];

// 12. MOCK OFFERS (RETAILER DEMO DATA)
const MOCK_OFFERS: Offer[] = [
    {
        id: 'off1',
        cropId: '2',
        retailerId: 'ret1',
        farmerName: 'John Doe',
        cropName: 'Green Cardamom',
        status: 'OFFER_SENT',
        amount: 60000,
        pricePerKg: 1200,
        quantity: 50,
        date: '2023-11-14',
        history: [
            { id: 'm1', sender: 'Retailer', content: 'Offering market price for 50kg trial.', timestamp: 'Yesterday' }
        ],
        notes: 'Need high grade only.'
    },
    {
        id: 'off2',
        cropId: '1',
        retailerId: 'ret1',
        farmerName: 'John Doe',
        cropName: 'Nendran Banana',
        status: 'NEGOTIATION',
        amount: 21500,
        pricePerKg: 43,
        quantity: 500,
        date: '2023-11-12',
        history: [
            { id: 'm1', sender: 'Retailer', content: 'Can we do 42/kg?', timestamp: '2 days ago' },
            { id: 'm2', sender: 'Farmer', content: 'Lowest I can go is 44.', timestamp: '1 day ago' },
            { id: 'm3', sender: 'Retailer', content: 'Let\'s meet at 43?', timestamp: 'Yesterday' }
        ],
        notes: 'Bulk purchase negotiation.'
    },
    {
        id: 'off3',
        cropId: '3',
        retailerId: 'ret1',
        farmerName: 'John Doe',
        cropName: 'Black Pepper',
        status: 'AGREEMENT',
        amount: 90000,
        pricePerKg: 450,
        quantity: 200,
        date: '2023-11-10',
        history: [],
        timeline: [
            { status: 'Offer Sent', date: '2023-11-10', completed: true },
            { status: 'Agreement', date: '2023-11-11', completed: true }
        ]
    },
    {
        id: 'off4',
        cropId: '5',
        retailerId: 'ret1',
        farmerName: 'John Doe',
        cropName: 'Tapioca',
        status: 'DELIVERY',
        amount: 12500,
        pricePerKg: 25,
        quantity: 500,
        date: '2023-11-08',
        history: [],
        timeline: [
            { status: 'Offer Sent', date: '2023-11-08', completed: true },
            { status: 'Agreement', date: '2023-11-09', completed: true },
            { status: 'Dispatch', date: '2023-11-10', completed: true },
            { status: 'Delivery', date: 'Today', completed: false }
        ]
    },
    {
        id: 'off5',
        cropId: '4',
        retailerId: 'ret1',
        farmerName: 'John Doe',
        cropName: 'Ginger',
        status: 'COMPLETED',
        amount: 6000,
        pricePerKg: 60,
        quantity: 100,
        date: '2023-11-01',
        history: [],
        timeline: [
            { status: 'Offer Sent', date: '2023-11-01', completed: true },
            { status: 'Agreement', date: '2023-11-02', completed: true },
            { status: 'Dispatch', date: '2023-11-02', completed: true },
            { status: 'Delivery', date: '2023-11-03', completed: true },
            { status: 'Payment', date: '2023-11-03', completed: true }
        ]
    }
];

export const useStore = create<AppState>((set, get) => ({
  currentUserRole: null,
  userProfile: null,
  isAuthenticated: false,
  setUserRole: (role) => set({ currentUserRole: role }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, currentUserRole: null, userProfile: null }),
  
  crops: MOCK_CROPS,
  offers: MOCK_OFFERS, 
  orders: [],
  posts: MOCK_FORUM_POSTS,
  experts: [],
  expertQuestions: MOCK_EXPERT_QUESTIONS,
  
  storageRequests: MOCK_STORAGE_REQUESTS,
  deployedUnits: MOCK_DEPLOYED_UNITS,
  rentalHistory: MOCK_RENTAL_HISTORY,
  
  retailerRequests: MOCK_RETAILER_REQUESTS,
  negotiations: MOCK_NEGOTIATIONS,
  barterListings: MOCK_BARTER_LISTINGS,
  barterRequests: MOCK_BARTER_REQUESTS,
  
  // Independent Notification Lists
  farmerNotifications: [],
  retailerNotifications: [],
  serviceNotifications: [
      { id: 'n1', type: 'INFO', title: 'New Pickup Assigned', message: 'Cold Chain Pickup for 500kg Bananas.', timestamp: '2 hours ago', read: false, targetRole: UserRole.SERVICE },
      { id: 'n2', type: 'WARNING', title: 'Maintenance Request', message: 'Temp fluctuation detected in Unit #104.', timestamp: '1 hour ago', read: false, targetRole: UserRole.SERVICE },
      { id: 'n3', type: 'INFO', title: 'Farmer Question', message: 'New expert advice question from Ravi Verma.', timestamp: '30 mins ago', read: false, targetRole: UserRole.SERVICE },
      { id: 'n4', type: 'INFO', title: 'Delivery Extension', message: 'Farmer requested 2 more days for Unit #202.', timestamp: '1 day ago', read: true, targetRole: UserRole.SERVICE }
  ],
  
  serviceTasks: MOCK_SERVICE_TASKS,
  credits: 1250,
  watchlist: ['1', '3'],
  retailerAnalytics: { totalSpend: 0, avgPricePerKg: 0, topCrops: [], topDistricts: [], weeklySpend: [] },
  isRetailerVerified: true,
  
  // Actions
  addCrop: (crop) => set((state) => ({ crops: [crop, ...state.crops] })),
  updateCrop: (updatedCrop) => set((state) => ({ crops: state.crops.map(c => c.id === updatedCrop.id ? updatedCrop : c) })),
  deleteCrop: (id) => set((state) => ({ crops: state.crops.filter(c => c.id !== id) })),
  togglePromote: (id) => set((state) => ({
    // Legacy promote action, keeping as fallback/alias
    crops: state.crops.map(c => c.id === id ? { ...c, isPromoted: !c.isPromoted, visibilityScore: c.isPromoted ? c.visibilityScore - 20 : c.visibilityScore + 20 } : c)
  })),
  promoteCrop: (id, plan) => set((state) => {
    const durationDays = plan === 'WEEKLY' ? 7 : plan === 'MONTHLY' ? 30 : 90;
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + durationDays);

    return {
        crops: state.crops.map(c => c.id === id ? {
            ...c,
            isPromoted: true,
            promoted: {
                active: true,
                plan,
                startDate: now.toISOString(),
                endDate: end.toISOString()
            }
        } : c)
    };
  }),
  checkPromotionStatus: () => set((state) => ({
    crops: state.crops.map(c => {
        if (c.promoted && c.promoted.active) {
            if (new Date(c.promoted.endDate) < new Date()) {
                return { ...c, isPromoted: false, promoted: { ...c.promoted, active: false } };
            }
        }
        return c;
    })
  })),
  addOffer: (offer) => set((state) => ({ offers: [offer, ...state.offers] })),
  withdrawOffer: (id) => set((state) => ({ offers: state.offers.map(o => o.id === id ? { ...o, status: 'WITHDRAWN' } : o) })),
  updateOfferStatus: (id, status) => set((state) => {
      const newState = { offers: state.offers.map(o => o.id === id ? { ...o, status } : o) };
      // Notify Retailer if deal moves forward
      if (['AGREEMENT', 'DISPATCH', 'DELIVERY', 'PAYMENT', 'COMPLETED'].includes(status)) {
          const offer = state.offers.find(o => o.id === id);
          const notif: Notification = {
               id: Math.random().toString(),
               type: 'INFO',
               title: 'Deal Update',
               message: `Order for ${offer?.cropName} is now ${status}.`,
               timestamp: 'Just now',
               read: false,
               targetRole: UserRole.RETAILER
          };
          return { ...newState, retailerNotifications: [notif, ...state.retailerNotifications] };
      }
      return newState;
  }),
  addOfferMessage: (offerId, message) => set((state) => ({ offers: state.offers.map(o => o.id === offerId ? { ...o, history: [...o.history, message] } : o) })),
  createStorageRequest: (request) => set((state) => ({ storageRequests: [request, ...state.storageRequests] })),
  cancelRequest: (id) => set((state) => ({ storageRequests: state.storageRequests.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r) })),
  extendRental: (id, days) => set((state) => {
      const unit = state.deployedUnits.find(u => u.id === id);
      const notif: Notification = {
           id: Math.random().toString(),
           type: 'INFO',
           title: 'Rental Extended',
           message: `Rental for Unit ${unit?.unitId} extended by ${days} days.`,
           timestamp: 'Just now',
           read: false,
           targetRole: UserRole.FARMER
      };
      return { 
          deployedUnits: state.deployedUnits.map(u => u.id === id ? { ...u, remainingDays: u.remainingDays + days } : u),
          farmerNotifications: [notif, ...state.farmerNotifications]
      };
  }),
  rentAgain: () => set((state) => state),
  requestMaintenance: (unitId, issue, priority = 'Medium', preferredTime = 'ASAP') => set((state) => {
      const newTask: ServiceTask = {
          id: Math.random().toString(),
          type: 'MAINTENANCE',
          title: 'User Reported Issue',
          description: `${issue} [Priority: ${priority}]`,
          requesterName: 'Farmer',
          priority: priority.toUpperCase() as any,
          status: 'AVAILABLE',
          date: 'Just now',
          earnings: 50, // Affordable Default
          metadata: { unitId, chatHistory: [] }
      };
      // Notify Service
      const notif: Notification = {
           id: Math.random().toString(),
           type: 'WARNING',
           title: 'New Maintenance Request',
           message: `${issue} (Unit: ${unitId})`,
           timestamp: 'Just now',
           read: false,
           targetRole: UserRole.SERVICE
      };
      return { 
          serviceTasks: [newTask, ...state.serviceTasks],
          serviceNotifications: [notif, ...state.serviceNotifications]
      };
  }),
  togglePostLike: (postId) => set((state) => ({ posts: state.posts.map(p => p.id === postId ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p) })),
  addPostComment: (postId, comment) => set((state) => ({ posts: state.posts.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1, commentsList: [...p.commentsList, comment] } : p) })),
  createPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  deletePost: (postId) => set((state) => ({ posts: state.posts.filter(p => p.id !== postId) })),
  
  askExpertQuestion: (question) => set((state) => ({ 
      expertQuestions: [question, ...state.expertQuestions],
      serviceNotifications: [...state.serviceNotifications, {
          id: Math.random().toString(),
          type: 'INFO',
          title: 'New Expert Question',
          message: `${question.farmerName} asked: ${question.title}`,
          timestamp: 'Just now',
          read: false,
          targetRole: UserRole.SERVICE
      }]
  })),
  
  // Farmer sends message, Expert auto-reply simulation
  sendExpertMessage: (questionId, message, attachment) => set((state) => {
      const newMessage: Message = { id: Math.random().toString(), sender: 'Farmer', content: message, timestamp: 'Just now', type: attachment ? 'image' : 'text', attachmentUrl: attachment, isRead: true };
      
      const newQuestions = state.expertQuestions.map(q => {
          if (q.id !== questionId) return q;
          return { ...q, history: [...q.history, newMessage], status: 'IN_PROGRESS' as const };
      });

      // Simulation of Expert Reply (Notify Farmer)
      setTimeout(() => {
          set(s => ({
              expertQuestions: s.expertQuestions.map(q => {
                  if (q.id !== questionId) return q;
                  const reply: Message = { id: Math.random().toString(), sender: 'Expert', content: 'I have received your update. Analyzing the image now...', timestamp: 'Just now', type: 'text', isRead: false };
                  return { ...q, history: [...q.history, reply], unreadCount: (q.unreadCount || 0) + 1 };
              }),
              farmerNotifications: [...s.farmerNotifications, { id: Math.random().toString(), type: 'INFO', title: 'Expert Replied', message: `New message in "${newQuestions.find(x => x.id === questionId)?.title}"`, timestamp: 'Just now', read: false, targetRole: UserRole.FARMER }]
          }));
      }, 3000);

      return { expertQuestions: newQuestions };
  }),

  // EXPERT ACTIONS
  replyToFarmer: (questionId, message, attachment) => set((state) => {
      // Notify Farmer
      const q = state.expertQuestions.find(q => q.id === questionId);
      const notif: Notification = {
           id: Math.random().toString(),
           type: 'INFO',
           title: 'Expert Replied',
           message: `Expert replied to: ${q?.title}`,
           timestamp: 'Just now',
           read: false,
           targetRole: UserRole.FARMER
      };
      
      return {
          expertQuestions: state.expertQuestions.map(q => {
              if (q.id !== questionId) return q;
              const newMsg: Message = { id: Math.random().toString(), sender: 'Expert', content: message, timestamp: 'Just now', type: attachment ? 'image' : 'text', attachmentUrl: attachment, isRead: true };
              return { ...q, history: [...q.history, newMsg], status: 'IN_PROGRESS' };
          }),
          farmerNotifications: [notif, ...state.farmerNotifications]
      };
  }),

  resolveExpertQuestion: (questionId) => set((state) => ({
      expertQuestions: state.expertQuestions.map(q => q.id === questionId ? { ...q, status: 'RESOLVED', history: [...q.history, { id: Math.random().toString(), sender: 'System', content: 'This conversation has been marked as resolved.', timestamp: 'Just now', type: 'system', isRead: true }] } : q)
  })),

  rateExpertSession: (questionId, rating, feedback) => set((state) => ({
      expertQuestions: state.expertQuestions.map(q => q.id === questionId ? { ...q, rating, feedback } : q)
  })),

  convertRequestToOffer: (requestId, offer) => set((state) => {
      // Notify Retailer
      const notif: Notification = {
           id: Math.random().toString(),
           type: 'INFO',
           title: 'Counter Offer Received',
           message: `A farmer has sent a proposal for your request.`,
           timestamp: 'Just now',
           read: false,
           targetRole: UserRole.RETAILER
      };
      return { 
          retailerRequests: state.retailerRequests.map(r => r.id === requestId ? { ...r, status: 'Converted' } : r), 
          negotiations: [offer, ...state.negotiations],
          retailerNotifications: [notif, ...state.retailerNotifications]
      };
  }),
  rejectRetailerRequest: (requestId) => set((state) => ({ retailerRequests: state.retailerRequests.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r) })),
  updateNegotiation: (id, message, newPrice) => set((state) => {
      // If Farmer replies, notify Retailer
      let newRetailerNotifs = state.retailerNotifications;
      if (message.sender === 'Farmer') {
           const notif: Notification = {
               id: Math.random().toString(),
               type: 'INFO',
               title: 'New Negotiation Message',
               message: `Farmer sent a message regarding your negotiation.`,
               timestamp: 'Just now',
               read: false,
               targetRole: UserRole.RETAILER
          };
          newRetailerNotifs = [notif, ...newRetailerNotifs];
      }
      return { 
          negotiations: state.negotiations.map(n => n.id === id ? { ...n, history: [...n.history, message], offeredPrice: newPrice || n.offeredPrice } : n),
          retailerNotifications: newRetailerNotifs
      };
  }),
  acceptNegotiation: (id) => set((state) => {
      // Notify Retailer
      const notif: Notification = {
           id: Math.random().toString(),
           type: 'SUCCESS',
           title: 'Offer Accepted',
           message: `Your offer has been accepted by the farmer.`,
           timestamp: 'Just now',
           read: false,
           targetRole: UserRole.RETAILER
      };
      return { 
          negotiations: state.negotiations.map(n => n.id === id ? { ...n, status: 'Accepted' } : n),
          retailerNotifications: [notif, ...state.retailerNotifications]
      };
  }),
  addBarterListing: (listing) => set((state) => ({ barterListings: [listing, ...state.barterListings] })),
  requestBarterService: (listing) => { set((state) => ({ credits: state.credits - listing.creditCost })); return true; },
  acceptBarterService: (requestId) => set((state) => ({ barterRequests: state.barterRequests.map(r => r.id === requestId ? { ...r, status: 'ACCEPTED' } : r) })),
  completeBarterService: (requestId) => set((state) => ({ barterRequests: state.barterRequests.map(r => r.id === requestId ? { ...r, status: 'COMPLETED' } : r) })),
  rateBarterService: (requestId, rating, feedback) => set((state) => ({ barterRequests: state.barterRequests.map(r => r.id === requestId ? { ...r, rating, feedback } : r) })),
  raiseDispute: (requestId, reason) => set((state) => ({ barterRequests: state.barterRequests.map(r => r.id === requestId ? { ...r, status: 'DISPUTED', disputeReason: reason } : r) })),
  resolveDispute: (requestId, outcome) => set((state) => ({ barterRequests: state.barterRequests.map(r => r.id === requestId ? { ...r, status: outcome === 'REFUND' ? 'REFUNDED' : 'COMPLETED' } : r) })),
  
  markNotificationRead: (id) => set((state) => ({ 
      farmerNotifications: state.farmerNotifications.map(n => n.id === id ? { ...n, read: true } : n),
      retailerNotifications: state.retailerNotifications.map(n => n.id === id ? { ...n, read: true } : n),
      serviceNotifications: state.serviceNotifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  clearNotifications: () => set((state) => {
      if (state.currentUserRole === UserRole.FARMER) return { farmerNotifications: [] };
      if (state.currentUserRole === UserRole.RETAILER) return { retailerNotifications: [] };
      if (state.currentUserRole === UserRole.SERVICE) return { serviceNotifications: [] };
      return {};
  }),
  toggleWatchlist: (cropId) => set((state) => ({ watchlist: state.watchlist.includes(cropId) ? state.watchlist.filter(id => id !== cropId) : [...state.watchlist, cropId] })),
  requestQACheck: (cropId) => set((state) => ({ crops: state.crops.map(c => c.id === cropId ? { ...c, qaStatus: 'REQUESTED' } : c) })),
  triggerPriceDropAlert: () => set((state) => state),
  
  // SERVICE ACTIONS
  acceptServiceTask: (id) => set((state) => {
      const task = state.serviceTasks.find(t => t.id === id);
      // Notify Farmer
      const notif: Notification = {
           id: Math.random().toString(),
           type: 'INFO',
           title: 'Service Accepted',
           message: `Your ${task?.type.toLowerCase().replace('_', ' ')} task has been accepted.`,
           timestamp: 'Just now',
           read: false,
           targetRole: UserRole.FARMER
      };
      return {
          serviceTasks: state.serviceTasks.map(t => t.id === id ? { ...t, status: 'IN_PROGRESS' } : t),
          farmerNotifications: [notif, ...state.farmerNotifications]
      };
  }),
  updateServiceTaskStatus: (id, status) => set((state) => ({
      serviceTasks: state.serviceTasks.map(t => t.id === id ? { ...t, status } : t)
  })),
  completeServiceTask: (id, resolution) => set((state) => {
      const task = state.serviceTasks.find(t => t.id === id);
      // Notify Farmer
      const notif: Notification = {
           id: Math.random().toString(),
           type: 'SUCCESS',
           title: 'Service Completed',
           message: `Your ${task?.type.toLowerCase().replace('_', ' ')} task is complete. ${resolution ? resolution : ''}`,
           timestamp: 'Just now',
           read: false,
           targetRole: UserRole.FARMER
      };
      return {
          serviceTasks: state.serviceTasks.map(t => t.id === id ? { 
              ...t, 
              status: 'COMPLETED',
              description: resolution ? `${t.description} [Resolution: ${resolution}]` : t.description,
              metadata: { ...t.metadata, resolutionStatus: resolution === 'UNRESOLVED' ? 'UNRESOLVED' : 'RESOLVED' }
          } : t),
          farmerNotifications: [notif, ...state.farmerNotifications]
      };
  }),
  approveQACheck: (cropId) => set((state) => {
      const crop = state.crops.find(c => c.id === cropId);
      // Notify Farmer
      const notif: Notification = {
           id: Math.random().toString(),
           type: 'SUCCESS',
           title: 'QA Check Passed',
           message: `Your crop ${crop?.name} is now QA Verified.`,
           timestamp: 'Just now',
           read: false,
           targetRole: UserRole.FARMER
      };
      return {
          crops: state.crops.map(c => c.id === cropId ? { ...c, qaStatus: 'VERIFIED' } : c),
          farmerNotifications: [notif, ...state.farmerNotifications]
      };
  }),
  updateDeliveryStep: (taskId, stepIndex) => set((state) => ({
      serviceTasks: state.serviceTasks.map(t => {
          if (t.id !== taskId || !t.metadata?.deliverySteps) return t;
          const newSteps = [...t.metadata.deliverySteps];
          newSteps[stepIndex] = { ...newSteps[stepIndex], completed: true, time: new Date().toLocaleTimeString() };
          return { ...t, status: 'IN_PROGRESS', metadata: { ...t.metadata, deliverySteps: newSteps } };
      })
  })),
  updateMaintenanceStage: (taskId, stage, notes) => set((state) => ({
      serviceTasks: state.serviceTasks.map(t => {
          if (t.id !== taskId) return t;
          const newMetadata = { ...t.metadata, maintenanceStage: stage };
          if (notes) {
              if (stage === 'FIXING') newMetadata.diagnosticNotes = notes;
              if (stage === 'DIAGNOSTIC') {} 
          }
          return { ...t, status: 'IN_PROGRESS', metadata: newMetadata };
      })
  })),
  sendServiceMessage: (taskId, text, sender, attachment) => set((state) => {
      // If Service sends, Notify Farmer
      let newFarmerNotifs = state.farmerNotifications;
      if (sender === 'Service' || sender === 'System') {
          const task = state.serviceTasks.find(t => t.id === taskId);
          const notif: Notification = {
               id: Math.random().toString(),
               type: 'INFO',
               title: 'New Service Message',
               message: `New message regarding your ${task?.type} task.`,
               timestamp: 'Just now',
               read: false,
               targetRole: UserRole.FARMER
          };
          newFarmerNotifs = [notif, ...newFarmerNotifs];
      }
      
      return {
          serviceTasks: state.serviceTasks.map(t => {
              if (t.id !== taskId) return t;
              const newMsg: Message = { id: Math.random().toString(), sender: sender as any, content: text, timestamp: 'Just now', type: attachment ? 'image' : 'text', attachmentUrl: attachment, isRead: true };
              return { ...t, metadata: { ...t.metadata, chatHistory: [...(t.metadata?.chatHistory || []), newMsg] } };
          }),
          farmerNotifications: newFarmerNotifs
      };
  }),
  markTaskRead: (taskId) => set((state) => ({
      serviceTasks: state.serviceTasks.map(t => {
          if (t.id !== taskId) return t;
          const updatedHistory = t.metadata?.chatHistory?.map(m => ({ ...m, isRead: true })) || [];
          return { ...t, unreadCount: 0, metadata: { ...t.metadata, chatHistory: updatedHistory } };
      })
  })),
  escalateTask: (taskId, targetType, note) => set((state) => ({
      serviceTasks: state.serviceTasks.map(t => t.id === taskId ? {
          ...t,
          type: targetType,
          priority: 'HIGH',
          description: `[ESCALATED] ${note} \nOriginal: ${t.description}`,
          status: 'AVAILABLE', 
          unreadCount: 1, 
          metadata: { ...t.metadata, chatHistory: [...(t.metadata?.chatHistory || []), { id: Math.random().toString(), sender: 'System', content: `Escalated to ${targetType}: ${note}`, timestamp: 'Just now', type: 'system', isRead: false }] }
      } : t)
  })),

  // --- DELIVERY TRACKING ACTIONS ---
  startDeliverySimulation: (taskId) => set((state) => {
      // Notify Farmer Delivery Started
      const task = state.serviceTasks.find(t => t.id === taskId);
      const notif: Notification = {
           id: Math.random().toString(),
           type: 'INFO',
           title: 'Delivery Started',
           message: `Your delivery for ${task?.title} is now en route.`,
           timestamp: 'Just now',
           read: false,
           targetRole: UserRole.FARMER
      };
      
      return {
          serviceTasks: state.serviceTasks.map(t => {
              if (t.id !== taskId || !t.metadata?.tracking) return t;
              return {
                  ...t,
                  metadata: {
                      ...t.metadata,
                      tracking: { ...t.metadata.tracking, isActive: true, status: 'EN_ROUTE', progress: 0 }
                  }
              };
          }),
          farmerNotifications: [notif, ...state.farmerNotifications]
      };
  }),
  updateDeliveryProgress: (taskId, progress) => set((state) => ({
      serviceTasks: state.serviceTasks.map(t => {
          if (t.id !== taskId || !t.metadata?.tracking) return t;
          const { route } = t.metadata.tracking;
          // Calculate lat/lng based on progress along route
          const totalPoints = route.length - 1;
          const pointProgress = progress * totalPoints / 100;
          const index = Math.floor(pointProgress);
          const nextIndex = Math.min(index + 1, totalPoints);
          const segmentProgress = pointProgress - index;
          
          const p1 = route[index];
          const p2 = route[nextIndex];
          const lat = p1.lat + (p2.lat - p1.lat) * segmentProgress;
          const lng = p1.lng + (p2.lng - p1.lng) * segmentProgress;

          let status: DeliveryTracking['status'] = 'EN_ROUTE';
          if (progress >= 90) status = 'ARRIVING';
          if (progress >= 100) status = 'DELIVERED';

          return {
              ...t,
              status: status === 'DELIVERED' ? 'COMPLETED' : t.status,
              metadata: {
                  ...t.metadata,
                  tracking: { ...t.metadata.tracking, isActive: true, progress, currentLocation: { lat, lng }, status }
              }
          };
      })
  })),
  stopDeliverySimulation: (taskId) => set((state) => ({
      serviceTasks: state.serviceTasks.map(t => {
          if (t.id !== taskId || !t.metadata?.tracking) return t;
          return {
              ...t,
              metadata: {
                  ...t.metadata,
                  tracking: { ...t.metadata.tracking, isActive: false }
              }
          };
      })
  }))
}));