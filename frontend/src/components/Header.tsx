import React from 'react';
import { Train, ShieldCheck, AlertCircle } from 'lucide-react';

interface HeaderProps {
  dbStatus: 'online' | 'offline' | 'checking';
}

const Header: React.FC<HeaderProps> = ({ dbStatus }) => {
  return (
    <>
      <div className="bg-[#09122c] text-slate-400 py-2 px-6 text-sm flex justify-between items-center border-b border-white/10">
        <div>
          <span className="font-semibold text-white">Government of India</span> | Ministry of Railways
        </div>
        <div className="hidden md:flex gap-4">
          <a href="#" className="hover:text-accent-gold transition-colors">Skip to Main Content</a>
          <a href="#" className="hover:text-accent-gold transition-colors">Screen Reader Access</a>
          <a href="#" className="hover:text-accent-gold transition-colors">A- A A+</a>
          <a href="#" className="hover:text-accent-gold transition-colors">English</a>
        </div>
      </div>

      <header className="bg-gradient-to-br from-primary-dark to-navy-blue text-white py-5 px-8 shadow-md relative">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent-gold to-accent-gold-hover flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <Train size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-outfit tracking-wide">Railway Concession Portal</h1>
              <p className="text-blue-300 text-sm">Student & Commuter E-Pass Application System</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 flex items-center gap-2 text-sm">
            {dbStatus === 'online' && (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-success-green shadow-[0_0_8px_#10b981]" />
                <span>DB Connected</span>
                <ShieldCheck size={16} className="text-success-green ml-1" />
              </>
            )}
            {dbStatus === 'offline' && (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-danger-red shadow-[0_0_8px_#ef4444]" />
                <span>DB Offline</span>
                <AlertCircle size={16} className="text-danger-red ml-1" />
              </>
            )}
            {dbStatus === 'checking' && (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_#facc15]" />
                <span>Connecting...</span>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
