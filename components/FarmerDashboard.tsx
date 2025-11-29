
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { useStore } from '../store';
import { RiskLevel, Crop, StorageRequest, RetailerRequest, Negotiation, ForumPost, Comment, ExpertQuestion, Message, BarterListing, UnitType, RentalStatus, BarterRequest, PromotionPlan } from '../types';
import { Card, Badge, Button, Input, Modal } from './UI';
import { Thermometer, Droplets, AlertTriangle, TrendingUp, Archive, Truck, XCircle, Search, MessageSquare, UserCheck, Repeat, User, ThumbsUp, Send, ChevronRight, CreditCard, Package, ShoppingCart, MapPin, Star, Wifi, Battery, ShieldCheck, Calendar, Clock, AlertCircle, Eye, CheckSquare, Filter, Image as ImageIcon, Trash2, Plus, HelpCircle, ChevronDown, ChevronUp, Check, CheckCircle, MoreVertical, BarChart2, Leaf, Coins, Users, Snowflake, Box, Wind, Zap, Calculator, Wrench, Phone, RotateCcw, ArrowRight, Bell, AlertOctagon, Brain, ChevronLeft, Paperclip, Edit, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Constants for Mobile Storage
const KERALA_DISTRICTS = [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
    "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
    "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
];

const UNIT_DATA = [
    { name: 'Portable Fresh Storage', type: 'Portable Fresh Storage', capacity: '200-500 kg', price: 750, icon: <Box size={24} className="text-blue-500"/>, features: ['Standard Temp', 'Battery Backup', 'GPS'] },
    { name: 'Multi-Crop Storage', type: 'Multi-Crop Storage', capacity: '500-1000 kg', price: 1200, icon: <Package size={24} className="text-green-500"/>, features: ['Compartments', 'Humidity Control', 'Solar Ready'] },
    { name: 'Controlled Atmosphere (CA)', type: 'Controlled Atmosphere (CA)', capacity: '1000+ kg', price: 2500, icon: <Wind size={24} className="text-purple-500"/>, features: ['O2/CO2 Control', 'Precision Cooling', 'Long Term'] },
    { name: 'Ethylene Ripening Chamber', type: 'Ethylene Ripening Chamber', capacity: '500 kg', price: 1500, icon: <Zap size={24} className="text-yellow-500"/>, features: ['Ethylene Dosing', 'Gas Monitoring', 'Auto-Vent'] }
];

// Notification Component
const NotificationDropdown = () => {
    const { farmerNotifications, markNotificationRead, clearNotifications } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = farmerNotifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600"/>
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
                                <h4 className="font-bold text-sm text-gray-900">Notifications</h4>
                                {farmerNotifications.length > 0 && (
                                    <button onClick={clearNotifications} className="text-xs text-gray-500 hover:text-red-500">Clear All</button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {farmerNotifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-sm">No new notifications</div>
                                ) : (
                                    farmerNotifications.map(n => (
                                        <div 
                                            key={n.id} 
                                            className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                                            onClick={() => markNotificationRead(n.id)}
                                        >
                                            <div className="flex gap-2">
                                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.type === 'SUCCESS' ? 'bg-green-500' : n.type === 'WARNING' ? 'bg-yellow-500' : n.type === 'ERROR' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">{n.timestamp}</p>
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

export const FarmerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MONITORING' | 'MOBILE_STORAGE' | 'MARKETPLACE' | 'COMMUNITY'>('MONITORING');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">Farmer Dashboard</h1>
            <p className="text-gray-500">Kerala Region • <span className="text-primary font-semibold">Online</span></p>
        </div>
        
        <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 overflow-x-auto no-scrollbar max-w-[80vw]">
                {[
                    { id: 'MONITORING', label: 'Monitoring' },
                    { id: 'MOBILE_STORAGE', label: 'Mobile Storage' },
                    { id: 'MARKETPLACE', label: 'Market Connector' },
                    { id: 'COMMUNITY', label: 'Community' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'MONITORING' && <MonitoringView />}
        {activeTab === 'MOBILE_STORAGE' && <MobileStorageView />}
        {activeTab === 'MARKETPLACE' && <MarketplaceView />}
        {activeTab === 'COMMUNITY' && <CommunityView />}
      </motion.div>
    </div>
  );
};

interface FilterPillProps {
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
    color?: string;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, count, active, onClick, color = 'gray' }) => {
    const activeClasses: Record<string, string> = {
        gray: 'bg-gray-800 text-white shadow-lg shadow-gray-500/20 border-gray-800',
        red: 'bg-red-500 text-white shadow-lg shadow-red-500/20 border-red-500',
        yellow: 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20 border-yellow-500',
        green: 'bg-green-500 text-white shadow-lg shadow-green-500/20 border-green-500',
    };
    
    const inactiveClasses: Record<string, string> = {
        gray: 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200',
        red: 'bg-white text-red-600 hover:bg-red-50 border-gray-200',
        yellow: 'bg-white text-yellow-600 hover:bg-yellow-50 border-gray-200',
        green: 'bg-white text-green-600 hover:bg-green-50 border-gray-200',
    };

    return (
        <button 
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${active ? activeClasses[color] || activeClasses.gray : inactiveClasses[color] || inactiveClasses.gray}`}
        >
            {label}
            {count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {count}
                </span>
            )}
        </button>
    );
};

// Reusable Ask Expert Modal
const AskExpertModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; initialContext?: { title: string; desc: string; crop: string } }> = ({ isOpen, onClose, onSubmit, initialContext }) => {
    const [form, setForm] = useState({ title: '', desc: '', crop: '', image: '' });

    useEffect(() => {
        if (isOpen && initialContext) {
            setForm({ ...form, title: initialContext.title, desc: initialContext.desc, crop: initialContext.crop });
        } else if (isOpen && !initialContext) {
            setForm({ title: '', desc: '', crop: '', image: '' });
        }
    }, [isOpen, initialContext]);

    const handleSubmit = () => {
        if(!form.title) return;
        onSubmit(form);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ask an Expert">
            <div className="space-y-4">
                <Input label="Question Title" placeholder="e.g. Yellow spots on leaves" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                <Input label="Crop Related" placeholder="e.g. Tomato" value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} />
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Details</label>
                    <textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900" rows={4} placeholder="Describe symptoms, duration, and environment..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}></textarea>
                </div>
                
                {/* Mock Image Upload */}
                <div 
                    onClick={() => setForm({...form, image: "https://images.unsplash.com/photo-1591857177580-dc82b9e4e11c?q=80&w=500&auto=format&fit=crop"})}
                    className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${form.image ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                    {form.image ? (
                        <div className="flex items-center gap-2 text-green-700 font-bold text-xs"><Check size={16}/> Image Attached</div>
                    ) : (
                        <>
                            <ImageIcon size={24} className="text-gray-400 mb-1"/>
                            <span className="text-xs text-gray-500">Attach Photo (Optional)</span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 text-xs rounded-lg">
                    <AlertCircle size={16}/> Expert responses usually take 1-2 hours.
                </div>
                <Button className="w-full" onClick={handleSubmit}>Start Consultation</Button>
            </div>
        </Modal>
    );
};

const MonitoringView = () => {
  const { crops } = useStore();
  const [filter, setFilter] = useState<RiskLevel | 'ALL'>('ALL');
  
  // State for Action Modals
  const [serviceCrop, setServiceCrop] = useState<Crop | null>(null);
  const [shiftCrop, setShiftCrop] = useState<Crop | null>(null);
  const [expertCrop, setExpertCrop] = useState<Crop | null>(null);

  // New Question Handler for Monitoring
  const handleExpertFromMonitoring = (data: any) => {
      const { askExpertQuestion } = useStore.getState(); // Direct access for inline handler
      askExpertQuestion({
          id: Math.random().toString(),
          farmerName: 'John Doe',
          crop: data.crop,
          title: data.title,
          description: data.desc,
          status: 'OPEN',
          date: 'Just now',
          history: [{
              id: Math.random().toString(),
              sender: 'Farmer',
              content: data.desc,
              timestamp: 'Just now',
              type: 'text',
              isRead: true
          }]
      });
      setExpertCrop(null);
      alert("Question sent to expert!");
  };

  const filteredCrops = filter === 'ALL' ? crops : crops.filter(c => c.monitoring.riskLevel === filter);

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Live Crop Monitoring</h2>
            <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1">
                <FilterPill label="Total Monitored" active={filter === 'ALL'} onClick={() => setFilter('ALL')} color="gray" />
                <FilterPill label="High Risk" count={crops.filter(c => c.monitoring.riskLevel === RiskLevel.HIGH).length} active={filter === RiskLevel.HIGH} onClick={() => setFilter(RiskLevel.HIGH)} color="red" />
                <FilterPill label="Moderate Risk" count={crops.filter(c => c.monitoring.riskLevel === RiskLevel.MODERATE).length} active={filter === RiskLevel.MODERATE} onClick={() => setFilter(RiskLevel.MODERATE)} color="yellow" />
                <FilterPill label="Low Risk" active={filter === RiskLevel.LOW} onClick={() => setFilter(RiskLevel.LOW)} color="green" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
                <CropCard 
                    key={crop.id} 
                    crop={crop} 
                    onService={() => setServiceCrop(crop)}
                    onShift={() => setShiftCrop(crop)}
                    onExpert={() => setExpertCrop(crop)}
                />
            ))}
        </div>

        {/* Maintenance Modal */}
        {serviceCrop && (
            <MaintenanceRequestModal 
                isOpen={!!serviceCrop} 
                onClose={() => setServiceCrop(null)} 
                crop={serviceCrop} 
            />
        )}

        {/* Shift Unit Modal */}
        {shiftCrop && (
            <ShiftUnitModal 
                isOpen={!!shiftCrop} 
                onClose={() => setShiftCrop(null)} 
                crop={shiftCrop} 
            />
        )}

        {/* Expert Modal (Reused) */}
        {expertCrop && (
            <AskExpertModal 
                isOpen={!!expertCrop} 
                onClose={() => setExpertCrop(null)} 
                onSubmit={handleExpertFromMonitoring}
                initialContext={{
                    title: `Risk Alert: ${expertCrop.name} (${expertCrop.monitoring.riskLevel} Risk)`,
                    desc: `Monitoring data: Temp ${expertCrop.monitoring.temperature}°C, Humidity ${expertCrop.monitoring.humidity}%. AI Insight: "${expertCrop.monitoring.explanation}". Requesting advice on mitigation.`,
                    crop: expertCrop.name
                }}
            />
        )}
    </div>
  );
};

// ... existing modals (MaintenanceRequestModal, ShiftUnitModal) ...
const MaintenanceRequestModal: React.FC<{ isOpen: boolean, onClose: () => void, crop: Crop }> = ({ isOpen, onClose, crop }) => {
    const { requestMaintenance } = useStore();
    const [desc, setDesc] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [time, setTime] = useState('');

    const handleSubmit = () => {
        if(!desc) return;
        requestMaintenance(crop.storageUnitId, desc, priority, time);
        onClose();
        alert("Maintenance Requested Successfully!");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request Maintenance">
            <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                    <p className="text-gray-900"><strong>Unit:</strong> {crop.storageUnitId}</p>
                    <p className="text-gray-900"><strong>Crop:</strong> {crop.name}</p>
                    <p className="text-red-600 mt-1"><strong>Detected Issue:</strong> {crop.monitoring.explanation}</p>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900" rows={3} placeholder="Describe the issue..." value={desc} onChange={e => setDesc(e.target.value)}></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-1.5">Priority</label>
                        <select className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900" value={priority} onChange={e => setPriority(e.target.value)}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                    <Input label="Preferred Time" type="time" value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleSubmit} disabled={!desc}>Submit Request</Button>
            </div>
        </Modal>
    );
};

const ShiftUnitModal: React.FC<{ isOpen: boolean, onClose: () => void, crop: Crop }> = ({ isOpen, onClose, crop }) => {
    const { createStorageRequest } = useStore();
    const [form, setForm] = useState({ 
        qty: crop.quantity.toString(), 
        duration: '7', 
        location: crop.location.split(',')[0].trim(),
        startDate: new Date().toISOString().split('T')[0]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const suggestedUnit = UNIT_DATA.find(u => u.name.includes(crop.name.includes('Banana') ? 'Ripening' : 'Controlled')) || UNIT_DATA[0];

    const handleNumChange = (field: string, value: string) => {
        if (value && Number(value) < 0) {
            setForm(prev => ({...prev, [field]: ''}));
            setErrors(prev => ({...prev, [field]: 'Cannot be negative'}));
        } else {
            setForm(prev => ({...prev, [field]: value}));
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const handleSubmit = () => {
        if (!form.qty || !form.duration || Number(form.qty) <= 0 || Number(form.duration) <= 0) return;
        createStorageRequest({
            id: Math.random().toString(),
            unitType: suggestedUnit.type as UnitType,
            crop: crop.name,
            quantity: Number(form.qty),
            duration: Number(form.duration),
            startDate: form.startDate,
            location: form.location,
            cost: suggestedUnit.price * Number(form.duration),
            status: 'REQUESTED',
            requestDate: new Date().toLocaleDateString(),
            timeline: [{ status: 'REQUESTED', date: 'Just now', completed: true }]
        });
        onClose();
        alert("Shift Request Submitted!");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request Unit Shift">
            <div className="space-y-4">
                <p className="text-sm text-gray-600">Requesting transfer/additional storage for <strong>{crop.name}</strong>.</p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm flex justify-between items-center">
                    <span className="text-gray-900 font-medium">Suggested Unit: <strong>{suggestedUnit.name}</strong></span>
                    <Badge variant="info">₹{suggestedUnit.price}/day</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Quantity (kg)" type="number" min="0" value={form.qty} onChange={e => handleNumChange('qty', e.target.value)} error={errors.qty} />
                    <Input label="Duration (Days)" type="number" min="0" value={form.duration} onChange={e => handleNumChange('duration', e.target.value)} error={errors.duration} />
                </div>
                <Input label="New Location (District)" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                <Button className="w-full" onClick={handleSubmit} disabled={!!errors.qty || !!errors.duration || !form.qty || !form.duration}>Confirm Shift Request</Button>
            </div>
        </Modal>
    );
};

// ... CropCard ...
const CropCard: React.FC<{ crop: Crop, onService?: () => void, onShift?: () => void, onExpert?: () => void }> = ({ crop, onService, onShift, onExpert }) => {
    const data = Array.from({ length: 15 }, (_, i) => ({ time: i, temp: crop.monitoring.temperature + (Math.random() - 0.5) * 2, hum: crop.monitoring.humidity + (Math.random() - 0.5) * 5 }));
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    
    const riskConfig = {
        [RiskLevel.LOW]: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', subtext: 'text-green-700', iconColor: 'text-green-600', bar: 'bg-green-500', label: 'Low Risk' },
        [RiskLevel.MODERATE]: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', subtext: 'text-yellow-800', iconColor: 'text-yellow-600', bar: 'bg-yellow-500', label: 'Moderate Risk' },
        [RiskLevel.HIGH]: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', subtext: 'text-red-800', iconColor: 'text-red-600', bar: 'bg-red-500', label: 'High Risk' }
    };
    const config = riskConfig[crop.monitoring.riskLevel] || riskConfig[RiskLevel.HIGH];
    const hours = crop.monitoring.spoilageHours || 72;
    const timelineColor = hours < 36 ? 'bg-red-500' : hours < 72 ? 'bg-yellow-500' : 'bg-green-500';
    const timelineWidth = Math.min(100, Math.max(10, (hours / 168) * 100));

    const handleAction = (action: string, callback?: () => void) => {
        if (!callback) return;
        setLoadingAction(action);
        setTimeout(() => {
            callback();
            setLoadingAction(null);
        }, 600);
    };

    return (
        <Card className="flex flex-col h-full border-t-4 border-t-transparent hover:border-t-primary transition-all duration-300 group">
            <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">{crop.name}</h3>
                    <p className="text-sm text-gray-500">{crop.storageUnitId} • {crop.quantity}kg</p>
                </div>
                <Badge variant={crop.monitoring.riskLevel === 'HIGH' ? 'danger' : crop.monitoring.riskLevel === 'MODERATE' ? 'warning' : 'success'}>{crop.monitoring.riskLevel} Risk</Badge>
            </div>
            <div className="p-5 space-y-6 flex-1">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl">
                    <div className="space-y-1 text-center"><div className="flex items-center justify-center text-gray-500 text-xs gap-1"><Thermometer size={14}/> Temp</div><div className="text-2xl font-bold text-gray-900">{crop.monitoring.temperature}°C</div></div>
                    <div className="space-y-1 text-center border-l border-gray-200"><div className="flex items-center justify-center text-gray-500 text-xs gap-1"><Droplets size={14}/> Humidity</div><div className="text-2xl font-bold text-gray-900">{crop.monitoring.humidity}%</div></div>
                </div>
                
                <div className="h-24 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><defs><linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E15554" stopOpacity={0.1}/><stop offset="95%" stopColor="#E15554" stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="temp" stroke="#E15554" strokeWidth={2} fill="url(#colorTemp)" /><Line type="monotone" dataKey="hum" stroke="#2F9D3C" strokeWidth={2} dot={false} /></AreaChart></ResponsiveContainer></div>
                
                <div className={`p-4 rounded-xl border ${config.bg} ${config.border} space-y-3`}>
                    <div className="flex justify-between items-center">
                        <h4 className={`text-xs font-bold uppercase flex items-center gap-1.5 ${config.text}`}><Brain size={14} className={config.iconColor} /> AI Analysis</h4>
                        <span className="text-[10px] font-bold bg-white/60 px-2 py-0.5 rounded-full text-gray-800 border border-white/50">{crop.monitoring.confidence || 85}% Conf.</span>
                    </div>
                    <p className={`text-xs font-medium leading-relaxed ${config.subtext} italic`}>"{crop.monitoring.explanation || 'Routine monitoring active.'}"</p>
                    <div className={`flex gap-3 items-start ${config.subtext} pt-2 border-t border-black/5`}>
                        <ShieldCheck size={16} className={`shrink-0 mt-0.5 ${config.iconColor}`} />
                        <div className="text-sm font-bold leading-snug">{crop.monitoring.recommendation}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-600">
                        <span>Est. Spoilage</span>
                        <span className={`${hours < 36 ? 'text-red-600 font-bold' : 'text-gray-800'}`}>~{hours} Hours</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${timelineColor}`} style={{ width: `${timelineWidth}%` }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex flex-col h-auto py-2 gap-1 border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" onClick={() => handleAction('service', onService)} isLoading={loadingAction === 'service'} aria-label="Request Maintenance">{!loadingAction && <Phone size={16} />}<span className="text-[10px]">Service</span></Button>
                    <Button variant="outline" size="sm" className="flex flex-col h-auto py-2 gap-1 border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200" onClick={() => handleAction('shift', onShift)} isLoading={loadingAction === 'shift'} aria-label="Shift Unit">{!loadingAction && <Truck size={16} />}<span className="text-[10px]">Shift Unit</span></Button>
                    <Button variant="outline" size="sm" className="flex flex-col h-auto py-2 gap-1 border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200" onClick={() => handleAction('expert', onExpert)} isLoading={loadingAction === 'expert'} aria-label="Ask Expert">{!loadingAction && <MessageSquare size={16} />}<span className="text-[10px]">Expert</span></Button>
                </div>
            </div>
        </Card>
    );
};

// ... MobileStorageView, RequestUnitsView, PendingRequestsView, ActiveUnitsView, RentalHistoryView ... 
// (For brevity, I will include the unchanged components to ensure file integrity)
const MobileStorageView = () => {
    const [activeSubTab, setActiveSubTab] = useState<'REQUEST' | 'PENDING' | 'ACTIVE' | 'HISTORY'>('REQUEST');
    return (
        <div className="space-y-6">
            <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                {[{ id: 'REQUEST', label: 'Request Units' }, { id: 'PENDING', label: 'Pending Requests' }, { id: 'ACTIVE', label: 'Active Units' }, { id: 'HISTORY', label: 'History' }].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveSubTab(tab.id as any)} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeSubTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab.label}</button>
                ))}
            </div>
            <motion.div key={activeSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {activeSubTab === 'REQUEST' && <RequestUnitsView />}
                {activeSubTab === 'PENDING' && <PendingRequestsView />}
                {activeSubTab === 'ACTIVE' && <ActiveUnitsView />}
                {activeSubTab === 'HISTORY' && <RentalHistoryView onNavigateToPending={() => setActiveSubTab('PENDING')} />}
            </motion.div>
        </div>
    );
};

const RequestUnitsView = () => {
    const { createStorageRequest } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
    const [form, setForm] = useState({ crop: '', qty: '', duration: '', startDate: '', location: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dateError, setDateError] = useState('');

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setForm({...form, startDate: val});
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0,0,0,0);
        if(selectedDate < today) setDateError("Start date cannot be in the past");
        else setDateError("");
    };

    const handleNumChange = (field: string, value: string) => {
        if (value && Number(value) < 0) {
            setForm(prev => ({...prev, [field]: ''}));
            setErrors(prev => ({...prev, [field]: 'Cannot be negative'}));
        } else {
            setForm(prev => ({...prev, [field]: value}));
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const handleSubmit = () => {
        if (!selectedUnit || !form.crop || !form.startDate || !form.location || dateError || !form.qty || !form.duration || Number(form.qty) <= 0 || Number(form.duration) <= 0) return;
        createStorageRequest({
            id: Math.random().toString(), unitType: selectedUnit.type, crop: form.crop, quantity: Number(form.qty), duration: Number(form.duration), startDate: form.startDate, location: form.location, cost: selectedUnit.price * Number(form.duration), status: 'REQUESTED', requestDate: new Date().toLocaleDateString(), timeline: [{ status: 'REQUESTED', date: 'Just now', completed: true }]
        });
        setIsModalOpen(false);
        setForm({ crop: '', qty: '', duration: '', startDate: '', location: '' });
        alert("Request submitted successfully! View it in Pending Requests.");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UNIT_DATA.map((unit, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary/20" onClick={() => { setSelectedUnit(unit); setIsModalOpen(true); }}>
                    <div className="flex justify-between items-start mb-4"><div className="p-3 bg-gray-50 rounded-xl">{unit.icon}</div><Badge variant="neutral" className="text-xs">₹{unit.price}/day</Badge></div><h3 className="font-bold text-lg text-gray-900 mb-1">{unit.name}</h3><p className="text-sm text-gray-500 mb-4">Capacity: {unit.capacity}</p><div className="flex flex-wrap gap-2 mb-4">{unit.features.map(f => <span key={f} className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600">{f}</span>)}</div><Button variant="outline" className="w-full">Select Unit</Button>
                </Card>
            ))}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Storage Unit">
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3 mb-4"><Calculator className="text-blue-600"/><div><p className="text-xs text-blue-600 font-bold uppercase">Estimated Cost</p><p className="text-lg font-bold text-blue-900">₹{selectedUnit ? selectedUnit.price * (Number(form.duration) || 1) : 0}</p></div></div>
                    <div className="grid grid-cols-2 gap-4"><Input label="Crop Name" placeholder="e.g. Tomato" value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} /><Input label="Quantity (kg)" type="number" min="0" value={form.qty} onChange={e => handleNumChange('qty', e.target.value)} error={errors.qty} /></div>
                    <div className="grid grid-cols-2 gap-4"><Input label="Duration (Days)" type="number" min="0" value={form.duration} onChange={e => handleNumChange('duration', e.target.value)} error={errors.duration} /><div className="w-full"><Input label="Start Date" type="date" value={form.startDate} onChange={handleDateChange} className={dateError ? 'border-red-500 focus:ring-red-200' : ''} />{dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}</div></div>
                    <div className="w-full"><label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Location (Kerala District)</label><div className="relative"><select className="block h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus:ring-primary focus-visible:ring-offset-2" value={form.location} onChange={e => setForm({...form, location: e.target.value})}><option value="" disabled>Select a District</option>{KERALA_DISTRICTS.map(district => (<option key={district} value={district}>{district}</option>))}</select></div></div>
                    <Button className="w-full" onClick={handleSubmit} disabled={!!dateError || !!errors.qty || !!errors.duration || !form.startDate || !form.location || !form.crop || !form.qty || !form.duration}>Confirm Request</Button>
                </div>
            </Modal>
        </div>
    );
};

const PendingRequestsView = () => {
    const { storageRequests, cancelRequest } = useStore();
    const activeRequests = storageRequests.filter(r => r.status !== 'CANCELLED' && r.status !== 'ACTIVE');
    const steps = ['REQUESTED', 'ASSIGNED', 'DISPATCHED', 'INSTALLED', 'ACTIVE'];

    return (
        <div className="space-y-6">
            {activeRequests.length === 0 && <div className="text-center py-10 text-gray-500">No pending requests.</div>}
            {activeRequests.map(req => {
                const currentStepIndex = steps.indexOf(req.status);
                return (
                    <Card key={req.id} className="p-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6"><div><h3 className="font-bold text-lg text-gray-900">{req.unitType}</h3><p className="text-sm text-gray-500">For {req.quantity}kg {req.crop} • {req.duration} days</p></div><div className="text-right"><Badge variant="warning">{req.status}</Badge></div></div>
                        <div className="relative flex justify-between mb-8"><div className="absolute top-3 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>{steps.map((step, idx) => { const isCompleted = idx <= currentStepIndex; const isCurrent = idx === currentStepIndex; return (<div key={step} className="flex flex-col items-center bg-white px-1"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-2 transition-colors ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{isCompleted ? <Check size={14} /> : idx + 1}</div><span className={`text-[10px] font-bold hidden sm:block ${isCurrent ? 'text-green-600' : 'text-gray-400'}`}>{step}</span></div>); })}</div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100"><div className="flex items-center gap-2 text-sm text-gray-600"><User size={16}/> Service: <span className="font-semibold">{req.serviceMember || 'Pending Assignment'}</span></div><div className="flex gap-2">{req.status === 'REQUESTED' && <Button size="sm" variant="danger" onClick={() => cancelRequest(req.id)}>Cancel Request</Button>}{(req.status === 'ASSIGNED' || req.status === 'DISPATCHED') && <Button size="sm" variant="outline"><MessageSquare size={16} className="mr-2"/> Chat Support</Button>}</div></div>
                    </Card>
                );
            })}
        </div>
    );
};

const ActiveUnitsView = () => {
    const { deployedUnits, extendRental, requestMaintenance } = useStore();
    const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
    const [issue, setIssue] = useState('');

    const getRiskStyles = (level: string) => {
        switch(level) {
            case 'Low': return 'text-green-900 bg-green-50 border-green-100';
            case 'Moderate': return 'text-yellow-900 bg-yellow-50 border-yellow-100';
            case 'High': return 'text-red-900 bg-red-50 border-red-100';
            default: return 'text-gray-900 bg-gray-50 border-gray-100';
        }
    };

    const handleMaintenanceSubmit = () => {
        if (selectedUnitId && issue) { requestMaintenance(selectedUnitId, issue); setMaintenanceModalOpen(false); setIssue(''); setSelectedUnitId(null); alert("Maintenance ticket created successfully!"); }
    };

    return (
        <div className="space-y-6">
            {deployedUnits.map(unit => {
                const riskClasses = getRiskStyles(unit.riskLevel);
                return (
                <Card key={unit.id} className="overflow-hidden border border-gray-200">
                    <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center"><div className="flex items-center gap-3"><div className={`h-3 w-3 rounded-full ${unit.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div><div><h3 className="font-bold text-lg">{unit.name}</h3><p className="text-xs text-gray-400 font-mono">{unit.unitId} • {unit.unitType}</p></div></div><div className="text-right"><p className="text-2xl font-bold">{unit.remainingDays} <span className="text-sm font-normal text-gray-400">Days Left</span></p></div></div>
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-1 space-y-6">{unit.maintenanceTicket ? (<div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl"><h4 className="font-bold text-yellow-800 text-sm mb-1 flex items-center gap-2"><Wrench size={14}/> Maintenance Requested</h4><p className="text-xs text-yellow-700">Status: {unit.maintenanceTicket.status}</p><p className="text-xs text-yellow-600 mt-1">"{unit.maintenanceTicket.issue}"</p></div>) : (<div className="grid grid-cols-2 gap-4"><div className="bg-blue-50 p-3 rounded-xl text-center"><Thermometer className="mx-auto text-blue-500 mb-1" /><p className="text-2xl font-bold text-gray-900">{unit.temperature.current}°C</p></div><div className="bg-green-50 p-3 rounded-xl text-center"><Droplets className="mx-auto text-green-500 mb-1" /><p className="text-2xl font-bold text-gray-900">{unit.humidity.current}%</p></div></div>)}<div className={`p-4 rounded-xl border ${riskClasses}`}><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold uppercase flex items-center gap-1"><AlertTriangle size={14} /> AI Risk Assessment</span><Badge variant={unit.riskLevel === 'Low' ? 'success' : unit.riskLevel === 'Moderate' ? 'warning' : 'danger'}>{unit.riskLevel} Risk</Badge></div><p className="text-sm font-bold">{unit.recommendation}</p></div><div className="flex gap-2"><Button size="sm" className="flex-1" onClick={() => extendRental(unit.id, 3)}>Extend (+3 Days)</Button><Button size="sm" variant="outline" className="flex-1" disabled={!!unit.maintenanceTicket} onClick={() => { setSelectedUnitId(unit.id); setMaintenanceModalOpen(true); }}><Wrench size={16} className="mr-2"/> Service</Button></div></div><div className="lg:col-span-2 h-64 bg-gray-50 rounded-xl p-4 border border-gray-100"><h4 className="text-sm font-bold text-gray-500 mb-4">24-Hour Telemetry</h4><ResponsiveContainer width="100%" height="100%"><LineChart data={unit.telemetryHistory}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10}} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} /><Tooltip /><Line type="monotone" dataKey="temp" stroke="#3B82F6" strokeWidth={2} dot={false} name="Temp" /><Line type="monotone" dataKey="humidity" stroke="#10B981" strokeWidth={2} dot={false} name="Humidity" /></LineChart></ResponsiveContainer></div></div>
                </Card>
            )})}
            <Modal isOpen={maintenanceModalOpen} onClose={() => setMaintenanceModalOpen(false)} title="Request Maintenance">
                <div className="space-y-4"><p className="text-sm text-gray-600">Describe the issue with your storage unit. A service technician will be assigned shortly.</p><textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900" rows={3} placeholder="e.g. Temperature fluctuation, Door not sealing..." value={issue} onChange={(e) => setIssue(e.target.value)} /><div className="flex gap-3 mt-4"><Button variant="ghost" onClick={() => setMaintenanceModalOpen(false)} className="flex-1">Cancel</Button><Button onClick={handleMaintenanceSubmit} className="flex-1">Submit Request</Button></div></div>
            </Modal>
        </div>
    );
};

interface RentalHistoryViewProps {
    onNavigateToPending?: () => void;
}

const RentalHistoryView: React.FC<RentalHistoryViewProps> = ({ onNavigateToPending }) => {
    const { rentalHistory, createStorageRequest } = useStore();
    const [isRentAgainModalOpen, setIsRentAgainModalOpen] = useState(false);
    const [rentForm, setRentForm] = useState({ crop: '', unitType: '', qty: '', duration: '', startDate: '', location: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dateError, setDateError] = useState('');

    const handleRentAgainClick = (item: any) => {
        setRentForm({ crop: item.crop, unitType: item.unitType, qty: '', duration: '', startDate: new Date().toISOString().split('T')[0], location: item.location || 'Wayanad' });
        setIsRentAgainModalOpen(true);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setRentForm({...rentForm, startDate: val});
        if(new Date(val) < new Date()) setDateError("Start date cannot be in the past"); else setDateError("");
    };

    const handleNumChange = (field: string, value: string) => {
        if (value && Number(value) < 0) {
            setRentForm(prev => ({...prev, [field]: ''}));
            setErrors(prev => ({...prev, [field]: 'Cannot be negative'}));
        } else {
            setRentForm(prev => ({...prev, [field]: value}));
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const calculateEstimatedCost = () => {
        const unit = UNIT_DATA.find(u => u.type === rentForm.unitType);
        return (unit ? unit.price : 0) * (Number(rentForm.duration) || 0);
    };

    const handleRentSubmit = () => {
        if (!rentForm.qty || !rentForm.duration || !rentForm.startDate || dateError || Number(rentForm.qty) <= 0 || Number(rentForm.duration) <= 0) return;
        createStorageRequest({
            id: Math.random().toString(), unitType: rentForm.unitType as UnitType, crop: rentForm.crop, quantity: Number(rentForm.qty), duration: Number(rentForm.duration), startDate: rentForm.startDate, location: rentForm.location, cost: calculateEstimatedCost(), status: 'REQUESTED', requestDate: new Date().toLocaleDateString(), timeline: [{ status: 'REQUESTED', date: 'Just now', completed: true }]
        });
        setIsRentAgainModalOpen(false);
        alert("Rent Again request submitted successfully!");
        if (onNavigateToPending) onNavigateToPending();
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[700px]">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500"><tr><th className="px-6 py-3">Unit Type</th><th className="px-6 py-3">Crop</th><th className="px-6 py-3">Dates</th><th className="px-6 py-3">Location</th><th className="px-6 py-3">Cost</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Action</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">{rentalHistory.map(rental => (<tr key={rental.id} className="hover:bg-gray-50/50"><td className="px-6 py-4 font-medium text-gray-900">{rental.unitType}</td><td className="px-6 py-4 text-gray-600">{rental.crop}</td><td className="px-6 py-4 text-gray-600">{rental.dates}</td><td className="px-6 py-4 text-gray-600">{rental.location}</td><td className="px-6 py-4 font-bold">₹{rental.cost}</td><td className="px-6 py-4"><Badge variant={rental.status === 'COMPLETED' ? 'success' : 'danger'}>{rental.status}</Badge></td><td className="px-6 py-4 text-right"><Button size="sm" variant="ghost" className="text-primary hover:bg-green-50 flex items-center gap-1 ml-auto" onClick={() => handleRentAgainClick(rental)}><RotateCcw size={14}/> Rent Again</Button></td></tr>))}</tbody>
                </table>
            </div>
            <Modal isOpen={isRentAgainModalOpen} onClose={() => setIsRentAgainModalOpen(false)} title="Rent Again Request">
                <div className="space-y-5">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center"><div><p className="text-xs text-gray-500 uppercase font-bold">Re-ordering for</p><p className="font-bold text-gray-900">{rentForm.crop}</p></div><Badge variant="neutral">{rentForm.unitType}</Badge></div>
                    <div className="grid grid-cols-2 gap-4"><Input label="Quantity (kg)" type="number" min="0" value={rentForm.qty} onChange={(e) => handleNumChange('qty', e.target.value)} error={errors.qty}/><Input label="Duration (Days)" type="number" min="0" value={rentForm.duration} onChange={(e) => handleNumChange('duration', e.target.value)} error={errors.duration}/></div>
                    <div className="grid grid-cols-1 gap-4"><div><Input label="Start Date" type="date" value={rentForm.startDate} onChange={handleDateChange} className={dateError ? 'border-red-500 focus:ring-red-200' : ''}/>{dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}</div><div className="w-full"><label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Location</label><div className="relative"><select className="block h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus:ring-primary focus-visible:ring-offset-2" value={rentForm.location} onChange={e => setRentForm({...rentForm, location: e.target.value})}><option value="" disabled>Select a District</option>{KERALA_DISTRICTS.map(district => (<option key={district} value={district}>{district}</option>))}</select></div></div></div>
                    <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center border border-blue-100"><div className="flex items-center gap-2 text-blue-700"><Calculator size={20} /><span className="text-sm font-medium">Estimated Total</span></div><p className="text-xl font-bold text-blue-900">₹{calculateEstimatedCost()}</p></div>
                    <div className="flex gap-3 pt-2"><Button variant="ghost" className="flex-1" onClick={() => setIsRentAgainModalOpen(false)}>Cancel</Button><Button className="flex-1" onClick={handleRentSubmit} disabled={!!dateError || !!errors.qty || !!errors.duration || !rentForm.qty || !rentForm.duration || !rentForm.location}>Submit Request</Button></div>
                </div>
            </Modal>
        </div>
    );
};

const MarketplaceView = () => {
    const [subTab, setSubTab] = useState<'LISTINGS' | 'REQUESTS' | 'NEGOTIATIONS' | 'TRENDS'>('LISTINGS');
    return (
        <div className="space-y-6">
             <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                <button onClick={() => setSubTab('LISTINGS')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${subTab === 'LISTINGS' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>My Listings</button>
                <button onClick={() => setSubTab('REQUESTS')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${subTab === 'REQUESTS' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Retailer Requests</button>
                <button onClick={() => setSubTab('NEGOTIATIONS')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${subTab === 'NEGOTIATIONS' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Price Negotiations</button>
                <button onClick={() => setSubTab('TRENDS')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${subTab === 'TRENDS' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Market Trends</button>
            </div>
            {subTab === 'LISTINGS' && <MyListingsTab />}
            {subTab === 'REQUESTS' && <RetailerRequestsTab />}
            {subTab === 'NEGOTIATIONS' && <NegotiationsTab />}
            {subTab === 'TRENDS' && <MarketTrendsTab />}
        </div>
    );
};

// --- PROMOTE MODAL ---
const PromoteModal: React.FC<{ isOpen: boolean; onClose: () => void; crop: Crop; onConfirm: (plan: PromotionPlan) => void }> = ({ isOpen, onClose, crop, onConfirm }) => {
    const [selectedPlan, setSelectedPlan] = useState<PromotionPlan>('MONTHLY');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const PLANS: { id: PromotionPlan, name: string, price: number, duration: string, tag?: string }[] = [
        { id: 'WEEKLY', name: '1 Week', price: 49, duration: '7 days' },
        { id: 'MONTHLY', name: '1 Month', price: 149, duration: '30 days', tag: 'POPULAR' },
        { id: 'QUARTERLY', name: '3 Months', price: 399, duration: '90 days', tag: 'BEST VALUE' },
    ];

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                onConfirm(selectedPlan);
                setIsSuccess(false);
                onClose();
            }, 1000);
        }, 2000); // 2 second mock payment
    };

    if (isSuccess) {
        return (
            <Modal isOpen={isOpen} onClose={() => {}} title="">
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                        <Check size={32} strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Payment Successful!</h3>
                    <p className="text-gray-500">Your listing for {crop.name} is now promoted.</p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Promote ${crop.name}`}>
            <div className="space-y-6">
                <div className="text-center">
                    <p className="text-gray-600 text-sm">Boost visibility and get up to 3x more inquiries.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {PLANS.map(plan => (
                        <div 
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-2 hover:shadow-md ${selectedPlan === plan.id ? 'border-primary bg-green-50' : 'border-gray-100 hover:border-green-200'}`}
                        >
                            {plan.tag && (
                                <span className="absolute -top-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    {plan.tag}
                                </span>
                            )}
                            <h4 className="font-bold text-gray-900">{plan.name}</h4>
                            <p className="text-2xl font-bold text-primary">₹{plan.price}</p>
                            <p className="text-xs text-gray-500">{plan.duration}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Total Payable</p>
                        <p className="text-xl font-bold text-gray-900">₹{PLANS.find(p => p.id === selectedPlan)?.price}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-xs text-gray-500">Secure Payment via</p>
                         <p className="text-sm font-bold text-gray-700 flex items-center justify-end gap-1"><CreditCard size={14}/> FreshVault Pay</p>
                    </div>
                </div>

                <Button 
                    className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" 
                    onClick={handlePayment} 
                    isLoading={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Proceed to Pay'}
                </Button>
            </div>
        </Modal>
    );
};

// ... EDIT LISTING MODAL ...
const SAMPLE_IMAGES = [
    "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=500&auto=format&fit=crop", // Banana
    "https://images.unsplash.com/photo-1550397623-287db30d0fb3?q=80&w=500&auto=format&fit=crop", // Cardamom
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&auto=format&fit=crop", // Pepper
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=500&auto=format&fit=crop", // Ginger
    "https://images.unsplash.com/photo-1592186309879-fb54893cb9e4?q=80&w=500&auto=format&fit=crop", // Tapioca
];

const EditListingModal: React.FC<{ isOpen: boolean; onClose: () => void; crop: Crop; onSave: (updatedCrop: Crop) => void }> = ({ isOpen, onClose, crop, onSave }) => {
    const [formData, setFormData] = useState({
        name: '', variety: '', isOrganic: false, quantity: '', price: '', district: '', urgency: '', image: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen && crop) {
            const isOrganic = crop.variety.includes('Organic');
            const cleanVariety = crop.variety.replace('Organic', '').trim();
            const locationParts = crop.location.split(',').map(s => s.trim());
            // Assume format "Panchayat, District" or just "District"
            let dist = KERALA_DISTRICTS.find(d => crop.location.includes(d)) || '';
            let pan = locationParts[0] === dist ? '' : locationParts[0];

            setFormData({
                name: crop.name,
                variety: cleanVariety,
                isOrganic: isOrganic,
                quantity: crop.quantity.toString(),
                price: crop.pricePerKg.toString(),
                district: dist,
                urgency: crop.priority || 'NORMAL',
                image: crop.imageUrl
            });
        }
    }, [isOpen, crop]);

    const handleNumChange = (field: string, value: string) => {
        if (value && Number(value) < 0) {
            setFormData(prev => ({...prev, [field]: ''}));
            setErrors(prev => ({...prev, [field]: 'Cannot be negative'}));
        } else {
            setFormData(prev => ({...prev, [field]: value}));
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const handleSave = () => {
        // Validation
        if (!formData.name || !formData.variety || !formData.quantity || !formData.price || !formData.district) {
            return;
        }
        if (Number(formData.quantity) <= 0 || Number(formData.price) <= 0) {
             return;
        }

        const finalVariety = formData.isOrganic ? `Organic ${formData.variety}` : formData.variety;
        const finalLocation = `${formData.district}, Kerala`;

        const updatedCrop: Crop = {
            ...crop,
            name: formData.name,
            variety: finalVariety,
            quantity: Number(formData.quantity),
            pricePerKg: Number(formData.price),
            location: finalLocation,
            priority: formData.urgency as any,
            imageUrl: formData.image
        };

        onSave(updatedCrop);
        setErrors({});
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Editing: ${crop.name}`}>
            <div className="space-y-4">
                {/* Crop Details */}
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Crop Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <Input label="Variety" value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})} />
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100 cursor-pointer" onClick={() => setFormData({...formData, isOrganic: !formData.isOrganic})}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.isOrganic ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300'}`}>
                        {formData.isOrganic && <Check size={14}/>}
                    </div>
                    <span className="text-sm font-medium text-green-900">Certified Organic</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Quantity (kg)" type="number" min="0" value={formData.quantity} onChange={e => handleNumChange('quantity', e.target.value)} error={errors.quantity} />
                    <Input label="Base Price (₹/kg)" type="number" min="0" value={formData.price} onChange={e => handleNumChange('price', e.target.value)} error={errors.price} />
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Location</label>
                    <div className="grid grid-cols-2 gap-4">
                        <select 
                            className="block h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formData.district}
                            onChange={e => setFormData({...formData, district: e.target.value})}
                        >
                            <option value="">Select District</option>
                            {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Urgency</label>
                        <select 
                             className="block h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                             value={formData.urgency}
                             onChange={e => setFormData({...formData, urgency: e.target.value})}
                        >
                            <option value="NORMAL">Normal</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>
                    {/* Image Selector (Simple Row) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Listing Image</label>
                        <div className="flex gap-2">
                            {SAMPLE_IMAGES.slice(0,3).map((img, i) => (
                                <img 
                                    key={i} 
                                    src={img} 
                                    className={`w-10 h-10 rounded-lg object-cover cursor-pointer border-2 ${formData.image === img ? 'border-primary' : 'border-transparent'}`}
                                    onClick={() => setFormData({...formData, image: img})}
                                    alt="sample"
                                />
                            ))}
                            <div className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer bg-gray-50">
                                <Plus size={16}/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts (ReadOnly) */}
                {crop.monitoring.aiRiskScore > 50 && (
                     <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                         <AlertTriangle size={16} className="text-red-500"/>
                         <span className="text-xs text-red-700 font-bold">Active AI Risk Alert: {crop.monitoring.riskLevel}</span>
                     </div>
                )}
                
                <div className="flex gap-3 pt-2">
                    <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1" onClick={handleSave} disabled={!!errors.quantity || !!errors.price || !formData.quantity || !formData.price}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    );
};

// Countdown Timer Component
const PromotionCountdown: React.FC<{ endDate: string }> = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isExpired, setIsExpired] = useState(false);
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const end = new Date(endDate).getTime();
            const now = new Date().getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('Expired');
                setIsExpired(true);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            if (days > 0) {
                setTimeLeft(`Expires in ${days} days`);
                setIsUrgent(false);
            } else {
                setTimeLeft(`Expires in ${hours} hours`);
                setIsUrgent(hours < 4);
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 60000); // Update every minute
        return () => clearInterval(timer);
    }, [endDate]);

    if (isExpired) return <span className="text-xs font-bold text-red-500">Expired</span>;

    return (
        <span className={`text-[10px] md:text-xs font-bold ${isUrgent ? 'text-red-600 animate-pulse' : 'text-yellow-700'}`}>
            <Clock size={10} className="inline mr-1 mb-0.5" />
            {timeLeft}
        </span>
    );
};

const MyListingsTab = () => {
    const { crops, addCrop, deleteCrop, updateCrop, promoteCrop, checkPromotionStatus } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [promoteModalCrop, setPromoteModalCrop] = useState<Crop | null>(null);
    const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [newCrop, setNewCrop] = useState<Partial<Crop>>({
        name: '', variety: '', quantity: 0, pricePerKg: 0, location: 'Wayanad'
    });

    // Check expiry on mount
    useEffect(() => {
        checkPromotionStatus();
        const interval = setInterval(checkPromotionStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [checkPromotionStatus]);

    // Sorting Logic
    const sortedCrops = useMemo(() => {
        return [...crops].sort((a, b) => {
            const aActive = a.promoted?.active || a.isPromoted;
            const bActive = b.promoted?.active || b.isPromoted;

            if (aActive && !bActive) return -1;
            if (!aActive && bActive) return 1;

            if (aActive && bActive) {
                // Both promoted, sort by expiry (earliest first)
                // If no promoted object (legacy), treat as far future
                const aEnd = a.promoted?.endDate ? new Date(a.promoted.endDate).getTime() : Number.MAX_SAFE_INTEGER;
                const bEnd = b.promoted?.endDate ? new Date(b.promoted.endDate).getTime() : Number.MAX_SAFE_INTEGER;
                return aEnd - bEnd;
            }
            return 0; // Maintain original order for non-promoted
        });
    }, [crops]);

    const handleNumChange = (field: keyof Crop, value: string) => {
        if (value && Number(value) < 0) {
            setNewCrop(prev => ({...prev, [field]: 0}));
            setErrors(prev => ({...prev, [field]: 'Cannot be negative'}));
        } else {
            setNewCrop(prev => ({...prev, [field]: Number(value)}));
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const handleAddCrop = () => {
        if (!newCrop.quantity || !newCrop.pricePerKg || newCrop.quantity <= 0 || newCrop.pricePerKg <= 0) return;
        addCrop({
            id: Math.random().toString(),
            name: newCrop.name || 'New Crop',
            variety: newCrop.variety || 'Standard',
            location: newCrop.location || 'Kerala',
            farmerName: 'John Doe',
            farmerRating: 5,
            storageUnitId: 'N/A',
            quantity: Number(newCrop.quantity),
            harvestDate: new Date().toLocaleDateString(),
            imageUrl: 'https://images.unsplash.com/photo-1595855709920-45386758dd8d?q=80&w=500&auto=format&fit=crop',
            isPromoted: false,
            pricePerKg: Number(newCrop.pricePerKg),
            visibilityScore: 50,
            views: 0,
            inquiries: 0,
            priority: 'NORMAL',
            monitoring: { temperature: 25, humidity: 60, aiRiskScore: 10, riskLevel: RiskLevel.LOW, recommendation: 'Newly added.' }
        } as Crop);
        setIsModalOpen(false);
        setNewCrop({ name: '', variety: '', quantity: 0, pricePerKg: 0, location: 'Wayanad' });
        setErrors({});
    };

    const handlePromoteConfirm = (plan: PromotionPlan) => {
        if (promoteModalCrop) {
            promoteCrop(promoteModalCrop.id, plan);
        }
    };

    const handleSaveEdit = (updated: Crop) => {
        updateCrop(updated);
        setEditingCrop(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Your Crop Listings</h3>
                <Button size="sm" onClick={() => setIsModalOpen(true)}><Plus size={16} className="mr-2"/> Add Listing</Button>
            </div>
            <div className="space-y-4">
                {sortedCrops.map(crop => {
                    const isPromotedActive = crop.promoted?.active || (crop.isPromoted && !crop.promoted); // Handle legacy
                    return (
                    <Card key={crop.id} className={`p-4 flex flex-col md:flex-row gap-4 items-center transition-all ${isPromotedActive ? 'ring-2 ring-yellow-400 ring-offset-2 bg-yellow-50/10' : ''}`}>
                        <div className="relative shrink-0">
                            <img src={crop.imageUrl} className="w-24 h-24 rounded-lg object-cover" alt={crop.name}/>
                            {isPromotedActive && (
                                <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                    <Crown size={10} fill="currentColor"/> PROMOTED
                                </div>
                            )}
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h4 className="font-bold text-lg text-gray-900">{crop.name}</h4>
                                        {crop.priority === 'URGENT' && <Badge variant="danger" className="text-[10px]">URGENT</Badge>}
                                    </div>
                                    <p className="text-sm text-gray-500">{crop.variety} • {crop.quantity} kg available</p>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10}/> {crop.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary">₹{crop.pricePerKg}</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 justify-end"><Eye size={12}/> {crop.views} views</div>
                                    {isPromotedActive && crop.promoted?.endDate && (
                                        <div className="mt-1">
                                            <PromotionCountdown endDate={crop.promoted.endDate} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {crop.monitoring.aiRiskScore > 40 && (
                                <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                                    <AlertCircle size={12}/> AI Recommendation: {crop.monitoring.recommendation}
                                </p>
                            )}

                            <div className="flex gap-2 mt-4">
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className={`flex-1 border-gray-200 ${isPromotedActive ? 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border-yellow-200' : 'text-gray-600'}`} 
                                    onClick={() => setPromoteModalCrop(crop)}
                                >
                                    {isPromotedActive ? 'Renew Promotion' : 'Promote'}
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 border-gray-200 text-gray-600" onClick={() => setEditingCrop(crop)}>Edit</Button>
                                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => deleteCrop(crop.id)}><Trash2 size={16}/></Button>
                            </div>
                        </div>
                    </Card>
                )})}
            </div>

            {/* Add Listing Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Crop Listing">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Crop Name" placeholder="e.g. Ginger" value={newCrop.name} onChange={e => setNewCrop({...newCrop, name: e.target.value})} />
                        <Input label="Variety" placeholder="e.g. Wayanad Local" value={newCrop.variety} onChange={e => setNewCrop({...newCrop, variety: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Quantity (kg)" type="number" min="0" value={newCrop.quantity ? newCrop.quantity.toString() : ''} onChange={e => handleNumChange('quantity', e.target.value)} error={errors.quantity} />
                        <Input label="Price per kg (₹)" type="number" min="0" value={newCrop.pricePerKg ? newCrop.pricePerKg.toString() : ''} onChange={e => handleNumChange('pricePerKg', e.target.value)} error={errors.pricePerKg} />
                    </div>
                    <Input label="Location" value={newCrop.location} onChange={e => setNewCrop({...newCrop, location: e.target.value})} />
                    <Button className="w-full" onClick={handleAddCrop} disabled={!!errors.quantity || !!errors.pricePerKg || !newCrop.quantity || !newCrop.pricePerKg}>Create Listing</Button>
                </div>
            </Modal>

            {/* Promote Modal */}
            {promoteModalCrop && (
                <PromoteModal 
                    isOpen={!!promoteModalCrop}
                    onClose={() => setPromoteModalCrop(null)}
                    crop={promoteModalCrop}
                    onConfirm={handlePromoteConfirm}
                />
            )}

            {/* Edit Crop Modal */}
            {editingCrop && (
                <EditListingModal 
                    isOpen={!!editingCrop} 
                    onClose={() => setEditingCrop(null)} 
                    crop={editingCrop} 
                    onSave={handleSaveEdit} 
                />
            )}
        </div>
    );
};

// ... RetailerRequestsTab, NegotiationsTab, MarketTrendsTab, CommunityView, ForumTab ... 
const RetailerRequestsTab = () => {
    const { retailerRequests, rejectRetailerRequest, convertRequestToOffer } = useStore();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {retailerRequests.filter(r => r.status === 'Open').map(req => (
                 <Card key={req.id} className="p-5">
                    <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-gray-900">{req.cropName}</h3>
                         <Badge variant={req.urgency === 'High' ? 'danger' : req.urgency === 'Medium' ? 'warning' : 'neutral'}>{req.urgency}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Requested by <span className="font-semibold text-gray-900">{req.retailerName}</span> <span className="text-xs bg-gray-100 px-1 rounded">★{req.retailerRating}</span></p>
                    <div className="flex gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><MapPin size={12}/> {req.location}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> Due {req.deadline}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-4 border border-gray-100">
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold">Qty: {req.quantityNeeded} kg</span>
                            <span className="font-semibold text-green-700">Max: ₹{req.maxPrice}/kg</span>
                        </div>
                        <p className="text-xs text-gray-500 italic">"{req.message}"</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" onClick={() => rejectRetailerRequest(req.id)}>Reject</Button>
                        <Button size="sm" className="flex-[2]" onClick={() => {
                             convertRequestToOffer(req.id, {
                                 id: Math.random().toString(),
                                 retailerName: req.retailerName,
                                 retailerId: 'ret-new',
                                 cropName: req.cropName,
                                 cropId: 'crop-new',
                                 date: new Date().toLocaleDateString(),
                                 offeredPrice: req.maxPrice,
                                 quantity: req.quantityNeeded,
                                 retailerMessage: "Offer sent based on request.",
                                 history: [],
                                 status: 'Pending'
                             });
                             alert("Proposal sent to retailer!");
                        }}><Send size={14} className="mr-2"/> Send Proposal</Button>
                    </div>
                 </Card>
             ))}
             {retailerRequests.filter(r => r.status === 'Open').length === 0 && <p className="text-gray-500 text-center py-8">No open requests at the moment.</p>}
        </div>
    )
};

const NegotiationsTab = () => {
    const { negotiations, updateNegotiation, acceptNegotiation } = useStore();
    const [selectedNegotiationId, setSelectedNegotiationId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');
    const [counterPrice, setCounterPrice] = useState('');

    // Reactive Negotiation Object
    const selectedNegotiation = useMemo(() => 
        negotiations.find(n => n.id === selectedNegotiationId) || null
    , [negotiations, selectedNegotiationId]);

    const handleSendMessage = () => {
        if (!selectedNegotiation || (!messageText && !counterPrice)) return;
        const newMessage: Message = {
            id: Math.random().toString(),
            sender: 'Farmer',
            content: messageText || `Counter offer: ₹${counterPrice}`,
            timestamp: 'Just now'
        };
        updateNegotiation(selectedNegotiation.id, newMessage, counterPrice ? Number(counterPrice) : undefined);
        setMessageText('');
        setCounterPrice('');
    };

    return (
        <div className="space-y-4">
            {/* List View */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Retailer</th>
                                <th className="px-6 py-3">Crop</th>
                                <th className="px-6 py-3">Price/Kg</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {negotiations.map(neg => (
                                <tr key={neg.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelectedNegotiationId(neg.id)}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{neg.retailerName}</td>
                                    <td className="px-6 py-4 text-gray-600">{neg.cropName} ({neg.quantity}kg)</td>
                                    <td className="px-6 py-4 font-bold">₹{neg.offeredPrice}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={neg.status === 'Accepted' ? 'success' : neg.status === 'Rejected' ? 'danger' : 'warning'}>{neg.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button size="sm" variant="ghost" className="text-primary hover:bg-green-50">View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            <Modal isOpen={!!selectedNegotiation} onClose={() => setSelectedNegotiationId(null)} title={`Negotiation: ${selectedNegotiation?.cropName}`}>
                <div className="h-[500px] flex flex-col">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Current Offer</p>
                            <p className="text-2xl font-bold text-primary">₹{selectedNegotiation?.offeredPrice} <span className="text-sm text-gray-400 font-normal">/ kg</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-bold">Quantity</p>
                            <p className="text-lg font-medium text-gray-900">{selectedNegotiation?.quantity} kg</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 p-2 mb-4 border border-gray-100 rounded-xl bg-white">
                        {selectedNegotiation?.history.length === 0 && <p className="text-center text-gray-400 text-xs py-4">No messages yet.</p>}
                        {selectedNegotiation?.history.map(msg => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'Farmer' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-3 py-2 rounded-xl max-w-[80%] text-sm ${msg.sender === 'Farmer' ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1">{msg.timestamp}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 pt-2 border-t border-gray-100">
                        {selectedNegotiation?.status === 'Negotiating' || selectedNegotiation?.status === 'Pending' ? (
                            <>
                                <div className="flex gap-2">
                                    <Input placeholder="Type a message..." value={messageText} onChange={e => setMessageText(e.target.value)} className="flex-1"/>
                                    <Input 
                                        placeholder="₹ New Price" 
                                        type="number" 
                                        min="0"
                                        value={counterPrice} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val && Number(val) < 0) {
                                                setCounterPrice('');
                                            } else {
                                                setCounterPrice(val);
                                            }
                                        }}
                                        className="w-24"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" className="flex-1" onClick={() => handleSendMessage()}>Send Reply</Button>
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => { acceptNegotiation(selectedNegotiation!.id); setSelectedNegotiationId(null); }}>Accept Deal</Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-3 bg-gray-50 rounded-lg text-sm font-bold text-gray-500">
                                This negotiation is {selectedNegotiation?.status}.
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    )
};

const MarketTrendsTab = () => {
    const trendData = [
        { name: 'Week 1', banana: 40, pepper: 420 },
        { name: 'Week 2', banana: 42, pepper: 430 },
        { name: 'Week 3', banana: 38, pepper: 425 },
        { name: 'Week 4', banana: 45, pepper: 440 },
        { name: 'Week 5', banana: 48, pepper: 450 },
        { name: 'Week 6', banana: 46, pepper: 445 },
    ];

    const districtData = [
        { name: 'Wayanad', price: 45 },
        { name: 'Idukki', price: 42 },
        { name: 'Kottayam', price: 40 },
        { name: 'Palakkad', price: 38 },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-primary"/> Price Trends (Last 6 Weeks)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="banana" stroke="#EAB308" strokeWidth={3} name="Banana (₹/kg)" />
                                <Line type="monotone" dataKey="pepper" stroke="#1F2937" strokeWidth={3} name="Pepper (₹/kg)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                <Card className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">District-wise Average Price (Banana)</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={districtData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" fontSize={12} hide />
                                <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="price" fill="#2F9D3C" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Brain size={24}/></div>
                        <h3 className="font-bold text-blue-900">AI Market Advice</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                            <p className="text-xs font-bold text-blue-500 uppercase mb-1">Sell Recommendation</p>
                            <p className="text-sm font-medium text-gray-800">Nendran Banana prices are peaking. Sell 60% of stock this week.</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                            <p className="text-xs font-bold text-blue-500 uppercase mb-1">Hold Recommendation</p>
                            <p className="text-sm font-medium text-gray-800">Hold Black Pepper. Expected rise of 5-8% next month due to export demand.</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Top Demanded Crops</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Nendran Banana', change: '+12%', trend: 'up' },
                            { name: 'Cardamom', change: '-2%', trend: 'down' },
                            { name: 'Ginger', change: '+5%', trend: 'up' },
                            { name: 'Tapioca', change: '0%', trend: 'neutral' }
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${item.trend === 'up' ? 'bg-green-100 text-green-700' : item.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {item.change}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CommunityView = () => {
    const [subTab, setSubTab] = useState<'FORUM' | 'EXPERTS' | 'BARTER'>('FORUM');
    return (
        <div className="space-y-6">
             <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                <button onClick={() => setSubTab('FORUM')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${subTab === 'FORUM' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Community Forum</button>
                <button onClick={() => setSubTab('EXPERTS')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${subTab === 'EXPERTS' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Expert Advice</button>
                <button onClick={() => setSubTab('BARTER')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${subTab === 'BARTER' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Barter System</button>
            </div>
            {subTab === 'FORUM' && <ForumTab />}
            {subTab === 'EXPERTS' && <ExpertsTab />}
            {subTab === 'BARTER' && <BarterSystemTab />}
        </div>
    );
};

const ForumTab = () => {
    const { posts, togglePostLike, addPostComment, createPost, deletePost } = useStore();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', tags: '', location: 'Wayanad' });
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const filters = ['All', 'Crops', 'Weather', 'Disease', 'Equipment'];

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = activeFilter === 'All' 
                ? true 
                : activeFilter === 'Crops'
                    ? ['Cardamom', 'Banana', 'Pepper', 'Ginger', 'Coconut', 'Arecanut', 'Paddy', 'Tapioca'].some(crop => post.tags.includes(crop))
                    : post.tags.includes(activeFilter);
            return matchesSearch && matchesFilter;
        });
    }, [posts, search, activeFilter]);

    const handleCreatePost = () => {
        if (!newPost.title || !newPost.content) return;
        createPost({
            id: Math.random().toString(),
            author: 'John Doe',
            role: 'Farmer',
            location: newPost.location,
            title: newPost.title,
            content: newPost.content,
            tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t),
            likes: 0,
            commentsCount: 0,
            commentsList: [],
            timeAgo: 'Just now',
            isOwner: true,
            isLiked: false
        });
        setIsCreateModalOpen(false);
        setNewPost({ title: '', content: '', tags: '', location: 'Wayanad' });
    };

    const handleAddComment = (postId: string) => {
        if(!commentText.trim()) return;
        addPostComment(postId, {
            id: Math.random().toString(),
            author: 'John Doe',
            role: 'Farmer',
            content: commentText,
            timestamp: 'Just now'
        });
        setCommentText('');
    };

    return (
        <div className="space-y-6 relative">
            <div className="sticky top-0 z-10 bg-neutral pt-2 pb-4 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <Input className="pl-10 bg-white shadow-sm" placeholder="Search discussions..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {filters.map(f => (
                        <FilterPill key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredPosts.map(post => (
                    <Card key={post.id} className="p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shrink-0">
                                    {post.author[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{post.author} <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${post.role === 'Expert' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{post.role}</span></p>
                                    <p className="text-xs font-medium text-gray-500">{post.timeAgo} • {post.location}</p>
                                </div>
                            </div>
                            {post.isOwner && (
                                <button onClick={() => deletePost(post.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                            )}
                        </div>
                        
                        <h4 className="font-bold text-lg mb-2 text-gray-900">{post.title}</h4>
                        <p className="text-gray-800 mb-4 leading-relaxed text-sm">{post.content}</p>
                        
                        {post.imageUrl && <img src={post.imageUrl} alt="Post" className="rounded-xl mb-4 max-h-64 object-cover w-full border border-gray-100"/>}
                        
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {post.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full font-medium">#{tag}</span>)}
                        </div>
                        
                        <div className="flex items-center gap-6 text-gray-600 font-medium text-sm border-t border-gray-100 pt-3">
                            <button onClick={() => togglePostLike(post.id)} className={`flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded transition-colors ${post.isLiked ? 'text-primary font-bold' : ''}`}>
                                <ThumbsUp size={18} className={post.isLiked ? 'fill-current' : ''}/> {post.likes}
                            </button>
                            <button onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)} className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                                <MessageSquare size={18}/> {post.commentsCount}
                            </button>
                        </div>

                        {/* Comments Section */}
                        <AnimatePresence>
                            {expandedPostId === post.id && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                                        {post.commentsList.map(comment => (
                                            <div key={comment.id} className="flex gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                                                <div className="font-bold text-gray-900 shrink-0">{comment.author}</div>
                                                <div className="flex-1">
                                                    <p className="text-gray-700">{comment.content}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{comment.timestamp}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex gap-2 mt-2">
                                            <Input placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} className="h-10 text-sm"/>
                                            <Button size="sm" onClick={() => handleAddComment(post.id)} disabled={!commentText.trim()}><Send size={16}/></Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                ))}
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8">
                <button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primaryDark text-white h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105">
                    <Plus size={28} />
                </button>
            </div>

            {/* Create Post Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Post">
                <div className="space-y-4">
                    <Input label="Title" placeholder="e.g. Disease in pepper plants" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content</label>
                        <textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900" rows={4} placeholder="Describe your issue or share your experience..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})}></textarea>
                    </div>
                    <Input label="Tags (comma separated)" placeholder="e.g. Disease, Pepper, Urgent" value={newPost.tags} onChange={e => setNewPost({...newPost, tags: e.target.value})} />
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                        <ImageIcon size={24} className="mb-2"/>
                        <span className="text-xs">Click to upload image (optional)</span>
                    </div>
                    <Button className="w-full" onClick={handleCreatePost}>Post to Community</Button>
                </div>
            </Modal>
        </div>
    );
};

// ... ExpertsTab and BarterSystemTab are reused from previous logic ...
// (Omitting full repetition of unchanged Expert/Barter components as requested by diff logic, but ensuring they are here for completeness if needed)

// Re-including ExpertsTab and BarterSystemTab to satisfy "FULL content" requirement
const ExpertsTab = () => {
    const { expertQuestions, askExpertQuestion, sendExpertMessage, resolveExpertQuestion, rateExpertSession } = useStore();
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    
    // Filters
    const [filter, setFilter] = useState<'ACTIVE' | 'RESOLVED'>('ACTIVE');
    const [search, setSearch] = useState('');

    // Chat State
    const [chatInput, setChatInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Derived Data
    const activeQuestion = expertQuestions.find(q => q.id === selectedQuestionId);
    
    const filteredQuestions = expertQuestions.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) || q.crop.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filter === 'ACTIVE' ? q.status !== 'RESOLVED' : q.status === 'RESOLVED';
        return matchesSearch && matchesStatus;
    });

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [activeQuestion?.history]);

    // Handlers
    const handleSendMessage = (msg?: string, attachment?: string) => {
        if (!selectedQuestionId) return;
        const text = msg || chatInput;
        if (text.trim() || attachment) {
            sendExpertMessage(selectedQuestionId, text, attachment);
            setChatInput('');
        }
    };

    const handleFileUpload = () => {
        // Simulate file upload
        const mockImage = "https://images.unsplash.com/photo-1591857177580-dc82b9e4e11c?q=80&w=500&auto=format&fit=crop"; // Leaf disease image
        handleSendMessage("Here is a photo of the affected area.", mockImage);
    };

    const handleNewQuestion = (data: any) => {
        const newId = Math.random().toString();
        askExpertQuestion({
            id: newId,
            farmerName: 'John Doe',
            crop: data.crop,
            title: data.title,
            description: data.desc,
            status: 'OPEN',
            date: 'Just now',
            history: [{
                id: Math.random().toString(),
                sender: 'Farmer',
                content: data.desc,
                timestamp: 'Just now',
                type: data.image ? 'image' : 'text',
                attachmentUrl: data.image,
                isRead: true
            }]
        });
        setIsAskModalOpen(false);
        setSelectedQuestionId(newId); // Open chat immediately
    };

    // Close chat when pressing Back on mobile
    const handleBack = () => setSelectedQuestionId(null);

    return (
        <div className="h-[calc(100vh-200px)] min-h-[500px] flex flex-col md:flex-row gap-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             
             {/* LEFT PANEL: LIST */}
             <div className={`w-full md:w-1/3 flex flex-col border-r border-gray-100 ${selectedQuestionId ? 'hidden md:flex' : 'flex'}`}>
                 <div className="p-4 border-b border-gray-100 bg-gray-50">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-gray-900">My Consultations</h3>
                         <Button size="sm" onClick={() => setIsAskModalOpen(true)}><Plus size={16}/> Ask Expert</Button>
                     </div>
                     <div className="relative mb-3">
                         <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                         <input 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                            placeholder="Search questions..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                         />
                     </div>
                     <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                         <button onClick={() => setFilter('ACTIVE')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'ACTIVE' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>Active</button>
                         <button onClick={() => setFilter('RESOLVED')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'RESOLVED' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>Resolved</button>
                     </div>
                 </div>

                 <div className="flex-1 overflow-y-auto">
                     {filteredQuestions.length === 0 && (
                         <div className="p-8 text-center text-gray-400 text-sm">No {filter.toLowerCase()} questions found.</div>
                     )}
                     {filteredQuestions.map(q => (
                         <div 
                            key={q.id} 
                            onClick={() => setSelectedQuestionId(q.id)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-blue-50/50 transition-colors ${selectedQuestionId === q.id ? 'bg-blue-50 border-l-4 border-l-primary' : ''}`}
                         >
                             <div className="flex justify-between items-start mb-1">
                                 <Badge variant="neutral" className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600">{q.crop}</Badge>
                                 <span className="text-[10px] text-gray-400">{q.date}</span>
                             </div>
                             <h4 className={`text-sm truncate mb-1 ${q.unreadCount ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{q.title}</h4>
                             <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">{q.history[q.history.length-1]?.content || q.description}</p>
                                {q.unreadCount && q.unreadCount > 0 ? (
                                    <span className="bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">{q.unreadCount}</span>
                                ) : null}
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             {/* RIGHT PANEL: CHAT */}
             <div className={`w-full md:w-2/3 flex flex-col bg-white relative ${!selectedQuestionId ? 'hidden md:flex' : 'flex'}`}>
                 {activeQuestion ? (
                     <>
                        {/* Header */}
                        <div className="p-3 border-b border-gray-100 flex justify-between items-center shadow-sm z-10 bg-white">
                            <div className="flex items-center gap-2">
                                <button onClick={handleBack} className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base flex items-center gap-2">
                                        {activeQuestion.title}
                                        {activeQuestion.status === 'RESOLVED' && <CheckCircle size={16} className="text-green-500"/>}
                                    </h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        {activeQuestion.status === 'IN_PROGRESS' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                                        {activeQuestion.status === 'OPEN' ? 'Waiting for expert...' : activeQuestion.status === 'RESOLVED' ? 'Resolved' : 'Expert Active'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Actions (Demo: Allow farmer to force resolve to test rating) */}
                            {activeQuestion.status !== 'RESOLVED' && (
                                <Button size="sm" variant="ghost" className="text-xs text-green-600 hover:bg-green-50" onClick={() => resolveExpertQuestion(activeQuestion.id)}>
                                    <Check size={14} className="mr-1"/> Mark Resolved
                                </Button>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-neutral/30 space-y-4" ref={scrollRef}>
                            {activeQuestion.history.map((msg, i) => (
                                <ChatBubble key={i} msg={msg} />
                            ))}
                            
                            {activeQuestion.status === 'RESOLVED' && (
                                <div className="mt-8 mb-4">
                                    <div className="mx-auto max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                                            <CheckCircle size={24}/>
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">Issue Resolved</h4>
                                        <p className="text-xs text-gray-500 mb-4">This thread is now closed.</p>
                                        {!activeQuestion.rating ? (
                                            <Button size="sm" onClick={() => setIsRatingModalOpen(true)}>Rate Expert</Button>
                                        ) : (
                                            <div className="flex justify-center gap-1 text-yellow-400">
                                                {[...Array(activeQuestion.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor"/>)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        {activeQuestion.status !== 'RESOLVED' && (
                            <div className="p-3 bg-white border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <button onClick={handleFileUpload} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                        <Paperclip size={20}/>
                                    </button>
                                    <input 
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900"
                                        placeholder="Type your message..."
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button 
                                        onClick={() => handleSendMessage()}
                                        disabled={!chatInput.trim()}
                                        className="p-2 bg-primary text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:bg-primaryDark transition-colors shadow-md"
                                    >
                                        <Send size={18} className="ml-0.5"/>
                                    </button>
                                </div>
                            </div>
                        )}
                     </>
                 ) : (
                     <div className="flex flex-col items-center justify-center h-full text-gray-400">
                         <MessageSquare size={48} className="mb-4 opacity-20"/>
                         <p className="font-medium text-sm">Select a question to view details</p>
                     </div>
                 )}
             </div>

             {/* Modals */}
             <AskExpertModal 
                isOpen={isAskModalOpen} 
                onClose={() => setIsAskModalOpen(false)} 
                onSubmit={handleNewQuestion}
             />
             
             {isRatingModalOpen && (
                 <RatingModal 
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    onSubmit={(rating, feedback) => {
                        if(selectedQuestionId) rateExpertSession(selectedQuestionId, rating, feedback);
                        setIsRatingModalOpen(false);
                    }}
                 />
             )}
        </div>
    );
};

// ... ChatBubble, RatingModal, BarterSystemTab ...
const ChatBubble: React.FC<{ msg: Message }> = ({ msg }) => {
    const isFarmer = msg.sender === 'Farmer';
    const isSystem = msg.type === 'system' || msg.sender === 'System';
    
    if (isSystem) {
        return (
            <div className="flex justify-center my-3">
                <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium border border-gray-200">
                    {msg.content}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${isFarmer ? 'items-end' : 'items-start'} mb-3`}>
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                isFarmer 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
            }`}>
                {msg.type === 'image' && msg.attachmentUrl && (
                    <img src={msg.attachmentUrl} alt="attachment" className="rounded-lg mb-2 max-h-40 object-cover border border-black/10 bg-white" />
                )}
                {msg.content}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1">
                {msg.timestamp} {isFarmer && '• Read'}
            </span>
        </div>
    );
};

const RatingModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (rating: number, feedback: string) => void }> = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Rate Expert">
            <div className="space-y-6 text-center">
                <p className="text-sm text-gray-600">How helpful was the expert's advice?</p>
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                            <Star size={32} className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                    ))}
                </div>
                <textarea 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    rows={3}
                    placeholder="Any additional feedback..."
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                />
                <Button className="w-full" onClick={() => onSubmit(rating, feedback)} disabled={rating === 0}>Submit Feedback</Button>
            </div>
        </Modal>
    );
};

const BarterSystemTab = () => {
    const { barterListings, barterRequests, credits, requestBarterService, addBarterListing, acceptBarterService, completeBarterService, rateBarterService, raiseDispute, resolveDispute } = useStore();
    const [view, setView] = useState<'BROWSE' | 'REQUESTS'>('BROWSE');
    const [search, setSearch] = useState('');
    const [districtFilter, setDistrictFilter] = useState('All Districts');
    
    // Modals State
    const [selectedListing, setSelectedListing] = useState<BarterListing | null>(null);
    const [isListingModalOpen, setIsListingModalOpen] = useState(false);
    const [newListing, setNewListing] = useState({ type: '', desc: '', cost: '', district: '' });
    
    const [confirmAction, setConfirmAction] = useState<{type: 'ACCEPT' | 'COMPLETE', id: string} | null>(null);
    const [ratingModal, setRatingModal] = useState<{id: string, providerName: string} | null>(null);
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');
    
    const [disputeModal, setDisputeModal] = useState<{id: string} | null>(null);
    const [disputeReason, setDisputeReason] = useState('');

    // Filter listings
    const filteredListings = useMemo(() => {
        return barterListings.filter(l => {
            const matchesSearch = l.description.toLowerCase().includes(search.toLowerCase()) || l.serviceType.toLowerCase().includes(search.toLowerCase());
            const matchesDistrict = districtFilter === 'All Districts' || l.district === districtFilter;
            return matchesSearch && matchesDistrict;
        });
    }, [barterListings, search, districtFilter]);

    const handleRequestService = () => {
        if (!selectedListing) return;
        const success = requestBarterService(selectedListing);
        if (success) {
            alert("Service requested successfully! Credits deducted.");
            setSelectedListing(null);
        } else {
            alert("Insufficient credits to request this service.");
        }
    };

    const handleAddListing = () => {
        if(!newListing.type || !newListing.cost) return;
        addBarterListing({
            id: Math.random().toString(),
            providerName: 'Soman P', // Hardcoded as current user for demo
            providerId: 'curr-user',
            serviceType: newListing.type,
            description: newListing.desc,
            district: newListing.district,
            creditCost: Number(newListing.cost),
            status: 'AVAILABLE',
            date: 'Just now',
            providerRating: 5,
            reviewsCount: 0
        });
        setIsListingModalOpen(false);
        setNewListing({ type: '', desc: '', cost: '', district: '' });
    };

    const handleConfirmAction = () => {
        if (!confirmAction) return;
        if (confirmAction.type === 'ACCEPT') {
            acceptBarterService(confirmAction.id);
        } else {
            completeBarterService(confirmAction.id);
        }
        setConfirmAction(null);
    };

    const handleSubmitRating = () => {
        if (ratingModal) {
            rateBarterService(ratingModal.id, rating, feedback);
            setRatingModal(null);
            setRating(5);
            setFeedback('');
        }
    };

    const handleSubmitDispute = () => {
        if (disputeModal && disputeReason) {
            raiseDispute(disputeModal.id, disputeReason);
            setDisputeModal(null);
            setDisputeReason('');
        }
    };

    // Categorize Requests
    const myOutgoingRequests = barterRequests.filter(r => r.requesterId === 'curr-user');
    const myIncomingRequests = barterRequests.filter(r => r.providerId === 'curr-user');

    return (
        <div className="space-y-6">
            {/* Credit Widget */}
            <div className="bg-gradient-to-r from-primary to-green-700 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
                <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Available Credits</p>
                    <h3 className="text-4xl font-bold flex items-center gap-2"><Coins size={32} className="text-yellow-300" /> {credits}</h3>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white border-none" onClick={() => setView(view === 'BROWSE' ? 'REQUESTS' : 'BROWSE')}>
                        {view === 'BROWSE' ? 'My Requests' : 'Browse Services'}
                    </Button>
                    <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white border-none" onClick={() => setIsListingModalOpen(true)}>
                        <Plus size={18} className="mr-2" /> Offer Service
                    </Button>
                </div>
            </div>

            {view === 'BROWSE' ? (
                <>
                    {/* Search Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <Input className="pl-10 text-gray-900" placeholder="Find tractors, labor, transport..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-primary min-w-[200px] text-gray-900" value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}>
                            <option>All Districts</option>
                            {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    {/* Service Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredListings.map(listing => (
                            <Card key={listing.id} className="p-5 flex flex-col h-full hover:shadow-md transition-all cursor-pointer group relative" onClick={() => setSelectedListing(listing)}>
                                {listing.providerId === 'curr-user' && (
                                    <div className="absolute top-2 right-2 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">Your Listing</div>
                                )}
                                <div className="flex justify-between items-start mb-4 mt-2">
                                    <Badge variant="neutral" className="bg-blue-50 text-blue-700 border-blue-100 group-hover:bg-blue-100 transition-colors">{listing.serviceType}</Badge>
                                    <span className="flex items-center gap-1 font-bold text-yellow-600 text-sm"><Coins size={14}/> {listing.creditCost}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{listing.description}</h3>
                                <div className="mt-auto space-y-4">
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <p className="flex items-center gap-2"><User size={14}/> {listing.providerName}</p>
                                            {listing.providerRating && (
                                                <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                    <Star size={10} fill="currentColor"/> {listing.providerRating}
                                                </span>
                                            )}
                                        </div>
                                        <p className="flex items-center gap-2"><MapPin size={14}/> {listing.district}</p>
                                    </div>
                                    <Button className="w-full" size="sm" disabled={listing.status !== 'AVAILABLE' || listing.providerId === 'curr-user'}>
                                        {listing.providerId === 'curr-user' ? 'Manage' : listing.status === 'AVAILABLE' ? 'Request' : 'Busy'}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Outgoing Requests */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><ArrowRight size={18} className="text-blue-500"/> Outgoing Requests</h3>
                        {myOutgoingRequests.length === 0 && <p className="text-gray-500 text-sm">No active requests made.</p>}
                        {myOutgoingRequests.map(req => (
                            <Card key={req.id} className="p-4 border-l-4 border-l-blue-500">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{req.serviceType}</h4>
                                        <p className="text-xs text-gray-500">Provider: {req.providerName}</p>
                                    </div>
                                    <Badge variant={req.status === 'COMPLETED' ? 'success' : req.status === 'ACCEPTED' ? 'info' : req.status === 'DISPUTED' ? 'danger' : req.status === 'REFUNDED' ? 'neutral' : 'warning'}>
                                        {req.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-xs text-gray-400">{req.requestDate}</span>
                                    <span className="text-sm font-bold text-yellow-600 flex items-center gap-1"><Coins size={14}/> -{req.creditCost}</span>
                                </div>
                                
                                {req.status === 'COMPLETED' && !req.rating && !req.disputeReason && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                                        <Button size="sm" className="flex-1 text-xs" onClick={() => setRatingModal({id: req.id, providerName: req.providerName})}>Rate Service</Button>
                                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 text-xs" onClick={() => setDisputeModal({id: req.id})}>Raise Dispute</Button>
                                    </div>
                                )}
                                
                                {req.status === 'DISPUTED' && (
                                    <div className="mt-2 bg-red-50 p-2 rounded text-xs text-red-700">
                                        <strong>Dispute Open:</strong> Admin is reviewing. Credits frozen.
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>

                    {/* Incoming Requests */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><CheckCircle size={18} className="text-green-500"/> Incoming Requests</h3>
                        {myIncomingRequests.length === 0 && <p className="text-gray-500 text-sm">No incoming requests.</p>}
                        {myIncomingRequests.map(req => (
                            <Card key={req.id} className="p-4 border-l-4 border-l-green-500">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{req.serviceType}</h4>
                                        <p className="text-xs text-gray-500">Requester: {req.requesterName}</p>
                                    </div>
                                    <Badge variant={req.status === 'COMPLETED' ? 'success' : req.status === 'ACCEPTED' ? 'info' : 'warning'}>{req.status}</Badge>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm font-bold text-green-600 flex items-center gap-1"><Coins size={14}/> +{req.creditCost}</span>
                                    <div className="flex gap-2">
                                        {req.status === 'REQUESTED' && (
                                            <Button size="sm" onClick={() => setConfirmAction({type: 'ACCEPT', id: req.id})}>Accept</Button>
                                        )}
                                        {req.status === 'ACCEPTED' && (
                                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => setConfirmAction({type: 'COMPLETE', id: req.id})}>Mark Complete</Button>
                                        )}
                                    </div>
                                </div>
                                {req.status === 'DISPUTED' && (
                                    <div className="mt-3 p-3 bg-red-50 rounded border border-red-100">
                                        <p className="text-xs font-bold text-red-800 mb-2 flex items-center gap-1"><AlertOctagon size={12}/> Dispute Raised</p>
                                        <p className="text-xs text-red-600 italic mb-2">"{req.disputeReason}"</p>
                                        {/* Admin Stub */}
                                        <div className="flex gap-2">
                                            <button onClick={() => resolveDispute(req.id, 'RELEASE')} className="bg-green-600 text-white text-[10px] px-2 py-1 rounded">Release Credits (Admin)</button>
                                            <button onClick={() => resolveDispute(req.id, 'REFUND')} className="bg-gray-600 text-white text-[10px] px-2 py-1 rounded">Refund (Admin)</button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Confirmation Modals */}
            <Modal isOpen={!!confirmAction} onClose={() => setConfirmAction(null)} title="Confirm Action">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        {confirmAction?.type === 'ACCEPT' ? 'Are you sure you can fulfill this service request?' : 'Confirm that the service has been fully completed?'}
                    </p>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => setConfirmAction(null)} className="flex-1">Cancel</Button>
                        <Button onClick={handleConfirmAction} className="flex-1">{confirmAction?.type === 'ACCEPT' ? 'Yes, Accept' : 'Yes, Complete'}</Button>
                    </div>
                </div>
            </Modal>

            {/* Rating Modal */}
            <Modal isOpen={!!ratingModal} onClose={() => setRatingModal(null)} title="Rate Service">
                <div className="space-y-4 text-center">
                    <p className="text-sm text-gray-600">How was the service provided by <strong>{ratingModal?.providerName}</strong>?</p>
                    <div className="flex justify-center gap-2 py-2">
                        {[1,2,3,4,5].map(star => (
                            <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                                <Star size={32} className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                            </button>
                        ))}
                    </div>
                    <textarea 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                        placeholder="Leave a short feedback..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={3}
                    />
                    <Button className="w-full" onClick={handleSubmitRating}>Submit Review</Button>
                </div>
            </Modal>

            {/* Dispute Modal */}
            <Modal isOpen={!!disputeModal} onClose={() => setDisputeModal(null)} title="Raise Dispute">
                <div className="space-y-4">
                    <div className="bg-red-50 p-3 rounded-lg text-xs text-red-800 flex items-center gap-2">
                        <AlertOctagon size={16} /> Credits will be frozen until an admin reviews the case.
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Reason for Dispute</label>
                        <textarea 
                            className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                            placeholder="e.g. Service was not performed as described..."
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => setDisputeModal(null)} className="flex-1">Cancel</Button>
                        <Button variant="danger" className="flex-1" onClick={handleSubmitDispute} disabled={!disputeReason}>Submit Dispute</Button>
                    </div>
                </div>
            </Modal>

            {/* Request Confirmation Modal */}
            <Modal isOpen={!!selectedListing} onClose={() => setSelectedListing(null)} title="Confirm Service Request">
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-900">{selectedListing?.serviceType}</h4>
                        <p className="text-sm text-gray-600 mt-1">{selectedListing?.description}</p>
                        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm">
                            <span className="text-gray-500">Provider</span>
                            <span className="font-medium">{selectedListing?.providerName}</span>
                        </div>
                    </div>
                    {selectedListing?.providerId === 'curr-user' ? (
                        <div className="bg-red-50 p-3 rounded-lg text-center text-red-600 text-sm font-bold">
                            You cannot request your own service.
                        </div>
                    ) : (
                        <>
                            <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center">
                                <div className="text-blue-800"><p className="text-xs font-bold uppercase">Credit Cost</p><p className="text-2xl font-bold">{selectedListing?.creditCost}</p></div>
                                <div className="text-right text-blue-800"><p className="text-xs font-bold uppercase">Your Balance</p><p className="text-lg font-medium">{credits}</p></div>
                            </div>
                            {credits < (selectedListing?.creditCost || 0) && <p className="text-red-500 text-sm font-medium text-center">Insufficient credits.</p>}
                        </>
                    )}
                    <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={() => setSelectedListing(null)}>Cancel</Button>
                        <Button className="flex-1" onClick={handleRequestService} disabled={credits < (selectedListing?.creditCost || 0) || selectedListing?.providerId === 'curr-user'}>Confirm Request</Button>
                    </div>
                </div>
            </Modal>

            {/* Create Listing Modal */}
            <Modal isOpen={isListingModalOpen} onClose={() => setIsListingModalOpen(false)} title="Offer a Service">
                <div className="space-y-4">
                    <Input label="Service Type" placeholder="e.g. Tractor Rental" value={newListing.type} onChange={e => setNewListing({...newListing, type: e.target.value})} />
                    <Input label="Description" placeholder="Details about your service..." value={newListing.desc} onChange={e => setNewListing({...newListing, desc: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Credit Cost" type="number" placeholder="e.g. 100" value={newListing.cost} onChange={e => setNewListing({...newListing, cost: e.target.value})} />
                        <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">District</label>
                            <select className="block h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus:ring-primary" value={newListing.district} onChange={e => setNewListing({...newListing, district: e.target.value})}>
                                <option value="" disabled>Select</option>
                                {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                    <Button className="w-full" onClick={handleAddListing}>Post Listing</Button>
                </div>
            </Modal>
        </div>
    );
};
