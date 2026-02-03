import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Maximize2, Minimize2, Users, Navigation, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'worker' | 'establishment' | 'department';
  status?: 'online' | 'offline' | 'checked-in' | 'checked-out';
  lastUpdate?: Date;
  accuracy?: number;
  totalWorkers?: number;
  presentWorkers?: number;
}

interface LocationMapProps {
  locations: LocationData[];
  center?: { latitude: number; longitude: number };
  zoom?: number;
  height?: string;
  showControls?: boolean;
  onLocationClick?: (location: LocationData) => void;
}

// Component to handle map center updates
const ChangeView = ({ center, zoom }: { center: { lat: number, lng: number }, zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const LocationMap: React.FC<LocationMapProps> = ({
  locations,
  center,
  zoom = 10, // Zoomed out to show district/state boundaries better
  height = '600px',
  showControls = true,
  onLocationClick
}) => {
  const { t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Default to Amaravati
  const defaultCenter = center || { latitude: 16.5062, longitude: 80.6480 };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getMarkerColor = (location: LocationData) => {
    switch (location.type) {
      case 'worker':
        return location.status === 'checked-in' ? '#10b981' : '#6b7280';
      case 'establishment':
        return '#f59e0b'; // Amber
      case 'department':
        return '#3b82f6'; // Blue
      default:
        return '#6b7280';
    }
  };

  const createCustomIcon = (location: LocationData) => {
    const color = getMarkerColor(location);
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
      popupAnchor: [0, -6]
    });
  };

  const getStatusText = (location: LocationData) => {
    if (location.type === 'worker') {
      switch (location.status) {
        case 'checked-in': return t('worker.checkedIn');
        case 'checked-out': return t('worker.checkedOut');
        case 'online': return t('common.online');
        case 'offline': return t('common.offline');
        default: return t('status.unknown');
      }
    }
    return location.status || t('status.active');
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      <div className="card-mobile h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {t('department.locationMap')} (Andhra Pradesh)
            </h3>
          </div>

          {showControls && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{locations.length}</span>
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div
          className="relative rounded-lg border border-gray-200 overflow-hidden flex-grow"
          style={{ height: isFullscreen ? 'calc(100vh - 80px)' : height }}
        >
          <MapContainer
            center={[defaultCenter.latitude, defaultCenter.longitude]}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            attributionControl={false}
          >
            <ChangeView center={{ lat: defaultCenter.latitude, lng: defaultCenter.longitude }} zoom={zoom} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Locations */}
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                icon={createCustomIcon(location)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-sm">{location.name}</h4>
                      {/* {location.type === 'establishment' && <Building2 className="h-4 w-4 text-gray-500" />} */}
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-gray-600 flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium text-gray-900">{getStatusText(location)}</span>
                      </p>

                      {location.totalWorkers !== undefined && (
                        <p className="text-gray-600 flex justify-between">
                          <span>Total Workers:</span>
                          <span className="font-bold text-blue-600">{location.totalWorkers}</span>
                        </p>
                      )}

                      {location.presentWorkers !== undefined && (
                        <p className="text-gray-600 flex justify-between">
                          <span>Present:</span>
                          <span className="font-bold text-green-600">{location.presentWorkers}</span>
                        </p>
                      )}

                      <div className="pt-2 mt-2 border-t border-gray-100">
                        <button
                          onClick={() => onLocationClick && onLocationClick(location)}
                          className="w-full py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-md border border-gray-200 text-xs backdrop-blur-sm z-[1000]">
            <h4 className="font-medium text-gray-700 mb-2">Legend</h4>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: '#10b981' }}></div>
                <span>{t('worker.checkedIn')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: '#6b7280' }}></div>
                <span>{t('worker.checkedOut')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>{t('establishment.establishment')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>{t('department.department')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;