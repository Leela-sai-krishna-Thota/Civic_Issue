import React, { useEffect } from 'react';
import { FaTimes, FaTags, FaUserCheck, FaRegBuilding, FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
  return null;
};

const ReportDetailModal = ({ report, onClose, onStatusChange }) => {
  if (!report) return null;

  const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const hasCoords = report.location && report.location.coordinates;
  const lat = hasCoords ? report.location.coordinates[1] : 23.3441;
  const lng = hasCoords ? report.location.coordinates[0] : 85.3096;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh] md:max-h-[85vh] animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 min-h-[250px] md:min-h-0">
          {report.photo ? (
            <img 
              src={report.photo} 
              alt={report.title} 
              className="w-full h-full object-contain max-h-[40vh] md:max-h-full"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-2 p-6">
              <span className="text-6xl">📸</span>
              <p className="font-semibold">No Image Uploaded</p>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-full">
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider
              ${report.status === 'Submitted' ? 'bg-gray-500' : report.status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-600'}`}>
              {report.status}
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">{report.title}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <FaTags className="text-orange-500" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Category</p>
                <p className="font-medium">{report.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaUserCheck className="text-green-500" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Submitted By</p>
                <p className="font-medium">{report.submittedBy?.name || 'Citizen'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaRegBuilding className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Assigned To</p>
                <p className="font-medium">{report.assignedTo || 'Unassigned'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-purple-500" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Date</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <h4 className="text-sm font-semibold text-gray-800 mb-1">Description</h4>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
              {report.description}
            </p>
          </div>

          {hasCoords && (
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                <FaMapMarkerAlt className="text-red-500" /> Map Location
              </h4>
              <div className="h-44 w-full rounded-xl overflow-hidden border border-gray-300 relative z-0">
                <MapContainer
                  center={[lat, lng]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[lat, lng]} icon={customMarkerIcon}>
                    <Popup>
                      <div className="text-xs">
                        <strong>{report.title}</strong>
                        <p>{report.category}</p>
                      </div>
                    </Popup>
                  </Marker>
                  <MapResizer />
                </MapContainer>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Coords: Lat {lat.toFixed(6)}, Lng {lng.toFixed(6)}</p>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Report Status:</label>
            <select
              value={report.status}
              onChange={(e) => onStatusChange(report._id, e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="Submitted">Submitted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
