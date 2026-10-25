import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const DEFAULT_CENTER: [number, number] = [23.9015, 89.1205]; // Kushtia

const DESTINATIONS = [
  { id: 'dhaka', label: 'ঢাকা (Dhaka)', location: [23.8103, 90.4125] as [number, number] },
  { id: 'khulna', label: 'খুলনা (Khulna)', location: [22.8456, 89.5403] as [number, number] },
  { id: 'rajshahi', label: 'রাজশাহী (Rajshahi)', location: [24.3745, 88.6042] as [number, number] },
  { id: 'jashore', label: 'যশোর (Jashore)', location: [23.1664, 89.2081] as [number, number] }
];

const ALERT_ZONES = [
  { id: 'alert-1', label: 'চৌড়হাস মোড় ট্রাফিক', location: [23.8820, 89.1100] as [number, number], type: 'traffic', description: 'কুষ্টিয়া-ঝিনাইদহ মহাসড়ক সংযোগস্থল' },
  { id: 'alert-2', label: 'মজমপুর বাসস্ট্যান্ড', location: [23.9050, 89.1250] as [number, number], type: 'traffic', description: 'কেন্দ্রীয় বাস টার্মিনাল ও কোর্ট স্টেশন সংলগ্ন' }
];

// Custom Leaflet Icons
const createCustomIcon = (html: string) => L.divIcon({
  html,
  className: '', // Remove default leaflet styles
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const kushtiaIcon = createCustomIcon(`<div class="w-5 h-5 bg-emerald-600 border-2 border-white rounded-full shadow-lg"></div>`);
const alertIcon = createCustomIcon(`<div class="w-6 h-6 flex items-center justify-center bg-red-100 border-2 border-red-500 text-red-600 rounded-full shadow-md text-xs font-bold animate-pulse">!</div>`);

const getDestIcon = (label: string) => L.divIcon({
  html: `<div class="px-2.5 py-1 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg shadow-md whitespace-nowrap">${label}</div>`,
  className: '',
  iconAnchor: [20, 10]
});

export const TransportMapView: React.FC = () => {
  const [etas, setEtas] = useState<Record<string, string>>({});
  const [routes, setRoutes] = useState<Record<string, [number, number][]>>({});

  useEffect(() => {
    // Fetch routes from OSRM public API (Free, no API key required)
    DESTINATIONS.forEach(async (dest) => {
      try {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${DEFAULT_CENTER[1]},${DEFAULT_CENTER[0]};${dest.location[1]},${dest.location[0]}?overview=full&geometries=geojson`);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          
          // Format duration (seconds to hours and minutes)
          const hrs = Math.floor(route.duration / 3600);
          const mins = Math.floor((route.duration % 3600) / 60);
          const timeString = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
          setEtas(prev => ({...prev, [dest.id]: timeString}));
          
          // Format route coords [lng, lat] to [lat, lng] for Leaflet
          const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRoutes(prev => ({...prev, [dest.id]: coords}));
        }
      } catch (error) {
        console.error("OSRM Routing error: ", error);
      }
    });
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      {/* Map Container */}
      <div className="w-full h-[250px] md:h-[320px] rounded-2xl overflow-hidden relative border border-pink-200/80 shadow-xs flex-1">
        <MapContainer 
          center={DEFAULT_CENTER} 
          zoom={9} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Origin */}
          <Marker position={DEFAULT_CENTER} icon={kushtiaIcon}>
            <Popup className="font-bold">কুষ্টিয়া (Kushtia)</Popup>
          </Marker>

          {/* Destinations & Routes */}
          {DESTINATIONS.map(dest => (
            <React.Fragment key={dest.id}>
              <Marker position={dest.location} icon={getDestIcon(dest.label.split(' ')[0])}>
                <Popup className="font-bold">{dest.label}</Popup>
              </Marker>
              {routes[dest.id] && (
                <Polyline positions={routes[dest.id]} color="#059669" weight={4} opacity={0.7} />
              )}
            </React.Fragment>
          ))}

          {/* Alerts */}
          {ALERT_ZONES.map(alert => (
            <Marker key={alert.id} position={alert.location} icon={alertIcon}>
              <Popup>
                <div className="font-bold text-xs text-slate-800">{alert.label}</div>
                <div className="text-[10px] text-slate-600">{alert.description}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Info Panel (Positioned below map on mobile, side on desktop) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-200/80 text-xs md:w-64 shrink-0">
        <h3 className="font-bold text-slate-800 mb-3 border-b border-pink-100 pb-2">আনুমানিক ভ্রমণের সময়</h3>
        <div className="space-y-2.5">
          {DESTINATIONS.map(dest => (
             <div key={dest.id} className="flex justify-between items-center">
               <span className="text-slate-600 font-medium">{dest.label.split(' ')[0]}</span>
               <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">{etas[dest.id] || '...'}</span>
             </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-pink-100">
          <h4 className="font-bold text-slate-700 mb-2 text-[10px] uppercase tracking-wider">সতর্কতা জোন</h4>
          <div className="space-y-2">
            {ALERT_ZONES.map(alert => (
              <div key={alert.id} className="flex items-start gap-2">
                 <div className="w-4 h-4 bg-red-100 border border-red-500 text-red-600 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">!</div>
                 <div>
                   <div className="font-semibold text-slate-800 text-[11px]">{alert.label}</div>
                   <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{alert.description}</div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
