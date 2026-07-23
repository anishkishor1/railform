import { useEffect, useState } from 'react';
import api from '../services/api';
import { ServerCrash, Loader2, Train } from 'lucide-react';

const RecordsList: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get('/list');
        if (response.data.success) {
          setApplications(response.data.applications);
          setTotal(response.data.total);
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        setError('Failed to load application records from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-railway-blue" />
        <p>Loading application records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-500 bg-red-50 rounded-xl border border-red-100">
        <ServerCrash className="w-12 h-12 mb-3" />
        <h3 className="text-lg font-bold mb-1">Server Connection Failed</h3>
        <p className="text-red-400 max-w-md text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in overflow-hidden">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-blue mb-1">Recent Applications</h2>
          <p className="text-slate-500">Showing latest 50 submissions out of <span className="font-bold text-slate-700">{total}</span> total records.</p>
        </div>
        <div className="hidden sm:flex bg-blue-50 text-blue-700 px-4 py-2 rounded-lg items-center gap-2 font-semibold text-sm">
          <Train size={16} /> Total: {total}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
          <p className="text-slate-500 font-semibold">No applications found in the database yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-semibold">App No.</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Pass Type</th>
                <th className="p-4 font-semibold">Route</th>
                <th className="p-4 font-semibold">Class</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-medium text-navy-blue text-sm">{app.application_no}</td>
                  <td className="p-4 font-medium text-slate-800">{app.full_name}</td>
                  <td className="p-4 text-slate-600 text-sm truncate max-w-[150px]">{app.pass_type}</td>
                  <td className="p-4 text-slate-600 text-sm">{app.from_station} - {app.to_station}</td>
                  <td className="p-4 text-slate-600 text-sm">{app.travel_class}</td>
                  <td className="p-4 text-slate-500 text-sm">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                      app.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecordsList;
