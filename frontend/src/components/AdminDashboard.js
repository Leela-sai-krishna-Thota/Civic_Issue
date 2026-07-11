import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import ImageModal from './ImageModal';
import ReportDetailModal from './ReportDetailModal';
import Spinner from './Spinner';
import { 
  FaRegBuilding, 
  FaUserCheck, 
  FaTags, 
  FaExclamationTriangle, 
  FaClipboardList,
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// --- Worker Creation Form ---
const CreateWorkerForm = ({ onFormClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [assignedCategory, setAssignedCategory] = useState('Pothole');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !assignedCategory) {
      toast.error('Please fill out all fields.');
      return;
    }
    const toastId = toast.loading('Creating worker account...');
    try {
      await API.post('/auth/worker', { name, email, password, assignedCategory });
      toast.success('Worker created successfully!', { id: toastId });
      setName('');
      setEmail('');
      setPassword('');
      setAssignedCategory('Pothole');
      onFormClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create worker.', { id: toastId });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-6 animate-fadeIn max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><FaUserPlus /> Register New Worker</h2>
        <button onClick={onFormClose} className="text-gray-500 hover:text-gray-700" aria-label="Close form">
          <FaTimes />
        </button>
      </div>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Worker's Name</label>
          <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
            <span className="px-3 text-gray-400"><FaUser /></span>
            <input 
              type="text"
              placeholder="e.g., Ravi Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full py-2 px-2 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Worker's Email</label>
          <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
            <span className="px-3 text-gray-400"><FaEnvelope /></span>
            <input 
              type="email"
              placeholder="worker-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full py-2 px-2 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Temporary Password</label>
          <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
            <span className="px-3 text-gray-400"><FaLock /></span>
            <input 
              type="password"
              placeholder="Create a strong temporary password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full py-2 px-2 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Assigned Category</label>
          <select 
            value={assignedCategory} 
            onChange={(e) => setAssignedCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="Pothole">Pothole</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Trash">Trash</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors font-semibold">
          Create Worker Account
        </button>
      </form>
    </div>
  );
};

// --- Admin Dashboard ---
const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showCreateWorkerForm, setShowCreateWorkerForm] = useState(false);
  const navigate = useNavigate();

  const fetchReports = useCallback(async () => {
    try {
      const { data } = await API.get('/reports');
      setReports(data);
    } catch (error) { 
      toast.error('Failed to fetch reports.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchReports();
  }, [fetchReports]);

  const handleStatusChange = async (id, status) => {
    const toastId = toast.loading('Updating status...');
    try {
      await API.put(`/reports/${id}`, { status });
      toast.success('Status updated successfully!', { id: toastId });
      fetchReports();
      setSelectedReport(prev => prev && prev._id === id ? { ...prev, status } : prev);
    } catch (error) { 
      toast.error('Failed to update status.', { id: toastId });
    }
  };

  const filteredReports = reports.filter(report => filter === 'All' || report.status === filter);

  return (
    <div className="bg-gray-100 min-h-screen px-6 sm:px-16 lg:px-24 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Administrator Dashboard</h1>
          {!showCreateWorkerForm && (
            <button 
              className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors font-semibold"
              onClick={() => setShowCreateWorkerForm(true)}
            >
              <FaUserPlus className="mr-2" /> Create Worker Account
            </button>
          )}
        </div>

        {showCreateWorkerForm && <CreateWorkerForm onFormClose={() => setShowCreateWorkerForm(false)} />}

        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
            <h2 className="text-2xl font-semibold mb-2 md:mb-0">All Submitted Reports</h2>
            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-medium">Filter by status:</label>
              <select 
                onChange={(e) => setFilter(e.target.value)} 
                className="border border-gray-300 rounded-md py-1 px-2 outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="All">All</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <>
              <MapView reports={filteredReports} />

              {filteredReports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {filteredReports.map((report) => (
                    <div key={report._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between">
                      <div>
                        {report.photo && (
                          <img 
                            src={report.photo} 
                            alt={report.title} 
                            className="w-full h-40 object-cover cursor-pointer"
                            onClick={() => setSelectedReport(report)}
                          />
                        )}
                        <div className="p-3 space-y-1">
                          <h3 className="text-lg font-semibold truncate cursor-pointer hover:text-orange-600 transition-colors" onClick={() => setSelectedReport(report)}>{report.title}</h3>
                          <p className="flex items-center gap-1 text-gray-700 text-sm">
                            <FaTags className="text-orange-500" /> <span className="font-medium">Category:</span> {report.category}
                          </p>
                          <p className="flex items-center gap-1 text-gray-700 text-sm">
                            <FaUserCheck className="text-green-500" /> <span className="font-medium">Submitted By:</span> {report.submittedBy.name}
                          </p>
                          <p className="flex items-center gap-1 text-gray-700 text-sm">
                            <FaRegBuilding className="text-blue-500" /> <span className="font-medium">Assigned To:</span> {report.assignedTo}
                          </p>
                          <p className="flex items-center gap-1 text-gray-700 text-sm">
                            <FaExclamationTriangle className="text-red-500" /> <span className="font-medium">Status:</span> 
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-white text-xs font-semibold
                              ${report.status === 'Submitted' ? 'bg-gray-500' : report.status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-600'}`}>
                              {report.status}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 border-t border-gray-200 flex items-center justify-between gap-2 bg-gray-50">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded-md font-semibold transition"
                        >
                          View Details & Map
                        </button>
                        <select 
                          value={report.status} 
                          onChange={(e) => handleStatusChange(report._id, e.target.value)}
                          className="border border-gray-300 rounded-md py-1 px-2 outline-none text-xs focus:ring-2 focus:ring-orange-500 max-w-[125px] bg-white"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center mt-10 text-gray-500">
                  <FaClipboardList className="text-6xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">No Reports Found</h3>
                  <p>There are no reports matching the current filter.</p>
                </div>
              )}
            </>
          )}
        </div>

        <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
        {selectedReport && (
          <ReportDetailModal 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
