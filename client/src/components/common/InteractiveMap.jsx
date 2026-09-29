import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default Leaflet icon paths in React bundle
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function InteractiveMap({ destinations = [], height = "400px", zoom = 5, center = [20.5937, 78.9629] }) {
  const validLocations = destinations.filter(d => d.latitude && d.longitude);

  const mapCenter = validLocations.length > 0 
    ? [Number(validLocations[0].latitude), Number(validLocations[0].longitude)] 
    : center;

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 z-10" style={{ height }}>
      <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validLocations.map((loc) => (
          <Marker key={loc.id} position={[Number(loc.latitude), Number(loc.longitude)]}>
            <Popup>
              <div className="p-1 max-w-xs space-y-1">
                {loc.image_url && <img src={loc.image_url} alt={loc.name} className="w-full h-24 object-cover rounded-xl mb-1" />}
                <h4 className="font-bold text-sm text-slate-900 m-0">{loc.name}</h4>
                <p className="text-[11px] text-slate-500 m-0">{loc.country_state}</p>
                <p className="text-xs font-bold text-teal-600 m-0">Budget: ${loc.estimated_budget}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
