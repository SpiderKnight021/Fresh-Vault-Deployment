
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Card, Button, Badge, Modal, Input } from './UI';
import { MapPin, Navigation, Clock, Check, X, Briefcase, Thermometer, ShieldCheck, MessageSquare, AlertTriangle, Truck, Wrench, ChevronRight, User, LogOut, Phone, Activity, Search, Filter, Camera, Send, CheckCircle, AlertCircle, Headphones, ArrowRight, UserCheck, MessageCircle, MoreVertical, Paperclip, ChevronLeft, Image as ImageIcon, Star, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceTask, ServiceTaskType, Message, ExpertQuestion } from '../types';

// Role Definitions for Demo Switcher
const ROLES = [
    { id: 'DELIVERY', label: 'Logistics', icon: <Truck size={18}/> },
    { id: 'MAINTENANCE', label: 'Technician', icon: <Wrench size={18}/> },
    { id: 'QA_CHECK', label: 'QA Inspector', icon: <ShieldCheck size={18}/> },
    { id: 'SUPPORT', label: 'Support Agent', icon: <Headphones size={18}/> },
    { id: 'EXPERT_ADVICE', label: 'Expert', icon: <MessageSquare size={18}/> }, // Updated
];

const QUICK_REPLIES = [
    "Hello! How can I help you today?",
    "I am checking this issue for you.",
    "Your service request has been accepted.",
    "Maintenance team will assist shortly.",
    "Please upload a photo if possible.",
    "We are on the way."
];

const getTaskIcon = (type: ServiceTaskType) => {
    switch(type) {
        case 'EMERGENCY': return <AlertTriangle className="text-red-500"/>;
        case 'DELIVERY': return <Truck className="text-blue-500"/>;
        case 'MAINTENANCE': return <Wrench className="text-orange-500"/>;
        case 'QA_CHECK': return <ShieldCheck className="text-green-500"/>;
        case 'EXPERT_ADVICE': return <MessageSquare className="text-purple-500"/>;
        case 'SUPPORT': return <Headphones className="text-indigo-500"/>;
        case 'EXTENSION': return <Clock className="text-yellow-600"/>;
        default: return <Briefcase className="text-gray-500"/>;
    }
};

// Tracking Map Component (Visual Simulation)
const TrackingMap: React.FC<{ tracking: any }> = ({ tracking }) => {
    // Normalize coordinates to 0-100% for CSS positioning
    // This is a mockup since we don't have a real map library without API keys
    // We assume a bounding box logic for demo purposes
    
    return (
        <div className="relative w-full h-48 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-inner group">
             {/* Map Background Pattern */}
             <div className="absolute inset-0 opacity-[0.03] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale" />
             
             {/* Route Line */}
             <div className="absolute top-1/2 left-[15%] right-[15%] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500/20 w-full" />
             </div>

             {/* Origin: Farmer */}
             <div className="absolute top-1/2 left-[15%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                 <div className="w-10 h-10 bg-green-100 border-2 border-green-600 rounded-full flex items-center justify-center text-green-700 shadow-lg mb-2 transform transition-transform hover:scale-110">
                     <Home size={18} fill="currentColor" className="text-green-700" />
                 </div>
                 <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm border border-gray-100 text-[10px] font-bold text-gray-700 whitespace-nowrap">
                     Farmer Location
                 </div>
             </div>

             {/* Destination */}
             <div className="absolute top-1/2 right-[15%] -translate-y-1/2 translate-x-1/2 flex flex-col items-center z-10">
                 <div className="w-10 h-10 bg-blue-100 border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-700 shadow-lg mb-2">
                     <MapPin size={18} fill="currentColor" />
                 </div>
                 <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm border border-gray-100 text-[10px] font-bold text-gray-700 whitespace-nowrap">
                     {tracking.destination.name}
                 </div>
             </div>

             {/* Truck (Moving) */}
             <motion.div 
                className="absolute top-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                initial={{ left: '15%' }}
                animate={{ left: `calc(15% + ${tracking.progress * 0.7}%)` }}
                transition={{ type: "spring", stiffness: 50 }}
             >
                 <div className="w-12 h-12 bg-primary border-4 border-white rounded-full flex items-center justify-center text-white shadow-xl relative">
                     <Truck size={20} fill="currentColor" />
                 </div>
                 {tracking.estimatedArrival && (
                     <div className="absolute -bottom-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap">
                         ETA: {tracking.estimatedArrival}
                     </div>
                 )}
             </motion.div>
        </div>
    );
};

