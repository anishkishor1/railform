import React, { useState } from 'react';
import { Send, User, FileText, Map, IndianRupee, Train, QrCode, Info, Printer, X } from 'lucide-react';
import api from '../services/api';

const ApplyForm: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '', dob: '', gender: '', mobile: '', email: '', 
    id_proof_type: '', id_proof_no: '', institution: '', roll_no: '', course: '', 
    pass_type: '', from_station: '', to_station: '', travel_class: '', duration: '', fare_amount: ''
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateFare = () => {
    if (formData.pass_type && formData.duration && formData.travel_class) {
      let baseFare = formData.travel_class === 'First Class (1S)' ? 500 : 200;
      let multiplier = formData.duration === '1 Month' ? 1 : formData.duration === '3 Months' ? 2.5 : 4.5;
      let discount = formData.pass_type.includes('50%') ? 0.5 : 1;
      setFormData(prev => ({ ...prev, fare_amount: (baseFare * multiplier * discount).toFixed(2) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/submit', formData);
      if (response.data.success) {
        setSuccessData(response.data.data || {
          application_no: response.data.application_no,
          ...formData,
          status: 'Under Review'
        });
        setIsDemo(false);
        setFormData({
          full_name: '', dob: '', gender: '', mobile: '', email: '', 
          id_proof_type: '', id_proof_no: '', institution: '', roll_no: '', course: '', 
          pass_type: '', from_station: '', to_station: '', travel_class: '', duration: '', fare_amount: ''
        });
      } else {
        setError(response.data.message || 'Failed to submit application.');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to reach backend server (' + (import.meta.env.VITE_API_URL || 'Railway API') + '). Application was not saved to database.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in relative">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-blue mb-2">New Pass Application</h2>
        <p className="text-slate-500">Fill out all the required details below to apply for a student or commuter railway pass.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 font-medium">
          {error}
        </div>
      )}

      {/* Concession Slip Modal */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold font-outfit flex items-center gap-2">
                  <Train size={24} /> INDIAN RAILWAYS CONCESSION SLIP
                </h3>
                <p className="text-blue-200 text-sm mt-1">Official Application Acknowledgement Receipt</p>
              </div>
              <button onClick={() => setSuccessData(null)} className="text-white hover:text-red-300 transition-colors">
                <X size={28} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 overflow-y-auto">
              <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-6 relative">
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold text-railway-blue uppercase tracking-wider">Reference Number</span>
                    <h2 className="text-2xl font-bold text-navy-blue font-mono mt-1">{successData.application_no}</h2>
                  </div>
                  <div className="text-navy-blue opacity-80">
                    <QrCode size={48} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-blue-100 pb-2">
                    <span className="text-sm font-semibold text-slate-500">Applicant Name:</span>
                    <span className="text-sm font-bold text-slate-800">{successData.full_name}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-blue-100 pb-2">
                    <span className="text-sm font-semibold text-slate-500">Concession Type:</span>
                    <span className="text-sm font-bold text-slate-800">{successData.pass_type}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-blue-100 pb-2">
                    <span className="text-sm font-semibold text-slate-500">Route:</span>
                    <span className="text-sm font-bold text-slate-800">{successData.from_station} to {successData.to_station}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-blue-100 pb-2">
                    <span className="text-sm font-semibold text-slate-500">Class & Validity:</span>
                    <span className="text-sm font-bold text-slate-800">{successData.travel_class} ({successData.duration})</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-blue-100 pb-2">
                    <span className="text-sm font-semibold text-slate-500">Payable Amount:</span>
                    <span className="text-sm font-bold text-green-700">₹{successData.fare_amount}</span>
                  </div>
                  <div className="flex justify-between items-end pb-2">
                    <span className="text-sm font-semibold text-slate-500">Current Status:</span>
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase">
                      {successData.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 text-center justify-center">
                <Info size={16} /> 
                <p>Present this reference acknowledgement along with your student ID at the Railway Concession Counter.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button 
                onClick={() => setSuccessData(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-2.5 bg-navy-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors flex justify-center items-center gap-2"
              >
                <Printer size={18} /> Print Concession Slip
              </button>
            </div>

            {/* Demo Notice */}
            {isDemo && (
              <div className="absolute bottom-4 right-4 bg-slate-900 text-white text-xs px-4 py-2 rounded flex items-center gap-2 shadow-lg z-50">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                Backend offline. Generating local preview pass.
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-navy-blue font-semibold border-b border-slate-200 pb-2">
            <User size={18} /> <h3>1. Personal Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
              <input required type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-railway-blue focus:border-railway-blue outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-railway-blue outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Gender *</label>
              <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-railway-blue outline-none">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number *</label>
              <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-railway-blue outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-railway-blue outline-none" />
            </div>
          </div>
        </div>

        {/* Identity & Institution */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-navy-blue font-semibold border-b border-slate-200 pb-2">
            <FileText size={18} /> <h3>2. Identity & Institution</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">ID Proof Type *</label>
              <select required name="id_proof_type" value={formData.id_proof_type} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-railway-blue outline-none">
                <option value="">Select ID Type</option>
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="College ID">College ID</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">ID Proof Number *</label>
              <input required type="text" name="id_proof_no" value={formData.id_proof_no} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-railway-blue outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Institution/Company Name *</label>
              <input required type="text" name="institution" value={formData.institution} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-railway-blue outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Roll No / Emp ID *</label>
              <input required type="text" name="roll_no" value={formData.roll_no} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-railway-blue outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Course / Designation *</label>
              <input required type="text" name="course" value={formData.course} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-railway-blue outline-none" />
            </div>
          </div>
        </div>

        {/* Travel Details */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-navy-blue font-semibold border-b border-slate-200 pb-2">
            <Map size={18} /> <h3>3. Travel Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Pass Type *</label>
              <select required name="pass_type" value={formData.pass_type} onChange={handleChange} onBlur={calculateFare} className="w-full p-3 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-railway-blue outline-none">
                <option value="">Select Pass Type</option>
                <option value="Student Concession (50%)">Student Concession (50%)</option>
                <option value="General Monthly Pass">General Monthly Pass</option>
              </select>
            </div>
            <div className="hidden md:block"></div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">From Station *</label>
              <input required type="text" name="from_station" value={formData.from_station} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-railway-blue outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">To Station *</label>
              <input required type="text" name="to_station" value={formData.to_station} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-railway-blue outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Travel Class *</label>
              <select required name="travel_class" value={formData.travel_class} onChange={handleChange} onBlur={calculateFare} className="w-full p-3 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-railway-blue outline-none">
                <option value="">Select Class</option>
                <option value="Second Class (2S)">Second Class (2S)</option>
                <option value="First Class (1S)">First Class (1S)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Duration *</label>
              <select required name="duration" value={formData.duration} onChange={handleChange} onBlur={calculateFare} className="w-full p-3 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-railway-blue outline-none">
                <option value="">Select Duration</option>
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fare Estimate */}
        <div className="flex items-center justify-between p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3 text-blue-900 font-semibold">
            <IndianRupee size={24} />
            <span className="text-lg">Estimated Fare</span>
          </div>
          <div className="text-3xl font-bold text-navy-blue">
            ₹{formData.fare_amount || '0.00'}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-accent-gold hover:bg-accent-gold-hover text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send size={20} />}
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyForm;
