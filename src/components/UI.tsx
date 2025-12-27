
import React, { useState } from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white active:scale-95";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primaryDark shadow-md shadow-primary/20",
    secondary: "bg-neutral text-gray-900 hover:bg-gray-200",
    outline: "border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 text-gray-700 hover:text-primary",
    ghost: "hover:bg-gray-100 text-gray-700",
    danger: "bg-highRisk text-white hover:bg-red-600 shadow-md shadow-red-500/20",
    success: "bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-500/20"
  };
  
  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

// Card
export const Card: React.FC<{ children: React.ReactNode; className?: string } & HTMLMotionProps<"div">> = ({ children, className = '', ...props }) => (
  <motion.div 
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

// Input
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }> = ({ label, error, className = '', type = 'text', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        <input 
          type={inputType}
          className={`block h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${error ? 'border-red-500' : ''} ${isPassword ? 'pr-10' : ''} ${className}`}
          style={{ color: '#111827' }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-md hover:bg-gray-100 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// Badge
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info'; className?: string }> = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
    info: "bg-blue-50 text-blue-700 border-blue-200"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Modal
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
