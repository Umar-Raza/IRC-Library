import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, SquareLibrary } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast';

export const PendingApproval = () => {
    const { logout, isApproved, isNewApproval } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isApproved) {
            if (isNewApproval) {
                toast.success("آپ کی درخواست منظور ہوگئی! خوش آمدید 🎉");
            }
            navigate('/IRCLibrary');
        }
    }, [isApproved, isNewApproval]);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully!");
        navigate('/');
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center bg-base-100 p-10 zain-light rounded-3xl border border-base-300 shadow-sm">
                <div className="flex justify-center mb-6">
                    <div className="bg-neutral/10 p-4 rounded-full">
                        <Loader className="w-12 h-12 text-neutral" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral mb-3 font-sans">Request Pending</h2>
                <p className="text-base-content/60 mb-2 leading-relaxed ">
                    آپ کی درخواست زیر غور ہے۔
                </p>
                <p className="text-base-content/60 mb-1 leading-relaxed">
                    لائبریرین کی منظوری کے بعد آپ لائبریری تک رسائی حاصل کر سکیں گے۔
                    <br />
                    <span className="font-semibold text-neutral">ہم جلد آپ سے رابطہ کریں گے۔</span>
                </p>
                <div className='mb-5'>
                    <a href="mailto:almadinatulilmia.fsd@dawateislami.net" className='btn-link hover:text-neutral'>Contact</a>
                </div>
                <button onClick={handleLogout} className="btn btn-wide btn-neutral font-sans">
                    Logout
                </button>
            </div>
        </div>
    );
};