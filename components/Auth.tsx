import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../types';
import { useStore, UserProfile } from '../store';
import { Button, Input, Card } from './UI';
import { Leaf, Truck, Wrench, Check, ArrowRight, ChevronLeft, MapPin, AlertCircle, Loader } from 'lucide-react';

const KERALA_DISTRICTS = [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
    "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
    "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
];

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, setUserRole, setUserProfile } = useStore();
  
  // Sign Up State Machine
  const [signUpStep, setSignUpStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Form States
  const [signInForm, setSignInForm] = useState({ identifier: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({
      name: '', email: '', phone: '', password: '', confirmPassword: '',
      // Role specifics
      farmName: '', companyName: '', district: '', 
      specialization: '', serviceArea: '', idProof: '',
      farmSize: '', license: '', gst: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // --- VALIDATION LOGIC ---
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!signInForm.identifier) newErrors.identifier = "Email or Phone is required";
    else if (!validateEmail(signInForm.identifier) && !validatePhone(signInForm.identifier)) newErrors.identifier = "Invalid email or phone format";
    
    if (!signInForm.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
        setIsLoading(false);
        // Demo Logic: Assign role based on simple check or default to Farmer
        let role = UserRole.FARMER;
        if (signInForm.identifier.includes('retail')) role = UserRole.RETAILER;
        if (signInForm.identifier.includes('service')) role = UserRole.SERVICE;
        
        // Mock Profile for Login
        setUserRole(role);
        setUserProfile({
            name: role === UserRole.FARMER ? 'John Doe' : role === UserRole.RETAILER ? 'FreshMart Manager' : 'Service Tech',
            email: signInForm.identifier.includes('@') ? signInForm.identifier : 'user@freshvault.com',
            role: role,
            phone: !signInForm.identifier.includes('@') ? signInForm.identifier : '9876543210'
        });
        login();
    }, 1000);
  };

  const validateSignUpStep = () => {
      const newErrors: Record<string, string> = {};
      if (signUpStep === 2) {
          if (!signUpForm.name) newErrors.name = "Full Name is required";
          if (!signUpForm.email || !validateEmail(signUpForm.email)) newErrors.email = "Valid Email is required";
          if (!signUpForm.phone || !validatePhone(signUpForm.phone)) newErrors.phone = "Valid 10-digit Phone is required";
          if (!signUpForm.password || signUpForm.password.length < 6) newErrors.password = "Password must be at least 6 chars";
          if (signUpForm.password !== signUpForm.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      } else if (signUpStep === 3) {
          if (selectedRole === UserRole.FARMER) {
              if (!signUpForm.farmName) newErrors.farmName = "Farm Name is required";
              if (!signUpForm.district) newErrors.district = "Location is required";
          } else if (selectedRole === UserRole.RETAILER) {
              if (!signUpForm.companyName) newErrors.companyName = "Company Name is required";
              if (!signUpForm.district) newErrors.district = "Location is required";
          } else if (selectedRole === UserRole.SERVICE) {
              if (!signUpForm.specialization) newErrors.specialization = "Specialization is required";
              if (!signUpForm.serviceArea) newErrors.serviceArea = "Service Area is required";
          }
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
      if (validateSignUpStep()) {
          setSignUpStep(s => s + 1);
      }
  };

  const handleSignUpComplete = () => {
    if (!selectedRole) return;
    setIsLoading(true);
    
    setTimeout(() => {
        setIsLoading(false);
        const newProfile: UserProfile = {
            name: signUpForm.name,
            email: signUpForm.email,
            phone: signUpForm.phone,
            role: selectedRole,
            district: signUpForm.district,
            farmName: signUpForm.farmName,
            companyName: signUpForm.companyName,
            serviceArea: signUpForm.serviceArea,
            specialization: signUpForm.specialization
        };
        setUserRole(selectedRole);
        setUserProfile(newProfile);
        login();
    }, 1500);
  };

  const handleDemoLogin = (role: UserRole) => {
      setUserRole(role);
      setUserProfile({
          name: role === UserRole.FARMER ? 'John Doe' : role === UserRole.RETAILER ? 'FreshMart Ltd.' : 'Service Provider',
          email: 'demo@freshvault.com',
          role: role
      });
      login();
  };

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white border border-gray-100 min-h-[600px] md:min-h-[700px]">
        
        {/* Left Side - Hero Section (Same UI) */}
        <div className="hidden md:flex w-[55%] relative bg-primaryDark flex-col justify-between p-12">
           <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" 
            alt="Agriculture"
           />
           <div className="absolute inset-0 bg-gradient-to-br from-primaryDark/90 to-black/60" />
           
           <div className="relative z-10">
             <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-xl">
                    <Leaf size={36} strokeWidth={2.5} />
                </div>
                <h1 className="text-5xl font-bold font-heading tracking-tight text-white">FreshVault</h1>
             </div>
             <p className="text-lg text-green-50 max-w-md leading-relaxed font-light">
               Connecting Indian farmers, retailers, and logistics in a unified ecosystem to eliminate post-harvest loss.
             </p>
           </div>

           <div className="relative z-10 flex gap-3 flex-wrap">
              {['AI Spoilage Detection', 'Cold Storage IoT', 'Direct Marketplace'].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/10">
                      {tag}
                  </span>
              ))}
           </div>
        </div>

        {/* Right Side - Forms */}
        <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center relative bg-white">
          <AnimatePresence mode='wait'>
            {isLogin ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-sm mx-auto"
              >
                <div className="mb-8">
                    <div className="md:hidden flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <Leaf size={20} strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-bold font-heading text-gray-900">FreshVault</h2>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2 font-heading">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to access your dashboard.</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-6">
                    <Input 
                        label="Email or Phone" 
                        placeholder="+91 98765 43210" 
                        type="text" 
                        value={signInForm.identifier}
                        onChange={e => { setSignInForm({...signInForm, identifier: e.target.value}); setErrors({...errors, identifier: ''}); }}
                        error={errors.identifier}
                    />
                    <Input 
                        label="Password" 
                        placeholder="••••••••" 
                        type="password" 
                        value={signInForm.password}
                        onChange={e => { setSignInForm({...signInForm, password: e.target.value}); setErrors({...errors, password: ''}); }}
                        error={errors.password}
                    />
                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center text-gray-600 cursor-pointer select-none">
                            <input type="checkbox" className="mr-2 rounded border-gray-300 text-primary focus:ring-primary" />
                            Remember me
                        </label>
                        <button type="button" className="text-primary font-semibold hover:underline">Forgot password?</button>
                    </div>
                    <Button type="submit" className="w-full h-12 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all" size="lg" isLoading={isLoading}>Sign In</Button>
                </form>
                
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        New to FreshVault? <button onClick={() => setIsLogin(false)} className="text-primary font-bold hover:underline">Create Account</button>
                    </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                     <p className="text-xs text-center text-gray-400 mb-3 uppercase tracking-wider font-semibold">Quick Demo Access</p>
                     <div className="flex gap-2 justify-center flex-wrap">
                        <button onClick={() => handleDemoLogin(UserRole.FARMER)} className="px-3 py-1.5 rounded bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors">Farmer</button>
                        <button onClick={() => handleDemoLogin(UserRole.RETAILER)} className="px-3 py-1.5 rounded bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors">Retailer</button>
                        <button onClick={() => handleDemoLogin(UserRole.SERVICE)} className="px-3 py-1.5 rounded bg-purple-50 text-purple-700 text-xs font-medium hover:bg-purple-100 transition-colors">Service</button>
                     </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-sm mx-auto h-full flex flex-col"
              >
                 <div className="flex items-center mb-6">
                    <button onClick={() => signUpStep === 1 ? setIsLogin(true) : setSignUpStep(s => s-1)} className="p-2 hover:bg-gray-100 rounded-full -ml-2 text-gray-600 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="ml-auto flex gap-2">
                        {[1,2,3,4].map(step => (
                            <div key={step} className={`h-2 rounded-full transition-all duration-300 ${step === signUpStep ? 'bg-primary w-6' : step < signUpStep ? 'bg-primary/40 w-2' : 'bg-gray-200 w-2'}`} />
                        ))}
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto pr-1">
                    {signUpStep === 1 && (
                        <div className="space-y-4">
                             <h2 className="text-2xl font-bold text-gray-900 font-heading">Join the Ecosystem</h2>
                             <p className="text-gray-500 mb-6">Select your primary role to get started.</p>
                             
                             <RoleCard 
                                icon={<Leaf />} 
                                title="Farmer" 
                                desc="Monitor crops, rent storage, & sell produce."
                                active={selectedRole === UserRole.FARMER}
                                onClick={() => setSelectedRole(UserRole.FARMER)}
                             />
                             <RoleCard 
                                icon={<Truck />} 
                                title="Retailer / Buyer" 
                                desc="Source fresh produce directly & manage deals."
                                active={selectedRole === UserRole.RETAILER}
                                onClick={() => setSelectedRole(UserRole.RETAILER)}
                             />
                             <RoleCard 
                                icon={<Wrench />} 
                                title="Service Provider" 
                                desc="Provide logistics, maintenance & expert advice."
                                active={selectedRole === UserRole.SERVICE}
                                onClick={() => setSelectedRole(UserRole.SERVICE)}
                             />
                        </div>
                    )}

                    {signUpStep === 2 && (
                         <div className="space-y-5">
                             <h2 className="text-2xl font-bold text-gray-900 font-heading">Account Details</h2>
                             <p className="text-gray-500 mb-2">Create your secure FreshVault ID.</p>
                             
                             <Input 
                                label="Full Name" 
                                placeholder="e.g. Rahul Varma" 
                                value={signUpForm.name}
                                onChange={e => setSignUpForm({...signUpForm, name: e.target.value})}
                                error={errors.name}
                             />
                             <Input 
                                label="Email Address" 
                                placeholder="rahul@example.com" 
                                type="email" 
                                value={signUpForm.email}
                                onChange={e => setSignUpForm({...signUpForm, email: e.target.value})}
                                error={errors.email}
                             />
                             <Input 
                                label="Mobile Number" 
                                placeholder="10-digit number" 
                                type="tel" 
                                value={signUpForm.phone}
                                onChange={e => setSignUpForm({...signUpForm, phone: e.target.value})}
                                error={errors.phone}
                             />
                             <Input 
                                label="Password" 
                                type="password" 
                                value={signUpForm.password}
                                onChange={e => setSignUpForm({...signUpForm, password: e.target.value})}
                                error={errors.password}
                             />
                             <Input 
                                label="Confirm Password" 
                                type="password" 
                                value={signUpForm.confirmPassword}
                                onChange={e => setSignUpForm({...signUpForm, confirmPassword: e.target.value})}
                                error={errors.confirmPassword}
                             />
                         </div>
                    )}

                    {signUpStep === 3 && (
                         <div className="space-y-5">
                             <h2 className="text-2xl font-bold text-gray-900 font-heading">
                                {selectedRole === UserRole.FARMER ? "Farm Details" : 
                                 selectedRole === UserRole.RETAILER ? "Company Info" : "Service Profile"}
                             </h2>
                             <p className="text-gray-500 mb-2">Tell us more about your {selectedRole?.toLowerCase()}.</p>
                             
                             {/* Shared District Dropdown */}
                             <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Location</label>
                                 <select 
                                     className={`block h-11 w-full rounded-xl border bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-primary ${errors.district ? 'border-red-500' : 'border-gray-200'}`}
                                     value={signUpForm.district}
                                     onChange={e => setSignUpForm({...signUpForm, district: e.target.value})}
                                 >
                                     <option value="">Select District</option>
                                     {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                 </select>
                                 {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                             </div>

                             {selectedRole === UserRole.FARMER && (
                                 <>
                                    <Input 
                                        label="Farm Name" 
                                        placeholder="e.g. Varma Organic Farms" 
                                        value={signUpForm.farmName}
                                        onChange={e => setSignUpForm({...signUpForm, farmName: e.target.value})}
                                        error={errors.farmName}
                                    />
                                    <Input 
                                        label="Farm Size (Acres)" 
                                        type="number" 
                                        placeholder="5" 
                                        value={signUpForm.farmSize}
                                        onChange={e => setSignUpForm({...signUpForm, farmSize: e.target.value})}
                                    />
                                    <Input 
                                        label="GST ID (Optional)" 
                                        placeholder="GSTIN..." 
                                        value={signUpForm.gst}
                                        onChange={e => setSignUpForm({...signUpForm, gst: e.target.value})}
                                    />
                                 </>
                             )}
                             {selectedRole === UserRole.RETAILER && (
                                 <>
                                    <Input 
                                        label="Company Name" 
                                        placeholder="e.g. FreshMart Ltd." 
                                        value={signUpForm.companyName}
                                        onChange={e => setSignUpForm({...signUpForm, companyName: e.target.value})}
                                        error={errors.companyName}
                                    />
                                    <Input 
                                        label="License / Reg No" 
                                        placeholder="Registration No." 
                                        value={signUpForm.license}
                                        onChange={e => setSignUpForm({...signUpForm, license: e.target.value})}
                                    />
                                 </>
                             )}
                             {selectedRole === UserRole.SERVICE && (
                                 <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization</label>
                                        <select 
                                            className={`block h-11 w-full rounded-xl border bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-primary ${errors.specialization ? 'border-red-500' : 'border-gray-200'}`}
                                            value={signUpForm.specialization}
                                            onChange={e => setSignUpForm({...signUpForm, specialization: e.target.value})}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="DELIVERY">Logistics & Transport</option>
                                            <option value="MAINTENANCE">Technician / Maintenance</option>
                                            <option value="EXPERT">Expert / Consultant</option>
                                            <option value="QA">Quality Assurance Inspector</option>
                                        </select>
                                        {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
                                    </div>
                                    <Input 
                                        label="Service Area" 
                                        placeholder="e.g. Kochi Metro Area" 
                                        value={signUpForm.serviceArea}
                                        onChange={e => setSignUpForm({...signUpForm, serviceArea: e.target.value})}
                                        error={errors.serviceArea}
                                    />
                                    <Input 
                                        label="ID Verification (Aadhaar/PAN)" 
                                        placeholder="ID Number" 
                                        value={signUpForm.idProof}
                                        onChange={e => setSignUpForm({...signUpForm, idProof: e.target.value})}
                                    />
                                 </>
                             )}
                         </div>
                    )}

                    {signUpStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 font-heading">Confirm Details</h2>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Role</p>
                                    <p className="font-bold text-primary">{selectedRole}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Name</p>
                                        <p className="text-sm font-medium">{signUpForm.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Phone</p>
                                        <p className="text-sm font-medium">{signUpForm.phone}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                                    <p className="text-sm font-medium">{signUpForm.email}</p>
                                </div>
                                <div className="pt-3 border-t border-gray-200">
                                     <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                                        {selectedRole === UserRole.FARMER ? 'Farm Info' : selectedRole === UserRole.RETAILER ? 'Company Info' : 'Service Info'}
                                     </p>
                                     <p className="text-sm font-medium">
                                        {selectedRole === UserRole.FARMER ? signUpForm.farmName : selectedRole === UserRole.RETAILER ? signUpForm.companyName : signUpForm.specialization}
                                     </p>
                                     <p className="text-sm text-gray-500">{signUpForm.district}{signUpForm.serviceArea ? ` • ${signUpForm.serviceArea}` : ''}</p>
                                </div>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-3">
                                <Check className="text-green-600 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-green-900 text-sm">Ready to Join?</h4>
                                    <p className="text-green-700 text-xs">By creating an account, you agree to FreshVault's Terms of Service and Privacy Policy.</p>
                                </div>
                            </div>
                        </div>
                    )}
                 </div>

                 <div className="mt-6 pt-4 border-t border-gray-100">
                    <Button 
                        className="w-full h-12" 
                        size="lg" 
                        disabled={(signUpStep === 1 && !selectedRole) || isLoading}
                        isLoading={isLoading}
                        onClick={() => {
                            if (signUpStep < 4) handleNextStep();
                            else handleSignUpComplete();
                        }}
                    >
                        {signUpStep === 4 ? 'Create Account' : 'Continue'} <ArrowRight size={18} className="ml-2" />
                    </Button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const RoleCard = ({ icon, title, desc, active, onClick }: { icon: React.ReactNode, title: string, desc: string, active: boolean, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 group ${active ? 'border-primary bg-green-50' : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'}`}
    >
        <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-500 group-hover:border-primary/50 group-hover:text-primary'}`}>
            {icon}
        </div>
        <div className="flex-1">
            <h3 className={`font-bold ${active ? 'text-primary' : 'text-gray-900'}`}>{title}</h3>
            <p className="text-sm text-gray-500 leading-tight">{desc}</p>
        </div>
        {active && <div className="text-primary"><Check size={20} /></div>}
    </div>
);