import { SquareLibrary, Eye, EyeOff, MailIcon, LockIcon, Loader, User, MailCheck } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, firestore } from '@/config/Firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import toast from 'react-hot-toast'

export const ReaderRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create user with Firebase Authentication 
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // 2. Add reader request to Firestore for librarian approval
      await addDoc(collection(firestore, 'readerRequests'), {
        name: formData.fullName,
        email: formData.email,
        status: 'pending',
        createdAt: new Date()
      });

      // 3. If registration is successful, log out the user immediately (since they need approval)
      await auth.signOut();

      setRegistered(true);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already registered!");
      } else {
        toast.error("Registration failed! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // After Registration waiting message
  if (registered) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center bg-base-100 p-10 rounded-3xl border border-base-300 shadow-sm zain-light">
          <div className="flex justify-center mb-6">
            <div className="bg-neutral/10 p-4 rounded-full">
              <MailCheck className="w-12 h-12 text-neutral" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral mb-3 font-sans">Request Submitted!</h2>
          <p className="text-base-content/60 mb-6 leading-relaxed">
            آپ کی درخواست موصول ہوگئی ہے۔ لائبریرین آپ کی درخواست کا جائزہ لے رہے ہیں۔
            <br /><br />
            <span className="font-semibold text-neutral">ہم جلد آپ سے رابطہ کریں گے۔</span>
          </p>
          <Link to="/login" className="btn btn-neutral btn-wide font-sans">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center content-center p-4 overflow-hidden">
      <div className="w-full max-w-md my-auto">
        <div className="bg-base-100 p-6 sm:p-10 rounded-3xl border border-base-300 shadow-sm">
          <div className="text-center mb-10">
            <Link to='/'>
              <div className='flex items-center justify-center gap-3 group mb-4 font-sans'>
                <div className="bg-neutral p-1 rounded-xl shadow-lg group-hover:bg-[#457b9d] transition-all duration-300">
                  <SquareLibrary className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <span className='text-2xl sm:text-3xl font-bold text-neutral group-hover:text-[#457b9d] transition-colors'>
                  IRC Library
                </span>
              </div>
            </Link>
            <p className="text-base-content/50 text-sm font-sans">Register to access the library</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/40 z-10" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  className="input input-bordered w-full pl-10 focus:input-neutral transition-all text-[16px]"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-base-content/40 z-10" />
                </div>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered w-full pl-10 focus:input-neutral transition-all text-[16px]"
                  placeholder='example@gmail.com'
                  onFocus={(e) => e.target.placeholder = "Enter an active email address"}
                  onBlur={(e) => e.target.placeholder = "example@gmail.com"}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-base-content/40 z-10" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input input-bordered w-full pl-10 pr-10 focus:input-neutral transition-all text-[16px]"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-neutral w-full text-lg shadow-lg transition-all normal-case"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Register"}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-base-content/60 font-sans">
              Already have access?{" "}
              <Link to="/login" className="text-neutral font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}