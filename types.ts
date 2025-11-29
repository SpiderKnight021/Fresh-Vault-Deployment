

export enum UserRole {
  FARMER = 'FARMER',
  RETAILER = 'RETAILER',
  SERVICE = 'SERVICE',
  GUEST = 'GUEST'
}

export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH'
}

export interface PricePoint {
    date: string;
    price: number;
}

export type PromotionPlan = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';

export interface Promotion {
    active: boolean;
    plan: PromotionPlan;
    startDate: string; // ISO string
    endDate: string; // ISO string
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  location: string; // e.g., Wayanad, Kerala
  farmerName: string;
  farmerRating: number;
  storageUnitId: string;
  quantity: number; // in kg
  harvestDate: string;
  imageUrl: string;
  isPromoted: boolean; // Kept for backward compatibility, sync with promoted.active
  promoted?: Promotion; // New promotion metadata
  pricePerKg: number;
  visibilityScore: number; // 1-100
  monitoring: {
    temperature: number;
    humidity: number;
    aiRiskScore: number; // 0-100
    riskLevel: RiskLevel;
    recommendation: string;
    // New AI Fields
    explanation?: string; // Why is it risky?
    confidence?: number; // 0-100%
    spoilageHours?: number; // Estimated hours remaining
  };
  views?: number;
  inquiries?: number;
  priority?: 'URGENT' | 'NORMAL' | 'HIGH';
  category?: 'Vegetables' | 'Spices' | 'Fruits' | 'Tubers' | 'Others'; 
  priceHistory?: PricePoint[]; // New: For price history chart
  qaStatus?: 'NONE' | 'REQUESTED' | 'VERIFIED'; // New: Quality Assurance
}

export interface Message {
    id: string;
    sender: 'Farmer' | 'Retailer' | 'Service' | 'Expert' | 'System';
    content: string;
    timestamp: string;
    type?: 'text' | 'image' | 'system'; // New: Message type
    attachmentUrl?: string; // New: Image URL
    isRead?: boolean; // New: Read status
}

export interface Offer {
  id: string;
  cropId: string;
  retailerId: string;
  farmerName: string;
  cropName: string;
  status: 'OFFER_SENT' | 'NEGOTIATION' | 'AGREEMENT' | 'DISPATCH' | 'DELIVERY' | 'PAYMENT' | 'COMPLETED' | 'REJECTED' | 'WITHDRAWN';
  amount: number;
  pricePerKg: number;
  quantity: number;
  date: string;
  history: Message[];
  notes?: string;
  timeline?: { status: string; date: string; completed: boolean }[];
}

export type ServiceTaskType = 'DELIVERY' | 'MAINTENANCE' | 'QA_CHECK' | 'EXPERT_ADVICE' | 'EXTENSION' | 'SUPPORT' | 'EMERGENCY';

export interface LatLng {
    lat: number;
    lng: number;
    name?: string;
}

export interface DeliveryTracking {
    isActive: boolean;
    currentLocation: LatLng;
    origin: LatLng;
    destination: LatLng;
    route: LatLng[];
    status: 'ACCEPTED' | 'EN_ROUTE' | 'ARRIVING' | 'DELIVERED';
    estimatedArrival: string;
    progress: number; // 0-100
}

export interface ServiceTask {
  id: string;
  type: ServiceTaskType;
  title: string;
  description: string;
  requesterName: string; // Farmer Name or System
  location?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'AVAILABLE' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  date: string;
  earnings?: number; // Incentive in INR
  unreadCount?: number; // New: For Inbox
  metadata?: {
      cropId?: string;
      unitId?: string;
      chatHistory?: Message[];
      targetValue?: any; // For extension days etc
      deliverySteps?: { name: string; completed: boolean; time?: string }[];
      checklist?: { item: string; checked: boolean }[];
      // Maintenance Specifics
      maintenanceStage?: 'DIAGNOSTIC' | 'FIXING';
      diagnosticNotes?: string;
      repairNotes?: string;
      resolutionStatus?: 'RESOLVED' | 'UNRESOLVED';
      tracking?: DeliveryTracking;
  }; 
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  author: string;
  location?: string; // e.g. Wayanad
  role: string;
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  isLiked?: boolean; // For current user interaction
  isOwner?: boolean; // Can edit/delete
  commentsCount: number;
  commentsList: Comment[]; // Array of comments
  timeAgo: string;
  tags: string[];
}

