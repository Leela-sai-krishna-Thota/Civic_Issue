import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// --- Custom marker icon ---
const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// --- Helper to update map view dynamically ---
const MapUpdater = ({ reports }) => {
  const map = useMap();

  useEffect(() => {
    const validReports = reports.filter(r => r.location && r.location.coordinates);

    if (validReports.length === 0) {
      map.flyTo([23.3441, 85.3096], 12);
      return;
    }

    const bounds = L.latLngBounds(validReports.map(r => [
      r.location.coordinates[1],
      r.location.coordinates[0]
    ]));

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [reports, map]);

  return null;
};

// --- Main Map Component ---
const MapView = ({ reports }) => {
  const defaultPosition = [23.3441, 85.3096];

  return (
    <div className="relative z-0 w-full h-[700px] md:h-[600px] sm:h-[500px] rounded-xl shadow-lg overflow-hidden">
      <MapContainer
        center={defaultPosition}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {reports && reports.map(report =>
          report.location && report.location.coordinates && (
            <Marker
              key={report._id}
              position={[report.location.coordinates[1], report.location.coordinates[0]]}
              icon={customMarkerIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h3 className="font-semibold">{report.title}</h3>
                  <p><strong>Category:</strong> {report.category}</p>
                  <p><strong>Status:</strong> {report.status}</p>
                </div>
              </Popup>
            </Marker>
          )
        )}

        <MapUpdater reports={reports} />
      </MapContainer>
    </div>
  );
};

export default MapView;
