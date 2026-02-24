import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SquareLibrary } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast';

export const PendingApproval = () => {
    const { logout, isApproved } = useAuth();
    const navigate = useNavigate();

    // Auto-redirect to library if approved while on pending page
    useEffect(() => {
        if (isApproved) {
            toast.success("Your request has been approved! 🎉");
            navigate('/IRCLibrary');
        }
    }, [isApproved]);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully!");
        navigate('/');
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center bg-base-100 p-10 zain-light rounded-3xl border border-base-300 shadow-sm">
                <div className="flex justify-center mb-6">
                    <div className="bg-neutral p-3 rounded-2xl">
                        <SquareLibrary className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral mb-3 font-sans">Request Pending</h2>
                <p className="text-base-content/60 mb-2 leading-relaxed ">
                    آپ کی درخواست زیر غور ہے۔
                </p>
                <p className="text-base-content/60 mb-8 leading-relaxed">
                    لائبریرین کی منظوری کے بعد آپ لائبریری تک رسائی حاصل کر سکیں گے۔
                    <br />
                    <span className="font-semibold text-neutral">ہم جلد آپ سے رابطہ کریں گے۔</span>
                </p>
                <button onClick={handleLogout} className="btn btn-dash btn-neutral font-sans">
                    Logout
                </button>
            </div>
        </div>
    );
};