// Render a Single Task Card
const TaskCard: React.FC<{ task: ServiceTask; onClick: (t: ServiceTask) => void }> = ({ task, onClick }) => (
    <motion.div 
      layoutId={task.id}
      onClick={() => onClick(task)}
      className={`bg-white p-5 rounded-2xl shadow-sm border transition-all cursor-pointer relative overflow-hidden group hover:shadow-md ${task.priority === 'CRITICAL' ? 'border-l-4 border-l-red-500 border-y-red-100 border-r-red-100' : 'border-gray-200 border-l-4 border-l-primary'}`}
    >
        {task.priority === 'CRITICAL' && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg animate-pulse">
                EMERGENCY
            </div>
        )}
        
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${task.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                      {getTaskIcon(task.type)}
                  </div>
                  <div>
                      <h3 className="font-bold text-gray-900">{task.title}</h3>
                      <p className="text-xs text-gray-500 font-medium">{task.type.replace('_', ' ')} • {task.date}</p>
                  </div>
            </div>
            {task.earnings ? (
                <div className="text-right">
                    <span className="block font-bold text-green-600">₹{task.earnings}</span>
                    <span className="text-[10px] text-gray-400">Incentive</span>
                </div>
            ) : (
               <Badge variant="neutral">Support</Badge>
            )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 font-medium border-t border-gray-100 pt-3 mt-auto">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><User size={12}/> {task.requesterName}</span>
                {task.location && <span className="flex items-center gap-1"><MapPin size={12}/> {task.location.split(',')[0]}</span>}
            </div>
            <div className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                {task.status === 'AVAILABLE' ? 'View Details' : 'Continue'} <ChevronRight size={14}/>
            </div>
        </div>
    </motion.div>
);

// Chat Bubble Component
const ChatBubble: React.FC<{ msg: Message }> = ({ msg }) => {
    // For Service/Support Views
    const isMe = msg.sender === 'Service' || msg.sender === 'Expert'; // Expert or Service is 'Me'
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
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-3`}>
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                isMe 
                  ? 'bg-purple-600 text-white rounded-br-none' // Purple for Expert
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}>
                {msg.type === 'image' && msg.attachmentUrl && (
                    <img src={msg.attachmentUrl} alt="attachment" className="rounded-lg mb-2 max-h-40 object-cover border border-black/10" />
                )}
                {msg.content}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1">
                {msg.timestamp} {isMe && '• Sent'}
            </span>
        </div>
    );
};

// --- EXPERT VIEW COMPONENT ---
const ExpertView = () => {
    const { expertQuestions, replyToFarmer, resolveExpertQuestion, logout } = useStore();
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ACTIVE' | 'RESOLVED'>('ACTIVE');
    const [chatInput, setChatInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeQuestion = expertQuestions.find(q => q.id === selectedQuestionId);
    
    const filteredQuestions = expertQuestions.filter(q => {
        const isResolved = q.status === 'RESOLVED';
        return filter === 'RESOLVED' ? isResolved : !isResolved;
    });

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [activeQuestion?.history]);

    const handleSend = () => {
        if (!selectedQuestionId || !chatInput.trim()) return;
        replyToFarmer(selectedQuestionId, chatInput);
        setChatInput('');
    };

    const handleUpload = () => {
        if (!selectedQuestionId) return;
        // Mock upload
        replyToFarmer(selectedQuestionId, "Sending a reference image...", "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&auto=format&fit=crop");
    };

    return (
        <div className="flex w-full h-full bg-white md:bg-gray-50 md:p-4 gap-4">
            {/* LEFT PANEL: Inbox List */}
            <div className={`${selectedQuestionId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 bg-white md:rounded-2xl md:shadow-sm md:border border-purple-100 overflow-hidden h-full`}>
                {/* Expert Header */}
                <div className="p-4 border-b border-purple-100 bg-purple-50">
                    <h2 className="text-lg font-bold text-purple-900 mb-2">Expert Inbox</h2>
                    <div className="flex bg-white p-1 rounded-lg border border-purple-100">
                        <button onClick={() => setFilter('ACTIVE')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'ACTIVE' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-600 hover:bg-purple-50'}`}>Active</button>
                        <button onClick={() => setFilter('RESOLVED')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'RESOLVED' ? 'bg-purple-800 text-white shadow-sm' : 'text-purple-600 hover:bg-purple-50'}`}>Resolved</button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredQuestions.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">No questions found.</div>}
                    {filteredQuestions.map(q => (
                        <div 
                            key={q.id} 
                            onClick={() => setSelectedQuestionId(q.id)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-purple-50 transition-colors ${selectedQuestionId === q.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <Badge variant="neutral" className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600">{q.crop}</Badge>
                                <span className="text-[10px] text-gray-400">{q.date}</span>
                            </div>
                            <h4 className={`text-sm truncate mb-1 font-bold text-gray-900`}>{q.title}</h4>
                            <p className="text-xs text-gray-500 truncate">{q.farmerName}</p>
                        </div>
                    ))}
                </div>
                
                {/* Mini Profile */}
                <div className="p-3 border-t border-purple-100 bg-purple-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs">EXP</div>
                        <div>
                            <p className="text-xs font-bold text-purple-900">Dr. Aruna Rao</p>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                <span className="text-[10px] text-green-600 font-bold uppercase">Online</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={logout} className="p-1.5 hover:bg-purple-100 rounded-full text-purple-400 hover:text-purple-700 transition-colors" title="Sign Out">
                        <LogOut size={14}/>
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL: Chat Window */}
            <div className={`${!selectedQuestionId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-2/3 bg-white md:rounded-2xl md:shadow-sm md:border border-purple-100 overflow-hidden h-full relative`}>
                {activeQuestion ? (
                    <>
                        <div className="p-3 border-b border-purple-100 flex justify-between items-center bg-white z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedQuestionId(null)} className="md:hidden p-1.5 -ml-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
                                <div>
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">{activeQuestion.farmerName}</h3>
                                    <p className="text-xs text-gray-500">{activeQuestion.title} • {activeQuestion.crop}</p>
                                </div>
                            </div>
                            {activeQuestion.status !== 'RESOLVED' && (
                                <Button size="sm" variant="outline" className="text-xs h-8 ml-2 border-purple-200 text-purple-700 hover:bg-purple-50" onClick={() => resolveExpertQuestion(activeQuestion.id)}>
                                    <CheckCircle size={14} className="mr-1"/> Resolve
                                </Button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-purple-50/30" ref={scrollRef}>
                            {activeQuestion.history.map((msg, i) => (
                                <ChatBubble key={i} msg={msg} />
                            ))}
                            {activeQuestion.status === 'RESOLVED' && (
                                <div className="text-center my-6">
                                    <span className="bg-gray-100 text-gray-500 text-xs px-4 py-1.5 rounded-full font-bold border border-gray-200">Conversation Resolved</span>
                                </div>
                            )}
                        </div>

                        {activeQuestion.status !== 'RESOLVED' && (
                            <div className="p-3 bg-white border-t border-purple-100 flex gap-2 items-center">
                                <button onClick={handleUpload} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><Paperclip size={20}/></button>
                                <input 
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                                    placeholder="Type your advice..."
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                />
                                <button onClick={handleSend} disabled={!chatInput.trim()} className="p-2 bg-purple-600 text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:bg-purple-700 transition-colors shadow-md">
                                    <Send size={18} className="ml-0.5"/>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-purple-200">
                        <MessageSquare size={64} className="mb-4 opacity-50"/>
                        <p className="text-purple-400 font-medium">Select a question to start advising</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ServiceDashboard: React.FC = () => {
  const { serviceTasks, acceptServiceTask, completeServiceTask, approveQACheck, logout, updateDeliveryStep, sendServiceMessage, updateMaintenanceStage, escalateTask, markTaskRead, startDeliverySimulation, updateDeliveryProgress, stopDeliverySimulation } = useStore();
  
  // State
  const [currentRoleView, setCurrentRoleView] = useState<ServiceTaskType | 'ALL'>('ALL');
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'MY_TASKS'>('ALL');
  const [selectedTask, setSelectedTask] = useState<ServiceTask | null>(null);
  
  // Support View State
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [inboxSearch, setInboxSearch] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Modal State for Task Execution (Non-Chat)
  const [executionData, setExecutionData] = useState<any>({});
  const [chatInput, setChatInput] = useState('');
  
  // Escalation State
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);
  const [escalationNote, setEscalationNote] = useState('');

  // Filtering Logic
  const filteredTasks = serviceTasks.filter(task => {
      let matchesRole = currentRoleView === 'ALL';
      if (!matchesRole) {
          if (currentRoleView === 'SUPPORT') matchesRole = ['SUPPORT', 'EXTENSION'].includes(task.type); // Removed EXPERT_ADVICE from here
          else if (currentRoleView === 'MAINTENANCE') matchesRole = ['MAINTENANCE', 'EMERGENCY'].includes(task.type);
          else matchesRole = task.type === currentRoleView;
      }
      
      const matchesStatus = filter === 'ALL' ? true :
                            filter === 'AVAILABLE' ? task.status === 'AVAILABLE' :
                            ['IN_PROGRESS', 'ACCEPTED', 'COMPLETED'].includes(task.status);
                            
      return matchesRole && matchesStatus;
  });

  const myStats = {
      earnings: serviceTasks.filter(t => t.status === 'COMPLETED').reduce((acc, t) => acc + (t.earnings || 0), 0),
      completed: serviceTasks.filter(t => t.status === 'COMPLETED').length,
      rating: 4.8
  };

  // Support Inbox Grouping (Now excludes Expert Advice tasks as they have their own view)
  const supportTasks = filteredTasks.filter(t => 
      ['SUPPORT', 'EXTENSION'].includes(t.type) && 
      (t.requesterName.toLowerCase().includes(inboxSearch.toLowerCase()) || t.description.toLowerCase().includes(inboxSearch.toLowerCase()))
  );
  
  const activeChatTask = serviceTasks.find(t => t.id === selectedChatId);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChatTask?.metadata?.chatHistory]);

  // Delivery Simulation Effect
  useEffect(() => {
    let interval: any;
    if (selectedTask?.type === 'DELIVERY' && selectedTask.status === 'IN_PROGRESS' && selectedTask.metadata?.tracking?.isActive) {
        interval = setInterval(() => {
            const currentProgress = selectedTask.metadata?.tracking?.progress || 0;
            if (currentProgress < 100) {
                updateDeliveryProgress(selectedTask.id, currentProgress + 1);
            } else {
                clearInterval(interval);
            }
        }, 1000); // Update every second
    }
    return () => clearInterval(interval);
  }, [selectedTask, updateDeliveryProgress]);


  const handleTaskAction = (action: 'ACCEPT' | 'COMPLETE' | 'UPDATE', payload?: any) => {
      if (!selectedTask) return;

      if (action === 'ACCEPT') {
          acceptServiceTask(selectedTask.id);
          if (['MAINTENANCE', 'EMERGENCY'].includes(selectedTask.type)) {
               updateMaintenanceStage(selectedTask.id, 'DIAGNOSTIC');
               setSelectedTask({...selectedTask, status: 'IN_PROGRESS', metadata: {...selectedTask.metadata, maintenanceStage: 'DIAGNOSTIC'}});
          } else {
               setSelectedTask({...selectedTask, status: 'IN_PROGRESS'}); 
          }
      } else if (action === 'COMPLETE') {
          if (selectedTask.type === 'QA_CHECK' && selectedTask.metadata?.cropId) {
              approveQACheck(selectedTask.metadata.cropId);
          }
          if (selectedTask.type === 'DELIVERY') {
              stopDeliverySimulation(selectedTask.id);
          }
          completeServiceTask(selectedTask.id, payload?.resolution);
          setSelectedTask(null);
          setExecutionData({});
      }
  };

  const handleMaintenanceStep = (nextStage: 'FIXING' | 'COMPLETED') => {
      if (!selectedTask) return;
      if (nextStage === 'FIXING') {
          updateMaintenanceStage(selectedTask.id, 'FIXING', executionData.diagnosticNotes);
          setSelectedTask(prev => prev ? ({...prev, metadata: {...prev.metadata, maintenanceStage: 'FIXING', diagnosticNotes: executionData.diagnosticNotes}}) : null);
      } else {
          handleTaskAction('COMPLETE', { resolution: executionData.repairNotes });
      }
  };

  const handleDeliveryStepToggle = (index: number) => {
      if (selectedTask) updateDeliveryStep(selectedTask.id, index);
  };

  const handleStartSimulation = () => {
      if (selectedTask) {
          startDeliverySimulation(selectedTask.id);
          // Force update local selected task state so visual updates trigger
          setSelectedTask(prev => prev ? ({...prev, metadata: {...prev.metadata, tracking: {...prev.metadata?.tracking, isActive: true}}}) : null);
      }
  };

  const handleSendChat = (taskId: string, msg?: string, attachment?: string) => {
      const text = msg || chatInput;
      if (text.trim() || attachment) {
          sendServiceMessage(taskId, text, 'Service', attachment);
          setChatInput('');
          setShowQuickReplies(false);
      }
  };

  const handleFileUpload = (taskId: string) => {
      const mockImage = "https://images.unsplash.com/photo-1627916607164-7b20241db935?q=80&w=500&auto=format&fit=crop";
      handleSendChat(taskId, "Sent an attachment", mockImage);
  };

  const handleSelectChat = (id: string) => {
      setSelectedChatId(id);
      markTaskRead(id);
  };

  const handleEscalate = (targetType: ServiceTaskType) => {
      const targetId = selectedTask?.id || selectedChatId;
      if (targetId && escalationNote) {
          escalateTask(targetId, targetType, escalationNote);
          setIsEscalateOpen(false);
          setEscalationNote('');
          setSelectedTask(null);
          setSelectedChatId(null);
          alert(`Ticket escalated to ${targetType}`);
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-0 font-sans text-gray-900 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm shrink-0 z-30 border-b border-gray-200">
          <div className="px-4 py-3 flex justify-between items-center max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                      <Briefcase size={24} strokeWidth={2.5}/>
                  </div>
                  <div>
                      <h1 className="font-bold text-gray-900 leading-tight">Service Portal</h1>
                      <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                          <span className="text-xs text-green-600 font-bold tracking-wide">ONLINE</span>
                      </div>
                  </div>
              </div>
              <button onClick={logout} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors flex items-center gap-2" title="Sign Out">
                  <span className="text-sm font-medium hidden sm:inline">Sign Out</span>
                  <LogOut size={20} />
              </button>
          </div>
          
          {/* Role Switcher */}
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
             <button 
                onClick={() => { setCurrentRoleView('ALL'); setSelectedChatId(null); }} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${currentRoleView === 'ALL' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'}`}
             >
                All Tasks
             </button>
             {ROLES.map(role => (
                 <button 
                    key={role.id}
                    onClick={() => { setCurrentRoleView(role.id as any); setSelectedChatId(null); }} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${currentRoleView === role.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200'}`}
                 >
                    {role.icon} {role.label}
                 </button>
             ))}
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
          
          {currentRoleView === 'EXPERT_ADVICE' ? (
              <ExpertView />
          ) : currentRoleView === 'SUPPORT' ? (
              <div className="flex w-full h-full bg-white md:bg-gray-50 md:p-4 gap-4">
                  {/* SUPPORT PANEL Logic (Reused structure but for support tasks) */}
                  <div className={`${selectedChatId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 bg-white md:rounded-2xl md:shadow-sm md:border border-gray-200 overflow-hidden h-full`}>
                      <div className="p-4 border-b border-gray-100">
                          <div className="relative mb-3">
                              <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                              <input className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Search conversations..." value={inboxSearch} onChange={e => setInboxSearch(e.target.value)}/>
                          </div>
                          <div className="flex gap-2 overflow-x-auto no-scrollbar">
                              {['All', 'Unread', 'Active', 'Resolved'].map(f => (<button key={f} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap">{f}</button>))}
                          </div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                          {supportTasks.map(task => (
                              <div key={task.id} onClick={() => handleSelectChat(task.id)} className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${selectedChatId === task.id ? 'bg-blue-50/50' : ''}`}>
                                  <div className="relative"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">{task.requesterName.charAt(0)}</div>{task.priority === 'HIGH' && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>}</div>
                                  <div className="flex-1 min-w-0"><div className="flex justify-between items-start mb-0.5"><h4 className={`text-sm truncate ${task.unreadCount ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{task.requesterName}</h4><span className="text-[10px] text-gray-400 whitespace-nowrap">{task.date}</span></div><p className="text-xs text-gray-500 truncate mb-1">{task.description}</p><div className="flex items-center gap-2"><Badge variant="neutral" className="text-[10px] px-1.5 py-0">{task.type.replace('_', ' ')}</Badge>{task.unreadCount && task.unreadCount > 0 && (<span className="bg-primary text-white text-[10px] font-bold px-1.5 rounded-full min-w-[1.2rem] text-center">{task.unreadCount}</span>)}</div></div>
                              </div>
                          ))}
                          {supportTasks.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">No messages found.</p>}
                      </div>
                  </div>
                  <div className={`${!selectedChatId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-2/3 bg-white md:rounded-2xl md:shadow-sm md:border border-gray-200 overflow-hidden h-full relative`}>
                      {activeChatTask ? (
                          <>
                              <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm">
                                  <div className="flex items-center gap-3"><button onClick={() => setSelectedChatId(null)} className="md:hidden p-1.5 -ml-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button><div><h3 className="font-bold text-gray-900 flex items-center gap-2">{activeChatTask.requesterName}{activeChatTask.status === 'COMPLETED' && <CheckCircle size={14} className="text-green-500"/>}</h3><p className="text-xs text-gray-500 flex items-center gap-1">{activeChatTask.title}</p></div></div>
                                  <div className="flex items-center gap-1"><button onClick={() => setIsEscalateOpen(true)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full" title="Escalate"><ArrowRight size={18}/></button>{activeChatTask.status !== 'COMPLETED' && (<Button size="sm" variant="outline" className="text-xs h-8 ml-2" onClick={() => completeServiceTask(activeChatTask.id, 'Resolved via Chat')}>Mark Resolved</Button>)}</div>
                              </div>
                              <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50" ref={scrollRef}>
                                  {activeChatTask.metadata?.chatHistory?.map((msg, i) => (<ChatBubble key={i} msg={msg} />))}
                                  {activeChatTask.status === 'COMPLETED' && (<div className="text-center my-6"><span className="bg-gray-200 text-gray-600 text-xs px-4 py-1.5 rounded-full font-bold">This conversation is closed</span></div>)}
                              </div>
                              {activeChatTask.status !== 'COMPLETED' && (
                                  <div className="p-3 bg-white border-t border-gray-200">
                                      <AnimatePresence>{showQuickReplies && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-2"><div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">{QUICK_REPLIES.map((reply, i) => (<button key={i} onClick={() => handleSendChat(activeChatTask.id, reply)} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-lg whitespace-nowrap border border-blue-100 transition-colors">{reply}</button>))}</div></motion.div>)}</AnimatePresence>
                                      <div className="flex items-center gap-2"><button onClick={() => setShowQuickReplies(!showQuickReplies)} className={`p-2 rounded-full transition-colors ${showQuickReplies ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}><MessageCircle size={20} /></button><button onClick={() => handleFileUpload(activeChatTask.id)} className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"><Paperclip size={20} /></button><div className="flex-1 relative"><input className="w-full h-10 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="Type a message..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat(activeChatTask.id)}/><button onClick={() => handleSendChat(activeChatTask.id)} disabled={!chatInput.trim()} className="absolute right-1 top-1 p-1.5 bg-primary text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 transition-all hover:scale-105"><Send size={16} className="ml-0.5"/></button></div></div>
                                  </div>
                              )}
                          </>
                      ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-300"><MessageSquare size={64} className="mb-4 opacity-20"/><p className="text-gray-500 font-medium">Select a conversation to start chatting</p></div>
                      )}
                  </div>
              </div>
          ) : (
              // --- STANDARD TASK LIST ---
              <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
                   {/* Task Filters */}
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="font-bold text-xl text-gray-800">Task Queue</h2>
                      <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                          <button onClick={() => setFilter('ALL')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>All</button>
                          <button onClick={() => setFilter('AVAILABLE')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'AVAILABLE' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>Available</button>
                          <button onClick={() => setFilter('MY_TASKS')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'MY_TASKS' ? 'bg-green-50 text-green-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>Active</button>
                      </div>
                  </div>

                   <div className="space-y-4 max-w-4xl mx-auto">
                      {filteredTasks.length === 0 && (
                          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                              <div className="bg-gray-50 p-4 rounded-full inline-block mb-3"><Activity className="text-gray-400"/></div>
                              <p className="text-gray-500 font-medium">No tasks found for this view.</p>
                          </div>
                      )}
                      {filteredTasks.map(task => <TaskCard key={task.id} task={task} onClick={setSelectedTask} />)}
                  </div>
              </div>
          )}
      </div>

      {/* Task Execution Modal (Non-Chat Tasks) */}
      <AnimatePresence>
          {selectedTask && (
              <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title={selectedTask.title}>
                  <div className="space-y-6">
                      {/* Detailed Header */}
                      <div className={`p-4 rounded-xl border ${selectedTask.priority === 'CRITICAL' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                           <div className="flex justify-between items-start mb-2">
                               <Badge variant={selectedTask.priority === 'CRITICAL' ? 'danger' : 'neutral'}>{selectedTask.priority} PRIORITY</Badge>
                               <span className="text-xs font-bold text-gray-400">{selectedTask.id}</span>
                           </div>
                           <p className="text-sm text-gray-800 leading-relaxed font-medium">{selectedTask.description}</p>
                           <div className="mt-3 flex gap-4 text-xs text-gray-500">
                               <span className="flex items-center gap-1"><User size={12}/> {selectedTask.requesterName}</span>
                               <span className="flex items-center gap-1"><Clock size={12}/> Posted {selectedTask.date}</span>
                               {selectedTask.metadata?.unitId && <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-1.5 rounded"><Activity size={12}/> Unit {selectedTask.metadata.unitId}</span>}
                           </div>
                      </div>

                      {/* --- Dynamic Content Based on Task Type --- */}

                      {selectedTask.type === 'DELIVERY' && (
                          <div className="space-y-4">
                              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                                  <div>
                                      <p className="text-xs font-bold text-blue-600 uppercase">Route Info</p>
                                      <p className="text-sm font-bold text-blue-900 mt-1">{selectedTask.location}</p>
                                  </div>
                                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm">
                                      <Navigation size={20}/>
                                  </div>
                              </div>
                              
                              {selectedTask.status === 'IN_PROGRESS' && selectedTask.metadata?.tracking && (
                                  <TrackingMap tracking={selectedTask.metadata.tracking} />
                              )}

                              {selectedTask.status === 'IN_PROGRESS' && selectedTask.metadata?.deliverySteps && (
                                  <div className="space-y-3">
                                      <p className="text-sm font-bold text-gray-700">Delivery Checklist</p>
                                      {selectedTask.metadata.deliverySteps.map((step, i) => (
                                          <div key={i} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${step.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                                              <div className="flex items-center gap-3">
                                                  <div className={`h-5 w-5 rounded border flex items-center justify-center cursor-pointer ${step.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`} onClick={() => handleDeliveryStepToggle(i)}>
                                                      {step.completed && <Check size={14}/>}
                                                  </div>
                                                  <span className={`text-sm ${step.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{step.name}</span>
                                              </div>
                                              {step.time && <span className="text-[10px] text-gray-400 font-mono">{step.time}</span>}
                                          </div>
                                      ))}
                                      <button className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
                                          <Camera size={16}/> Upload Proof (Photo)
                                      </button>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* --- MAINTENANCE WORKFLOW --- */}
                      {(selectedTask.type === 'MAINTENANCE' || selectedTask.type === 'EMERGENCY') && (
                          <div className="space-y-6">
                               {/* Unit Details Header */}
                               <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex justify-between items-center">
                                   <div className="flex gap-3">
                                       <div className="bg-white p-2 rounded-full text-orange-500"><Thermometer size={20}/></div>
                                       <div>
                                           <p className="text-sm font-bold text-orange-900">Unit Diagnostic</p>
                                           <p className="text-xs text-orange-700">Target Unit: <span className="font-mono bg-orange-100 px-1 rounded">{selectedTask.metadata?.unitId}</span></p>
                                       </div>
                                   </div>
                               </div>

                               {/* Workflow Stepper */}
                               <div className="flex items-center justify-between relative px-2">
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
                                    {['AVAILABLE', 'DIAGNOSTIC', 'FIXING', 'COMPLETED'].map((step, index) => {
                                        const currentStage = selectedTask.status === 'AVAILABLE' ? 'AVAILABLE' : selectedTask.status === 'COMPLETED' ? 'COMPLETED' : selectedTask.metadata?.maintenanceStage || 'DIAGNOSTIC';
                                        const stepIndex = ['AVAILABLE', 'DIAGNOSTIC', 'FIXING', 'COMPLETED'].indexOf(step);
                                        const currentIndex = ['AVAILABLE', 'DIAGNOSTIC', 'FIXING', 'COMPLETED'].indexOf(currentStage);
                                        const isActive = stepIndex <= currentIndex;
                                        
                                        return (
                                            <div key={step} className="flex flex-col items-center bg-white px-1">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${isActive ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                                    {stepIndex < currentIndex ? <Check size={14}/> : index + 1}
                                                </div>
                                                <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>{step === 'AVAILABLE' ? 'Assigned' : step}</span>
                                            </div>
                                        )
                                    })}
                               </div>

                               {/* Active Stage Content */}
                               {selectedTask.status === 'IN_PROGRESS' && (
                                   <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                       {selectedTask.metadata?.maintenanceStage === 'DIAGNOSTIC' && (
                                           <div className="space-y-4">
                                               <h4 className="font-bold text-gray-800 flex items-center gap-2"><Search size={16}/> Diagnostic Phase</h4>
                                               <p className="text-xs text-gray-500">Inspect the unit and document initial findings.</p>
                                               <div>
                                                   <label className="block text-xs font-bold text-gray-700 mb-1.5">Diagnostic Notes</label>
                                                   <textarea 
                                                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                                                      rows={3}
                                                      placeholder="E.g. Compressor making noise, temperature fluctuating..."
                                                      value={executionData.diagnosticNotes || ''}
                                                      onChange={e => setExecutionData({...executionData, diagnosticNotes: e.target.value})}
                                                   />
                                               </div>
                                           </div>
                                       )}

                                       {selectedTask.metadata?.maintenanceStage === 'FIXING' && (
                                           <div className="space-y-4">
                                               <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 mb-2">
                                                   <strong>Diagnostic:</strong> {selectedTask.metadata.diagnosticNotes}
                                               </div>
                                               <h4 className="font-bold text-gray-800 flex items-center gap-2"><Wrench size={16}/> Repair Phase</h4>
                                               <p className="text-xs text-gray-500">Document the repairs performed or parts replaced.</p>
                                               <div>
                                                   <label className="block text-xs font-bold text-gray-700 mb-1.5">Repair / Resolution Notes</label>
                                                   <textarea 
                                                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                                                      rows={3}
                                                      placeholder="E.g. Replaced fan motor, recalibrated sensor..."
                                                      value={executionData.repairNotes || ''}
                                                      onChange={e => setExecutionData({...executionData, repairNotes: e.target.value})}
                                                   />
                                               </div>
                                           </div>
                                       )}
                                   </div>
                               )}
                          </div>
                      )}

                    {selectedTask.type === 'QA_CHECK' && (
                          <div className="space-y-4">
                              <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                                  <ShieldCheck size={32} className="mx-auto text-green-500 mb-2"/>
                                  <p className="text-sm font-bold text-green-800">Quality Certification</p>
                                  <p className="text-xs text-green-600">Verify crop standards for premium listing.</p>
                              </div>
                              {selectedTask.status === 'IN_PROGRESS' && (
                                  <div className="space-y-3">
                                      <p className="text-sm font-bold text-gray-700">Inspection Criteria</p>
                                      {selectedTask.metadata?.checklist?.map((crit, i) => (
                                          <div key={i} className="flex justify-between items-center p-2 border-b border-gray-100">
                                              <span className="text-sm text-gray-600">{crit.item}</span>
                                              <div className="flex gap-2">
                                                  <button className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200"><Check size={12}/></button>
                                              </div>
                                          </div>
                                      ))}
                                      <div className="pt-2">
                                          <label className="flex items-center gap-2 text-sm font-bold text-green-700 p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer">
                                              <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 h-5 w-5" 
                                                checked={executionData.verified || false}
                                                onChange={e => setExecutionData({...executionData, verified: e.target.checked})}
                                              />
                                              Approve & Issue QA Seal
                                          </label>
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* --- Action Buttons (Standard) --- */}
                      <div className="pt-4 border-t border-gray-100 flex gap-3">
                          {selectedTask.status === 'AVAILABLE' ? (
                              <>
                                  <Button variant="ghost" className="flex-1" onClick={() => setSelectedTask(null)}>Cancel</Button>
                                  <Button className="flex-[2] h-12 text-base font-bold shadow-lg shadow-primary/20" onClick={() => handleTaskAction('ACCEPT')}>
                                      Accept Task {selectedTask.earnings ? `(₹${selectedTask.earnings})` : ''}
                                  </Button>
                              </>
                          ) : selectedTask.status === 'IN_PROGRESS' ? (
                              <>
                                {(selectedTask.type === 'MAINTENANCE' || selectedTask.type === 'EMERGENCY') ? (
                                    <>
                                        {selectedTask.metadata?.maintenanceStage === 'DIAGNOSTIC' && (
                                            <Button 
                                                className="w-full h-12 text-base font-bold"
                                                onClick={() => handleMaintenanceStep('FIXING')}
                                                disabled={!executionData.diagnosticNotes}
                                            >
                                                Proceed to Repairs <ChevronRight size={18} className="ml-2"/>
                                            </Button>
                                        )}
                                        {selectedTask.metadata?.maintenanceStage === 'FIXING' && (
                                            <div className="flex gap-2 w-full">
                                                <Button 
                                                    variant="outline" 
                                                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                                    onClick={() => handleTaskAction('COMPLETE', { resolution: 'UNRESOLVED - Follow Up Needed' })}
                                                >
                                                    Mark Unresolved
                                                </Button>
                                                <Button 
                                                    className="flex-[2] font-bold"
                                                    onClick={() => handleMaintenanceStep('COMPLETED')}
                                                    disabled={!executionData.repairNotes}
                                                >
                                                    Complete Repairs <CheckCircle size={18} className="ml-2"/>
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full space-y-3">
                                        {selectedTask.type === 'DELIVERY' && selectedTask.metadata?.tracking && !selectedTask.metadata.tracking.isActive && (
                                             <Button className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700" onClick={handleStartSimulation}>Start Live Tracking</Button>
                                        )}
                                        <Button 
                                            className={`w-full h-12 text-base font-bold ${selectedTask.type === 'QA_CHECK' && !executionData.verified ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => handleTaskAction('COMPLETE', { resolution: executionData.resolution })}
                                            variant={selectedTask.type === 'QA_CHECK' ? 'success' : 'primary'}
                                            disabled={selectedTask.type === 'QA_CHECK' && !executionData.verified}
                                        >
                                            {selectedTask.type === 'DELIVERY' ? 'Mark Completed' : 
                                            selectedTask.type === 'QA_CHECK' ? 'Issue Verified Seal' :
                                            'Mark Resolved'}
                                        </Button>
                                    </div>
                                )}
                              </>
                          ) : (
                              <Button className="w-full bg-gray-200 text-gray-500 cursor-not-allowed" disabled>Task Completed</Button>
                          )}
                      </div>
                  </div>
              </Modal>
          )}

          {/* Escalation Modal */}
          <Modal isOpen={isEscalateOpen} onClose={() => setIsEscalateOpen(false)} title="Escalate Ticket">
              <div className="space-y-4">
                  <p className="text-sm text-gray-600">Transfer this ticket to a specialized team. The ticket will be removed from your queue.</p>
                  <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Internal Note</label>
                      <textarea 
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                          placeholder="Reason for escalation..."
                          value={escalationNote}
                          onChange={e => setEscalationNote(e.target.value)}
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start" onClick={() => handleEscalate('MAINTENANCE')}>
                          <Wrench size={16} className="mr-2"/> To Maintenance
                      </Button>
                      <Button variant="outline" className="justify-start" onClick={() => handleEscalate('EXPERT_ADVICE')}>
                          <UserCheck size={16} className="mr-2"/> To Expert
                      </Button>
                  </div>
              </div>
          </Modal>
      </AnimatePresence>
    </div>
  );
};
