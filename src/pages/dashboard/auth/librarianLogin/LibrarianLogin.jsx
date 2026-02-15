import { SquareLibrary, Eye, EyeOff, MailIcon, LockIcon, Loader } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '@/config/Firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

export const LibrarianLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/librarian-dashboard');
    }
  }, [user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
       await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Login successful!");
      navigate('/librarian-dashboard');
    } catch (error) {
      // console.error("Login error:", error);
      toast.error("LOGIN FAILED! Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
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
                  className="input input-bordered required w-full pl-10 pr-10 focus:input-neutral transition-all text-[16px]"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:shadow-neutral cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* یاد رکھیں اور پاس ورڈ بھول گئے */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <label className="label cursor-pointer gap-3">
                <input type="checkbox" className="checkbox checkbox-sm checkbox-neutral" />
                <span className="label-text">Remember me</span>
              </label>
              <Link to="#" className="text-sm font-semibold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-neutral w-full text-lg shadow-lg hover:shadow-neutral/20 transition-all normal-case"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : "Sign In"}
              </button>
            </div>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm text-base-content/60">
              Not a librarian?
              <Link to="/" className="text-primary font-bold ml-1 hover:underline">Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}