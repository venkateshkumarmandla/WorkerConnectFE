import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../api/api';

import toast, { Toaster } from "react-hot-toast";

const Logout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logoutUser(); // Call backend to trigger auto-checkout
                toast.success("🟢 Logout successful. Today’s attendance has been recorded.");
            } catch (e: any) {
                console.error("Logout failed", e);
                // Handle "Login required before logout" or other errors
                if (e.message?.includes("not found") || e.status === 404) {
                    toast.error("🔴 Login required before logout.");
                } else {
                    toast.error("❌ Something went wrong. Please try again.");
                }
            } finally {
                logout(); // Clear client state
                setTimeout(() => {
                    navigate('/login/card');
                }, 1000);
            }
        };
        performLogout();
    }, [logout, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Toaster position="top-center" />
            <p className="text-gray-500">Logging out...</p>
        </div>
    );
};

export default Logout;
