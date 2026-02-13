
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onLoginSuccess: (role: 'admin' | 'student') => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'> (initialMode === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [adminKey, setAdminKey] = useState(''); // Secret key for admin registration
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        // If registering with an admin key, they become admin
        const isAdmin = adminKey === 'K26-ADMIN-SECRET'; // In production, this would be more complex
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        const role = isAdmin ? 'admin' : 'student';
        
        // Store user role in database
        await set(ref(db, `users/${userCredential.user.uid}`), {
          name,
          email,
          role,
          createdAt: new Date().toISOString()
        });
        
        onLoginSuccess(role);
      } else {
        // Both 'login' and 'admin' modes use this logic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Fetch role from database
        const userRef = ref(db, `users/${userCredential.user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        
        const role = userData?.role || 'student';
        
        if (mode === 'admin' && role !== 'admin') {
          setError('Access Denied: You do not have administrator privileges.');
          setLoading(false);
          return;
        }
        
        onLoginSuccess(role);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full p-8 md:p-12 bg-white/5 border border-white/10 rounded-[48px] backdrop-blur-xl relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-600/10 rounded-full blur-[80px]" />

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center">
              {mode === 'admin' ? <ShieldCheck size={32} /> : mode === 'register' ? <UserPlus size={32} /> : <LogIn size={32} />}
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black font-space uppercase tracking-tight">
              {mode === 'admin' ? 'Admin Access' : mode === 'register' ? 'Join the Fest' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400 mt-2 text-sm font-medium">
              {mode === 'admin' ? 'Management credentials required' : mode === 'register' ? 'Create your student account' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                required
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                required
                type="password" 
                placeholder="Password" 
                className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === 'register' && (
              <div className="pt-2">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-4 mb-2">Have an Admin Key? (Optional)</p>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter Secret Key for Admin Privileges" 
                    className="w-full pl-12 pr-6 py-4 bg-red-600/5 border border-red-600/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white text-sm placeholder:text-red-900/40"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (
                <>
                  {mode === 'register' ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            {mode === 'admin' && (
              <div className="p-4 bg-red-600/5 border border-red-600/10 rounded-2xl text-[10px] text-gray-500 font-medium">
                <p className="text-red-500 font-black mb-1 uppercase tracking-widest">Demo Admin Setup:</p>
                <p>Register as a student using the email <span className="text-white">admin@kaushalam.com</span> and use the secret key <span className="text-white font-bold">K26-ADMIN-SECRET</span> to gain admin access.</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {mode !== 'login' && (
                <button 
                  onClick={() => setMode('login')}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white text-xs font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                  Student Login
                </button>
              )}
              {mode !== 'register' && (
                <button 
                  onClick={() => setMode('register')}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white text-xs font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                  Student Registration
                </button>
              )}
              {mode !== 'admin' && (
                <button 
                  onClick={() => setMode('admin')}
                  className="w-full py-3 bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-black rounded-xl hover:bg-red-600/20 transition-all uppercase tracking-widest"
                >
                  Admin Portal
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
