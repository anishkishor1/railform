import React, { useState } from 'react';
import { Search, SearchX, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

const TrackStatus: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      setError('Please enter a tracking ID, email, or Aadhar number.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await api.get(`/track?query=${encodeURIComponent(query)}`);
      if (response.data.success) {
        setResult(response.data.application);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError('An error occurred while tracking the application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy-blue mb-2">Track Application Status</h2>
        <p className="text-slate-500">Enter your Application Number, Email ID, or ID Proof Number to check current status.</p>
      </div>

      <form onSubmit={handleTrack} className="mb-8 relative max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400" />
        </div>
        <input 
          type="text" 
          className="block w-full pl-10 pr-32 py-4 border border-slate-300 rounded-lg shadow-sm focus:ring-railway-blue focus:border-railway-blue" 
          placeholder="e.g. RLY-2026-8A3F9 or email@example.com"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 bg-navy-blue text-white px-6 rounded-md font-semibold hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[100px]"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Track'
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-200">
          <SearchX size={20} className="mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-200">
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-1">APPLICATION REF NUMBER</p>
              <h3 className="text-xl font-bold text-navy-blue font-mono">{result.application_no}</h3>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
              result.status === 'Approved' ? 'bg-green-100 text-green-700' : 
              result.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {result.status === 'Approved' ? <CheckCircle size={16} /> : <Clock size={16} />}
              {result.status}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Applicant Name</p>
              <p className="font-semibold text-slate-800">{result.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Pass Type</p>
              <p className="font-semibold text-slate-800">{result.pass_type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Route</p>
              <p className="font-semibold text-slate-800">{result.from_station} <span className="text-slate-400 mx-1">→</span> {result.to_station}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Duration</p>
              <p className="font-semibold text-slate-800">{result.duration}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Date Submitted</p>
              <p className="font-semibold text-slate-800">{new Date(result.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Fare Amount</p>
              <p className="font-semibold text-slate-800">₹{result.fare_amount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackStatus;
