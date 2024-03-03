// src/context/ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Toast {
    id: number;
    type: 'success' | 'error';
    message: string;
}

interface ToastContextType {
    addToast: (message: string, type: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: 'success' | 'error') => {
        const id = ++toastId; // Increment the toast id
        setToasts((currentToasts) => [...currentToasts, { id, type, message }]);

        // Set a timeout to remove the toast after 5 seconds
        setTimeout(() => {
            setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
        }, 5000);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-5 left-1/2 -translate-x-1/2 space-y-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{
                                opacity: 0,
                                scale: 0.5
                            }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ 
                                type: 'spring',
                                duration: 0.2,
                                stiffness: 100,
                            }}
                            className={`alert shadow-lg ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}
                        >
                            <div>
                                <span>{toast.message}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;