export interface Expert {
  id: string;
  name: string;
  specialization: string;
  isOnline: boolean;
  avatar: string;
  rating: number;
}

export interface ExpertAnswer {
    id: string;
    expertName: string;
    expertAvatar: string;
    content: string;
    date: string;
    role: string;
}

export interface ExpertQuestion {
    id: string;
    farmerName: string;
    crop: string;
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    date: string;
    history: Message[];
    images?: string[];
    unreadCount?: number;
    rating?: number;
    feedback?: string;
}

export interface Order {
    id: string;
    cropName: string;
    quantity: number;
    buyerName: string;
    status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    date: string;
    amount: number;
}

export type UnitType = 'Portable Fresh Storage' | 'Multi-Crop Storage' | 'Controlled Atmosphere (CA)' | 'Ethylene Ripening Chamber';
export type RentalStatus = 'REQUESTED' | 'ASSIGNED' | 'DISPATCHED' | 'INSTALLED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface StorageRequest {
    id: string;
    unitType: UnitType;
    crop: string;
    quantity: number;
    duration: number;
    startDate: string;
    location: string;
    cost: number;
    status: RentalStatus;
    requestDate: string;
    eta?: string; // e.g., "4 hours"
    serviceMember?: string;
    timeline: { status: RentalStatus; date: string; completed: boolean }[];
}

export interface DeployedUnit {
    id: string;
    unitId: string;
    unitType: UnitType;
    name: string;
    crop: string;
    load: string;
    deployedDate: string;
    pickupDate: string;
    remainingDays: number;
    location: string;
    temperature: { current: number; target: number };
    humidity: { current: number; target: number };
    battery: number;
    status: 'Active' | 'Maintenance';
    riskLevel: 'Low' | 'Moderate' | 'High';
    recommendation: string;
    alerts: string[];
    telemetryHistory: { time: string; temp: number; humidity: number }[];
    maintenanceTicket?: {
        issue: string;
        date: string;
        status: 'OPEN' | 'RESOLVED';
    };
}

export interface RentalHistory {
    id: string;
    unitType: UnitType;
    crop: string;
    dates: string; // Range
    location: string;
    cost: number;
    status: 'COMPLETED' | 'CANCELLED';
    rating?: number;
}

export interface RetailerRequest {
    id: string;
    cropName: string;
    retailerName: string;
    retailerRating: number;
    location: string;
    quantityNeeded: number;
    maxPrice: number;
    deadline: string;
    responses: number;
    requirements: string;
    urgency: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'Closed' | 'Converted' | 'Rejected';
    message?: string; // Snippet
}

export interface Negotiation {
    id: string;
    retailerName: string;
    retailerId: string;
    cropName: string;
    cropId: string;
    date: string;
    offeredPrice: number;
    quantity: number;
    retailerMessage: string; // Last message
    history: Message[];
    status: 'Pending' | 'Negotiating' | 'Accepted' | 'Rejected';
}

export interface BarterListing {
    id: string;
    providerName: string;
    providerId: string;
    serviceType: string;
    description: string;
    district: string;
    creditCost: number;
    status: 'AVAILABLE' | 'BUSY';
    date: string;
    providerRating?: number;
    reviewsCount?: number;
}

export interface BarterRequest {
    id: string;
    listingId: string;
    serviceType: string;
    requesterId: string;
    requesterName: string;
    providerId: string;
    providerName: string;
    creditCost: number;
    status: 'REQUESTED' | 'ACCEPTED' | 'COMPLETED' | 'DISPUTED' | 'REFUNDED';
    requestDate: string;
    rating?: number;
    feedback?: string;
    disputeReason?: string;
    disputeStatus?: 'OPEN' | 'RESOLVED';
}

export interface Notification {
    id: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    link?: string;
    targetRole?: UserRole; // Optional: to filter notifications
}

export interface RetailerAnalytics {
    totalSpend: number;
    avgPricePerKg: number;
    topCrops: { name: string; percentage: number }[];
    topDistricts: { name: string; count: number }[];
    weeklySpend: { week: string; amount: number }[];
}