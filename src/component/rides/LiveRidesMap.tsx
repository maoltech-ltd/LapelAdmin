'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LiveRideLocation } from '../../../lib/api/services/liveLocationService';

// Default Leaflet marker icons reference image URLs that don't resolve under
// Next.js's bundler; point them at the CDN-hosted assets instead.
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER: [number, number] = [6.5244, 3.3792]; // Lagos, as a reasonable default

export default function LiveRidesMap({ rides }: { rides: LiveRideLocation[] }) {
  const center: [number, number] =
    rides.length > 0 ? [rides[0].lat, rides[0].lng] : DEFAULT_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      style={{ height: '520px', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {rides.map((ride) => (
        <Marker key={ride.orderId} position={[ride.lat, ride.lng]} icon={markerIcon}>
          <Popup>
            <div className="space-y-1 text-sm">
              <div className="font-semibold">Order {ride.orderId}</div>
              {ride.driverName && <div>Driver: {ride.driverName}</div>}
              {ride.passengerName && <div>Passenger: {ride.passengerName}</div>}
              {ride.updatedAt && (
                <div className="text-xs text-slate-500">
                  Updated: {new Date(ride.updatedAt).toLocaleTimeString()}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
