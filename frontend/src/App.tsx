import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ApplyForm from './components/ApplyForm';
import TrackStatus from './components/TrackStatus';
import RecordsList from './components/RecordsList';
import api from './services/api';

type Tab = 'apply' | 'track' | 'records';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('apply');
  const [dbStatus, setDbStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    // Check DB status on load
    const checkDb = async () => {
      try {
        const response = await api.get('/check_db');
        if (response.data.success) {
          setDbStatus('online');
        } else {
          setDbStatus('offline');
        }
      } catch (error) {
        setDbStatus('offline');
      }
    };
    checkDb();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300`}>
      <Header dbStatus={dbStatus} />
      
      <main className="max-w-6xl mx-auto mt-8 px-4 flex flex-col mb-12">
        {/* Tabs */}
        <div className="flex gap-3 bg-white p-2 rounded-xl shadow-md border border-slate-200 mb-6">
          <button 
            onClick={() => setActiveTab('apply')}
            className={`flex-1 py-3 px-5 rounded-lg font-semibold transition-all ${
              activeTab === 'apply' ? 'bg-slate-100 text-navy-blue shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-navy-blue'
            }`}
          >
            Apply Now
          </button>
          <button 
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 px-5 rounded-lg font-semibold transition-all ${
              activeTab === 'track' ? 'bg-slate-100 text-navy-blue shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-navy-blue'
            }`}
          >
            Track Status
          </button>
          <button 
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-3 px-5 rounded-lg font-semibold transition-all ${
              activeTab === 'records' ? 'bg-slate-100 text-navy-blue shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-navy-blue'
            }`}
          >
            Records
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
          {activeTab === 'apply' && <ApplyForm />}
          {activeTab === 'track' && <TrackStatus />}
          {activeTab === 'records' && <RecordsList />}
        </div>
      </main>
    </div>
  );
}

export default App;
