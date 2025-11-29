import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useStore } from '../store';
import { Card, Badge, Button, Input, Modal } from './UI';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Package, Truck, CheckSquare, IndianRupee, Star, MapPin, Filter, ArrowUpRight, Search, Bell, X, Send, TrendingUp, BarChart2, ShieldCheck, ShoppingCart, Heart, ArrowUpDown, PieChart, Activity, BadgeCheck, AlertTriangle, Calendar, ChevronRight, FileText, User, ChevronDown, ChevronUp, MessageCircle, DollarSign, Archive, History, ArrowRight } from 'lucide-react';
import { Offer, UserRole, Message, RiskLevel, Crop } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, BarChart, Bar, Legend, Pie } from 'recharts';

// --- Retailer Notification Drawer ---
const RetailerNotificationDropdown = () => {
    const { retailerNotifications, markNotificationRead, clearNotifications } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    
    const unreadCount = retailerNotifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-700"/>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-12 w-80 max-w-[85vw] bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                        >
                            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h4 className="font-bold text-sm text-gray-900 font-heading">Notifications</h4>
                                {retailerNotifications.length > 0 && (
                                    <button onClick={clearNotifications} className="text-xs text-gray-500 hover:text-red-600 font-medium">Clear All</button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {retailerNotifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 text-sm">No new notifications</div>
                                ) : (
                                    retailerNotifications.map(n => (
                                        <div 
                                            key={n.id} 
                                            className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                                            onClick={() => markNotificationRead(n.id)}
                                        >
                                            <div className="flex gap-2">
                                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.type === 'SUCCESS' ? 'bg-green-500' : n.type === 'WARNING' ? 'bg-yellow-500' : n.type === 'ERROR' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                                                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{n.message}</p>
                                                    <p className="text-[10px] text-gray-500 mt-1">{n.timestamp}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Image Handling & Fallback Component ---
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500&auto=format&fit=crop";
const DEMO_IMAGES: Record<string, string> = {
    'banana': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=500&auto=format&fit=crop',
    'pineapple': 'https://images.unsplash.com/photo-1589820296156-2454bb8a6d54?q=80&w=500&auto=format&fit=crop',
    'cardamom': 'https://images.unsplash.com/photo-1550397623-287db30d0fb3?q=80&w=500&auto=format&fit=crop',
    'pepper': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&auto=format&fit=crop',
    'ginger': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=500&auto=format&fit=crop',
    'coconut': 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?q=80&w=500&auto=format&fit=crop',
    'nutmeg': 'https://images.unsplash.com/photo-1597528351508-4c94747c3208?q=80&w=500&auto=format&fit=crop',
    'turmeric': 'https://images.unsplash.com/photo-1615485500704-8e99099928b3?q=80&w=500&auto=format&fit=crop',
    'tapioca': 'https://images.unsplash.com/photo-1592186309879-fb54893cb9e4?q=80&w=500&auto=format&fit=crop'
};

const RetailerCropImage: React.FC<{ src?: string; alt: string; className?: string; cropName?: string }> = ({ src, alt, className, cropName }) => {
    const [imageSrc, setImageSrc] = useState<string>(src || FALLBACK_IMAGE);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImageSrc(src || FALLBACK_IMAGE);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            if (cropName) {
                const lowerName = cropName.toLowerCase();
                const specificKey = Object.keys(DEMO_IMAGES).find(k => lowerName.includes(k));
                if (specificKey) {
                    setImageSrc(DEMO_IMAGES[specificKey]);
                    return;
                }
            }
            setImageSrc(FALLBACK_IMAGE);
        }
    };

    return (
        <img
            src={imageSrc}
            alt={alt || "Crop Image"}
            className={`${className} ${hasError ? 'object-cover' : ''} bg-gray-100`}
            onError={handleError}
            loading="lazy"
        />
    );
};

// --- Chat Modal Component ---
const ChatModal: React.FC<{ isOpen: boolean; onClose: () => void; offer: Offer | null }> = ({ isOpen, onClose, offer }) => {
    const { offers, addOfferMessage } = useStore();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Derived active offer to ensure reactive updates from store
    const activeOffer = useMemo(() => 
        offers.find(o => o.id === offer?.id) || offer
    , [offers, offer]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [activeOffer?.history, isOpen]);

    const handleSend = () => {
        if (!activeOffer || !input.trim()) return;
        const offerId = activeOffer.id;
        addOfferMessage(offerId, {
            id: Math.random().toString(),
            sender: 'Retailer',
            content: input,
            timestamp: 'Just now'
        });
        setInput('');
        
        // Mock reply
        setTimeout(() => {
             addOfferMessage(offerId, {
                id: Math.random().toString(),
                sender: 'Farmer',
                content: "I received your message. Let me check.",
                timestamp: 'Just now'
            });
        }, 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Chat with ${activeOffer?.farmerName || 'Farmer'}`}>
            <div className="flex flex-col h-[60vh] md:h-[500px]">
                <div className="bg-gray-50 p-2 text-xs text-center text-gray-500 border-b border-gray-100 mb-2">
                    Regarding: <strong>{activeOffer?.cropName} ({activeOffer?.quantity}kg)</strong>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 p-2" ref={scrollRef}>
                    {activeOffer?.history.length === 0 && (
                        <div className="text-center text-gray-400 text-xs mt-10">Start the conversation...</div>
                    )}
                    {activeOffer?.history.map(msg => {
                        const isMe = msg.sender === 'Retailer';
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="pt-3 mt-2 border-t border-gray-100 flex gap-2">
                    <Input 
                        placeholder="Type message..." 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        className="h-10 text-sm text-gray-900"
                    />
                    <Button size="sm" onClick={handleSend} disabled={!input.trim()}><Send size={16}/></Button>
                </div>
            </div>
        </Modal>
    );
};

export const RetailerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BROWSE' | 'MY_OFFERS' | 'DEALS' | 'TRENDS' | 'WATCHLIST'>('BROWSE');
  const { isRetailerVerified, triggerPriceDropAlert } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
        triggerPriceDropAlert();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-heading text-gray-900 flex items-center gap-3">
                Retailer Hub
                {isRetailerVerified && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-blue-200">
                        <BadgeCheck size={14} className="fill-blue-600 text-white"/> Verified
                    </span>
                )}
            </h1>
            <p className="text-gray-600 mt-1">Sourcing for <span className="font-bold text-gray-900">FreshMart Ltd.</span></p>
        </div>
        
        <div className="flex items-center gap-4">
             <RetailerNotificationDropdown />
             <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-x-auto no-scrollbar max-w-[80vw]">
                {[
                    {id: 'BROWSE', label: 'Browse'},
                    {id: 'MY_OFFERS', label: 'Offers'},
                    {id: 'DEALS', label: 'Timeline'},
                    {id: 'WATCHLIST', label: 'Watchlist'},
                    {id: 'TRENDS', label: 'Trends'}
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'BROWSE' && <BrowseOffersView />}
        {activeTab === 'MY_OFFERS' && <MyOffersView onTrack={(id) => setActiveTab('DEALS')} />}
        {activeTab === 'DEALS' && <TimelineView onBrowse={() => setActiveTab('BROWSE')} />}
        {activeTab === 'TRENDS' && <TrendsView />}
        {activeTab === 'WATCHLIST' && <WatchlistView />}
      </motion.div>
    </div>
  );
};

// --- Tab 1: Browse Offers ---
const BrowseOffersView = () => {
    // ... [Code remains mostly unchanged, ensuring text colors]
    const { crops, addOffer, watchlist, toggleWatchlist, requestQACheck } = useStore();
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null); 
    const [viewDetailCrop, setViewDetailCrop] = useState<Crop | null>(null); 
    const [offerForm, setOfferForm] = useState({ price: '', quantity: '', notes: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [compareList, setCompareList] = useState<string[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [districtFilter, setDistrictFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [promotedOnly, setPromotedOnly] = useState(false);
    const [sortOption, setSortOption] = useState<'RECENT' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING'>('RECENT');
    const GLOBAL_BROWSE_IMAGE = "https://images.unsplash.com/photo-1592186309879-fb54893cb9e4?q=80&w=500&auto=format&fit=crop";

    const filteredCrops = useMemo(() => {
        let result = crops.filter(crop => {
            const matchesDistrict = districtFilter === 'All' || crop.location.includes(districtFilter);
            const matchesCategory = categoryFilter === 'All' || (crop.category && crop.category === categoryFilter) || (!crop.category && categoryFilter === 'All');
            const matchesSearch = crop.name.toLowerCase().includes(search.toLowerCase());
            const matchesPromoted = !promotedOnly || crop.isPromoted;
            return matchesDistrict && matchesCategory && matchesSearch && matchesPromoted;
        });
        switch (sortOption) {
            case 'PRICE_ASC': result.sort((a, b) => a.pricePerKg - b.pricePerKg); break;
            case 'PRICE_DESC': result.sort((a, b) => b.pricePerKg - a.pricePerKg); break;
            case 'RATING': result.sort((a, b) => b.farmerRating - a.farmerRating); break;
            case 'RECENT': default: result.sort((a, b) => (a.isPromoted === b.isPromoted ? 0 : a.isPromoted ? -1 : 1)); break;
        }
        return result;
    }, [crops, districtFilter, categoryFilter, search, promotedOnly, sortOption]);

    const handleNumChange = (field: string, value: string) => {
        if (value && Number(value) < 0) {
            setOfferForm(prev => ({...prev, [field]: ''}));
            setErrors(prev => ({...prev, [field]: 'Cannot be negative'}));
        } else {
            setOfferForm(prev => ({...prev, [field]: value}));
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const handleMakeOffer = () => {
        if (!selectedCrop) return;
        if (!offerForm.price || !offerForm.quantity || Number(offerForm.price) <= 0 || Number(offerForm.quantity) <= 0) return;
        
        const newOffer: Offer = {
            id: Math.random().toString(36).substr(2, 9),
            cropId: selectedCrop.id,
            retailerId: 'RET-CURR',
            farmerName: selectedCrop.farmerName,
            cropName: selectedCrop.name,
            status: 'OFFER_SENT',
            amount: parseFloat(offerForm.price) * parseFloat(offerForm.quantity),
            pricePerKg: parseFloat(offerForm.price),
            quantity: parseFloat(offerForm.quantity),
            date: new Date().toISOString().split('T')[0],
            history: [],
            notes: offerForm.notes
        };
        addOffer(newOffer);
        setSelectedCrop(null);
        setOfferForm({ price: '', quantity: '', notes: '' });
        setErrors({});
        alert("Offer Sent Successfully!");
    };

    const toggleCompare = (id: string) => {
        if (compareList.includes(id)) {
            setCompareList(compareList.filter(cid => cid !== id));
        } else {
            if (compareList.length < 3) {
                setCompareList([...compareList, id]);
            } else {
                alert("You can compare up to 3 items only.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 lg:space-y-0 lg:flex lg:justify-between lg:items-center">
                 <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                        <Input className="pl-10 h-10 text-gray-900 placeholder:text-gray-500 font-medium" placeholder="Search crops..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="h-10 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-900 font-medium focus:ring-primary focus:border-primary" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
                        <option value="All">All Districts</option>
                        <option value="Wayanad">Wayanad</option>
                        <option value="Idukki">Idukki</option>
                        <option value="Kottayam">Kottayam</option>
                        <option value="Palakkad">Palakkad</option>
                    </select>
                    <select className="h-10 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-900 font-medium focus:ring-primary focus:border-primary" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                         <option value="All">All Categories</option>
                         <option value="Vegetables">Vegetables</option>
                         <option value="Spices">Spices</option>
                         <option value="Fruits">Fruits</option>
                         <option value="Tubers">Tubers</option>
                    </select>
                </div>
                
                <div className="flex gap-2 items-center flex-wrap">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button onClick={() => setSortOption('PRICE_ASC')} className={`p-1.5 rounded-md text-xs font-bold transition-colors ${sortOption === 'PRICE_ASC' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Price ↑</button>
                        <button onClick={() => setSortOption('PRICE_DESC')} className={`p-1.5 rounded-md text-xs font-bold transition-colors ${sortOption === 'PRICE_DESC' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Price ↓</button>
                        <button onClick={() => setSortOption('RATING')} className={`p-1.5 rounded-md text-xs font-bold transition-colors ${sortOption === 'RATING' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Rated</button>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer select-none bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-100 hover:bg-yellow-100 transition-colors">
                        <input type="checkbox" checked={promotedOnly} onChange={e => setPromotedOnly(e.target.checked)} className="rounded text-primary focus:ring-primary" />
                        <Star size={14} className={promotedOnly ? "fill-yellow-500 text-yellow-500" : "text-yellow-600"}/> Promoted
                    </label>
                </div>
            </div>

            {compareList.length > 0 && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-4 border border-gray-700 w-max max-w-[90vw]">
                    <span className="text-sm font-bold">{compareList.length} Selected</span>
                    <button onClick={() => setCompareList([])} className="text-xs text-gray-400 hover:text-white font-medium">Clear</button>
                    <Button size="sm" onClick={() => setIsCompareModalOpen(true)} className="bg-primary text-white border-none h-8 hover:bg-primaryDark">Compare</Button>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrops.map(crop => (
                    <Card key={crop.id} className="group overflow-hidden hover:shadow-lg transition-all border border-gray-200 relative">
                        <div className="relative h-48">
                            <RetailerCropImage 
                                src={GLOBAL_BROWSE_IMAGE} 
                                alt={crop.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                cropName={crop.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-bold font-heading text-xl">{crop.name}</h3>
                                <p className="text-sm opacity-90 font-medium">{crop.variety}</p>
                            </div>
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleWatchlist(crop.id); }}
                                className="absolute top-3 right-3 bg-black/20 hover:bg-white backdrop-blur-sm p-2 rounded-full transition-all text-white hover:text-red-500"
                            >
                                <Heart size={18} className={watchlist.includes(crop.id) ? "fill-red-500 text-red-500" : ""} />
                            </button>

                            {crop.qaStatus === 'VERIFIED' && (
                                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                                    <BadgeCheck size={12} fill="currentColor"/> QA Verified
                                </div>
                            )}
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-600 flex items-center gap-1 font-medium"><MapPin size={14}/> {crop.location}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="font-semibold text-gray-900">{crop.farmerName}</span>
                                        <span className="flex items-center text-xs bg-green-100 text-green-800 font-bold px-1.5 rounded">
                                            {crop.farmerRating} <Star size={10} className="ml-0.5 fill-current"/>
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">₹{crop.pricePerKg}</p>
                                    <p className="text-xs text-gray-500 font-medium">per kg</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg justify-between border border-gray-100">
                                <div className="flex items-center gap-2 font-medium"><Package size={16} className="text-gray-500"/> <span>Available: <strong>{crop.quantity} kg</strong></span></div>
                                <Badge variant={crop.priority === 'URGENT' ? 'danger' : 'neutral'}>{crop.priority}</Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id={`compare-${crop.id}`}
                                    checked={compareList.includes(crop.id)}
                                    onChange={() => toggleCompare(crop.id)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor={`compare-${crop.id}`} className="text-xs text-gray-600 font-medium cursor-pointer select-none">Add to Compare</label>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="secondary" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800" onClick={() => setViewDetailCrop(crop)}>View Details</Button>
                                <Button className="flex-1" onClick={() => { setSelectedCrop(crop); setOfferForm({ price: crop.pricePerKg.toString(), quantity: '', notes: '' }); }}>
                                    Make Offer
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            
            {/* Offer Modal */}
            <Modal isOpen={!!selectedCrop} onClose={() => setSelectedCrop(null)} title={`Make Offer: ${selectedCrop?.name}`}>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                         <div>
                             <p className="text-xs text-gray-500 uppercase font-bold">Asking Price</p>
                             <p className="text-lg font-bold text-gray-900">₹{selectedCrop?.pricePerKg} / kg</p>
                         </div>
                         <div>
                             <p className="text-xs text-gray-500 uppercase font-bold text-right">Available</p>
                             <p className="text-lg font-bold text-right text-gray-900">{selectedCrop?.quantity} kg</p>
                         </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Your Price (₹/kg)" type="number" min="0" value={offerForm.price} onChange={e => handleNumChange('price', e.target.value)} error={errors.price} />
                        <Input label="Quantity (kg)" type="number" min="0" value={offerForm.quantity} onChange={e => handleNumChange('quantity', e.target.value)} error={errors.quantity} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Note to Farmer</label>
                        <textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900" rows={3} placeholder="Add specific requirements..." value={offerForm.notes} onChange={e => setOfferForm({...offerForm, notes: e.target.value})}></textarea>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">Total Offer Value</span>
                        <span className="text-xl font-bold text-blue-900">₹{(Number(offerForm.price) * Number(offerForm.quantity)).toLocaleString()}</span>
                    </div>
                    <Button className="w-full h-12 text-base font-bold" onClick={handleMakeOffer} disabled={!!errors.price || !!errors.quantity || !offerForm.price || !offerForm.quantity}>Send Offer</Button>
                </div>
            </Modal>

            {/* Detail View Modal */}
            <Modal isOpen={!!viewDetailCrop} onClose={() => setViewDetailCrop(null)} title={viewDetailCrop?.name || 'Crop Details'}>
                {viewDetailCrop && (
                    <div className="space-y-6">
                        <RetailerCropImage 
                            src={viewDetailCrop.imageUrl} 
                            alt={viewDetailCrop.name} 
                            className="w-full h-48 object-cover rounded-xl"
                            cropName={viewDetailCrop.name}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Variety</p>
                                <p className="font-medium text-gray-900">{viewDetailCrop.variety}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Harvest Date</p>
                                <p className="font-medium text-gray-900">{viewDetailCrop.harvestDate}</p>
                            </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-xl">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-green-600"/> Quality Assurance</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">QA Status</span>
                                    <Badge variant={viewDetailCrop.qaStatus === 'VERIFIED' ? 'success' : viewDetailCrop.qaStatus === 'REQUESTED' ? 'warning' : 'neutral'}>{viewDetailCrop.qaStatus}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Farmer Rating</span>
                                    <span className="font-medium text-gray-900 flex items-center gap-1">{viewDetailCrop.farmerRating} <Star size={12} fill="currentColor" className="text-yellow-500"/></span>
                                </div>
                            </div>
                            {viewDetailCrop.qaStatus !== 'VERIFIED' && (
                                <Button size="sm" variant="outline" className="w-full mt-4 border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => { requestQACheck(viewDetailCrop.id); alert("QA Check Requested!"); }}>
                                    Request 3rd Party QA Check
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Compare Modal */}
             <Modal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} title="Compare Crops">
                <div className="grid grid-cols-3 gap-4 min-w-[600px] overflow-x-auto">
                    {crops.filter(c => compareList.includes(c.id)).map(crop => (
                        <div key={crop.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                            <h4 className="font-bold text-center text-lg text-gray-900">{crop.name}</h4>
                            <div className="text-center text-2xl font-bold text-primary">₹{crop.pricePerKg}</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500">Variety</span><span className="font-medium text-gray-900">{crop.variety}</span></div>
                                <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500">Qty</span><span className="font-medium text-gray-900">{crop.quantity}kg</span></div>
                                <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500">Location</span><span className="font-medium text-right text-gray-900">{crop.location}</span></div>
                                <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500">Rating</span><span className="font-medium text-gray-900">{crop.farmerRating}</span></div>
                            </div>
                            <Button size="sm" className="w-full" onClick={() => { setSelectedCrop(crop); setIsCompareModalOpen(false); }}>Offer</Button>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

// --- Tab 2: Offers & History ---
const MyOffersView = ({ onTrack }: { onTrack: (id: string) => void }) => {
    const { offers, withdrawOffer, updateOfferStatus } = useStore();
    const [viewMode, setViewMode] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
    const [searchQuery, setSearchQuery] = useState('');
    const [chatOffer, setChatOffer] = useState<Offer | null>(null);

    // Helper to categorize status
    const isActiveStatus = (status: string) => ['OFFER_SENT', 'NEGOTIATION', 'AGREEMENT'].includes(status);
    const isHistoryStatus = (status: string) => ['COMPLETED', 'REJECTED', 'WITHDRAWN', 'CANCELLED', 'EXPIRED', 'DISPATCH', 'DELIVERY', 'PAYMENT'].includes(status);

    const filteredOffers = useMemo(() => {
        return offers.filter(o => {
            const matchesSearch = o.cropName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  o.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesTab = viewMode === 'ACTIVE' ? isActiveStatus(o.status) : isHistoryStatus(o.status);
            
            return matchesTab && matchesSearch;
        });
    }, [offers, viewMode, searchQuery]);

    const activeCount = offers.filter(o => isActiveStatus(o.status)).length;
    const historyCount = offers.filter(o => isHistoryStatus(o.status)).length;

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
                        <button 
                            onClick={() => setViewMode('ACTIVE')} 
                            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'ACTIVE' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Active Offers ({activeCount})
                        </button>
                        <button 
                            onClick={() => setViewMode('HISTORY')} 
                            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'HISTORY' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            History ({historyCount})
                        </button>
                    </div>
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Input 
                            className="pl-10 h-11 text-gray-900 placeholder:text-gray-500" 
                            placeholder="Search offers by crop, farmer..." 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map(offer => {
                    const isNegotiating = offer.status === 'NEGOTIATION';
                    
                    return (
                        <Card key={offer.id} className="p-5 hover:shadow-md transition-shadow flex flex-col h-full border border-gray-200 bg-white group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                     <RetailerCropImage alt={offer.cropName} cropName={offer.cropName} className="w-12 h-12 rounded-lg object-cover" />
                                     <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{offer.cropName}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><User size={12}/> {offer.farmerName}</p>
                                    </div>
                                </div>
                                <Badge variant={offer.status === 'COMPLETED' ? 'success' : offer.status === 'REJECTED' ? 'danger' : 'warning'}>
                                    {offer.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 mb-4 flex-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Offer Price</span>
                                    <span className="font-bold text-gray-900">₹{offer.pricePerKg}/kg</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Quantity</span>
                                    <span className="font-bold text-gray-900">{offer.quantity} kg</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 flex justify-between items-center mt-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Total Value</span>
                                    <span className="font-bold text-primary text-lg">₹{offer.amount.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className="mt-auto space-y-2">
                                {viewMode === 'ACTIVE' ? (
                                    <>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100" 
                                                onClick={() => setChatOffer(offer)}
                                            >
                                                <MessageCircle size={16} className="mr-1"/> Chat
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                className="flex-1 border-gray-200 text-gray-700" 
                                                onClick={() => {
                                                    // Simple toggle for demo negotiation
                                                    const newStatus = isNegotiating ? 'OFFER_SENT' : 'NEGOTIATION';
                                                    updateOfferStatus(offer.id, newStatus);
                                                    alert(`Status updated to ${newStatus}`);
                                                }}
                                            >
                                                {isNegotiating ? 'Update Offer' : 'Negotiate'}
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" onClick={() => withdrawOffer(offer.id)}>
                                                Withdraw
                                            </Button>
                                            {offer.status === 'AGREEMENT' ? (
                                                <Button size="sm" className="flex-[2] bg-green-600 hover:bg-green-700 text-white" onClick={() => onTrack(offer.id)}>
                                                    Track Deal <ArrowRight size={16} className="ml-1"/>
                                                </Button>
                                            ) : (
                                                <Button size="sm" className="flex-[2] bg-gray-900 text-white hover:bg-black" onClick={() => { updateOfferStatus(offer.id, 'AGREEMENT'); alert("Offer Accepted! Moving to Timeline."); onTrack(offer.id); }}>
                                                    Accept Deal
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex gap-2">
                                         <Button variant="outline" size="sm" className="flex-1" onClick={() => setChatOffer(offer)}>
                                            View History
                                        </Button>
                                         <Button variant="ghost" size="sm" className="text-gray-500 cursor-default flex-1 justify-end">
                                            {new Date(offer.date).toLocaleDateString()}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
                {filteredOffers.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No offers found in {viewMode.toLowerCase()} view.</p>
                        <Button variant="outline" className="mt-4" onClick={() => {setSearchQuery('');}}>Clear Search</Button>
                    </div>
                )}
            </div>

            {/* Chat Modal */}
            <ChatModal 
                isOpen={!!chatOffer} 
                onClose={() => setChatOffer(null)} 
                offer={chatOffer} 
            />
        </div>
    );
};

// --- Tab 3: Timeline (Horizontal) ---
const TimelineView = ({ onBrowse }: { onBrowse: () => void }) => {
    const { offers } = useStore();
    // Active deals logic
    const activeDeals = offers.filter(o => ['AGREEMENT', 'DISPATCH', 'DELIVERY', 'PAYMENT', 'COMPLETED'].includes(o.status));
    
    // Timeline steps definition
    const STEPS = [
        { id: 'AGREEMENT', label: 'Agreement' },
        { id: 'DISPATCH', label: 'Dispatched' },
        { id: 'DELIVERY', label: 'In Transit' },
        { id: 'PAYMENT', label: 'Payment' },
        { id: 'COMPLETED', label: 'Completed' }
    ];

    const getStepStatus = (currentStatus: string, stepId: string) => {
        const statusOrder = ['AGREEMENT', 'DISPATCH', 'DELIVERY', 'PAYMENT', 'COMPLETED'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const stepIndex = statusOrder.indexOf(stepId);
        
        if (currentIndex > stepIndex) return 'completed';
        if (currentIndex === stepIndex) return 'current';
        return 'pending';
    };

    const HorizontalStepper = ({ deal }: { deal: Offer }) => {
        const [expandedStep, setExpandedStep] = useState<string | null>(null);

        return (
            <div>
                {/* Horizontal Scroll Container */}
                <div className="overflow-x-auto pb-4 no-scrollbar">
                    <div className="flex items-center min-w-[600px] px-4 pt-2">
                        {STEPS.map((step, i) => {
                            const status = getStepStatus(deal.status, step.id);
                            const isLast = i === STEPS.length - 1;
                            
                            return (
                                <React.Fragment key={step.id}>
                                    {/* Step Circle */}
                                    <div 
                                        className="relative flex flex-col items-center cursor-pointer group"
                                        onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all ${
                                            status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 
                                            status === 'current' ? 'bg-white border-green-500 text-green-500 shadow-md ring-4 ring-green-100' : 
                                            'bg-white border-gray-300 text-gray-300'
                                        }`}>
                                            {status === 'completed' ? <CheckCircle size={14}/> : <div className={`w-2 h-2 rounded-full ${status === 'current' ? 'bg-green-500' : 'bg-gray-300'}`}></div>}
                                        </div>
                                        <span className={`text-xs font-bold mt-2 whitespace-nowrap ${status === 'pending' ? 'text-gray-400' : 'text-gray-800'}`}>
                                            {step.label}
                                        </span>
                                    </div>

                                    {/* Connector Line */}
                                    {!isLast && (
                                        <div className="flex-1 h-0.5 bg-gray-200 mx-2 relative min-w-[60px]">
                                            <div 
                                                className={`absolute left-0 top-0 h-full bg-green-500 transition-all duration-500`} 
                                                style={{ width: status === 'completed' ? '100%' : '0%' }}
                                            ></div>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Expanded Details Panel */}
                <AnimatePresence>
                    {expandedStep && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gray-50 border-t border-gray-100 p-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm text-primary">
                                    <Clock size={18}/>
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-sm">{STEPS.find(s => s.id === expandedStep)?.label} Details</h5>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        {expandedStep === 'AGREEMENT' && "Both parties accepted the terms. Contract generated."}
                                        {expandedStep === 'DISPATCH' && "Shipment picked up by logistics partner."}
                                        {expandedStep === 'DELIVERY' && "Shipment is en route to distribution center."}
                                        {expandedStep === 'PAYMENT' && "Funds held in escrow, released upon verification."}
                                        {expandedStep === 'COMPLETED' && "Transaction successfully closed."}
                                        {getStepStatus(deal.status, expandedStep) === 'pending' && " (Pending Action)"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <Truck className="text-primary"/> Active Shipments & Deals
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
                {activeDeals.map(deal => (
                    <Card key={deal.id} className="p-0 overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                        {/* Card Header */}
                        <div className="bg-white p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <RetailerCropImage cropName={deal.cropName} alt={deal.cropName} className="h-12 w-12 rounded-xl object-cover shadow-sm"/>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{deal.cropName}</h4>
                                    <p className="text-sm text-gray-500 font-medium">ID: #{deal.id} • {deal.quantity}kg</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 self-start md:self-auto">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs text-gray-500 font-bold uppercase">Total Value</p>
                                    <p className="font-bold text-gray-900 text-lg">₹{deal.amount.toLocaleString()}</p>
                                </div>
                                <Badge variant="info" className="px-3 py-1 text-sm whitespace-nowrap">{deal.status.replace('_', ' ')}</Badge>
                            </div>
                        </div>

                        {/* Horizontal Stepper */}
                        <div className="bg-white">
                            <HorizontalStepper deal={deal} />
                        </div>
                        
                        <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-xs text-gray-500 font-medium ml-2">Updated: {new Date().toLocaleDateString()}</span>
                            <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900">View Invoice <ChevronRight size={16}/></Button>
                        </div>
                    </Card>
                ))}
                
                {activeDeals.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <Truck size={48} className="mx-auto text-gray-300 mb-4" />
                        <h4 className="font-bold text-gray-900 text-lg">No Active Shipments</h4>
                        <p className="text-gray-500 font-medium">Accepted offers will appear here for tracking.</p>
                        <Button variant="outline" className="mt-4" onClick={onBrowse}>Browse Marketplace</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const TrendsView = () => {
    // ... [Code remains unchanged]
    const priceData = [
        { name: 'Week 1', price: 40 },
        { name: 'Week 2', price: 42 },
        { name: 'Week 3', price: 38 },
        { name: 'Week 4', price: 45 },
        { name: 'Week 5', price: 48 },
    ];
    const distributionData = [
        { name: 'Spices', value: 400 },
        { name: 'Fruits', value: 300 },
        { name: 'Vegetables', value: 300 },
        { name: 'Tubers', value: 200 },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-primary"/> Nendran Banana Price Trend</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={priceData}>
                             <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2F9D3C" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#2F9D3C" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="price" stroke="#2F9D3C" fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

             <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><PieChart size={20} className="text-blue-500"/> Category Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distributionData} layout="vertical">
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" width={80} fontSize={12} tickLine={false} axisLine={false}/>
                             <Tooltip cursor={{fill: 'transparent'}}/>
                             <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="lg:col-span-2">
                <Card className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-xl">
                            <Activity size={24} className="text-yellow-400"/>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Market Intelligence</h3>
                            <p className="text-gray-400 text-sm">AI-driven insights for better procurement.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                             <p className="text-xs text-gray-400 uppercase font-bold mb-1">Price Alert</p>
                             <p className="text-sm font-medium">Cardamom prices expected to drop by 5% next week due to high yield forecast.</p>
                         </div>
                         <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                             <p className="text-xs text-gray-400 uppercase font-bold mb-1">High Demand</p>
                             <p className="text-sm font-medium">Organic Ginger demand surging in Kochi markets (+15% DoD).</p>
                         </div>
                         <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                             <p className="text-xs text-gray-400 uppercase font-bold mb-1">Weather Impact</p>
                             <p className="text-sm font-medium">Heavy rains in Wayanad may delay Banana harvest logistics by 2 days.</p>
                         </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const WatchlistView = () => {
    const { crops, watchlist, toggleWatchlist, addOffer } = useStore();
    const watchedCrops = crops.filter(c => watchlist.includes(c.id));
    
    // New State for Make Offer Modal
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
    const [offerForm, setOfferForm] = useState({ price: '', quantity: '', notes: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNumChange = (field: string, value: string) => {
        if (value && Number(value) < 0) {
            setOfferForm(prev => ({...prev, [field]: ''}));
            setErrors(prev => ({...prev, [field]: 'Cannot be negative'}));
        } else {
            setOfferForm(prev => ({...prev, [field]: value}));
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const handleMakeOffer = () => {
        if (!selectedCrop) return;
        if (!offerForm.price || !offerForm.quantity || Number(offerForm.price) <= 0 || Number(offerForm.quantity) <= 0) return;
        
        const newOffer: Offer = {
            id: Math.random().toString(36).substr(2, 9),
            cropId: selectedCrop.id,
            retailerId: 'RET-CURR',
            farmerName: selectedCrop.farmerName,
            cropName: selectedCrop.name,
            status: 'OFFER_SENT',
            amount: parseFloat(offerForm.price) * parseFloat(offerForm.quantity),
            pricePerKg: parseFloat(offerForm.price),
            quantity: parseFloat(offerForm.quantity),
            date: new Date().toISOString().split('T')[0],
            history: [],
            notes: offerForm.notes
        };
        addOffer(newOffer);
        setSelectedCrop(null);
        setOfferForm({ price: '', quantity: '', notes: '' });
        setErrors({});
        alert("Offer Sent Successfully! View it in the Offers tab.");
    };

    return (
        <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-900">Your Watchlist ({watchedCrops.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchedCrops.map(crop => (
                    <Card key={crop.id} className="relative group">
                         <div className="h-40 relative">
                             <img src={crop.imageUrl} className="w-full h-full object-cover rounded-t-xl" alt={crop.name} />
                             <button onClick={() => toggleWatchlist(crop.id)} className="absolute top-2 right-2 bg-white p-2 rounded-full text-red-500 shadow-md hover:bg-red-50">
                                 <Heart size={18} fill="currentColor"/>
                             </button>
                         </div>
                         <div className="p-4">
                             <h3 className="font-bold text-gray-900">{crop.name}</h3>
                             <p className="text-sm text-gray-500 mb-2">{crop.farmerName} • {crop.location}</p>
                             <div className="flex justify-between items-center">
                                 <p className="text-xl font-bold text-primary">₹{crop.pricePerKg}<span className="text-xs text-gray-400 font-normal">/kg</span></p>
                                 <Button size="sm" onClick={() => {
                                     setSelectedCrop(crop);
                                     setOfferForm({ price: crop.pricePerKg.toString(), quantity: '', notes: '' });
                                     setErrors({});
                                 }}>Make Offer</Button>
                             </div>
                         </div>
                    </Card>
                ))}
                {watchedCrops.length === 0 && <p className="text-gray-500 col-span-full py-10 text-center">Your watchlist is empty.</p>}
            </div>

            {/* Offer Modal (Copied from BrowseOffersView for consistency) */}
            <Modal isOpen={!!selectedCrop} onClose={() => setSelectedCrop(null)} title={`Make Offer: ${selectedCrop?.name}`}>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                         <div>
                             <p className="text-xs text-gray-500 uppercase font-bold">Asking Price</p>
                             <p className="text-lg font-bold text-gray-900">₹{selectedCrop?.pricePerKg} / kg</p>
                         </div>
                         <div>
                             <p className="text-xs text-gray-500 uppercase font-bold text-right">Available</p>
                             <p className="text-lg font-bold text-right text-gray-900">{selectedCrop?.quantity} kg</p>
                         </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Your Price (₹/kg)" type="number" min="0" value={offerForm.price} onChange={e => handleNumChange('price', e.target.value)} error={errors.price} />
                        <Input label="Quantity (kg)" type="number" min="0" value={offerForm.quantity} onChange={e => handleNumChange('quantity', e.target.value)} error={errors.quantity} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Note to Farmer</label>
                        <textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900" rows={3} placeholder="Add specific requirements..." value={offerForm.notes} onChange={e => setOfferForm({...offerForm, notes: e.target.value})}></textarea>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">Total Offer Value</span>
                        <span className="text-xl font-bold text-blue-900">₹{(Number(offerForm.price) * Number(offerForm.quantity)).toLocaleString()}</span>
                    </div>
                    <Button className="w-full h-12 text-base font-bold" onClick={handleMakeOffer} disabled={!!errors.price || !!errors.quantity || !offerForm.price || !offerForm.quantity}>Send Offer</Button>
                </div>
            </Modal>
        </div>
    );
};
