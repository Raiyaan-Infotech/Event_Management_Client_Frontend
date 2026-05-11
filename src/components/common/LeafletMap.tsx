"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  onLocationChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

function LocationMarker({ center, onLocationChange, readOnly }: { 
  center: [number, number], 
  onLocationChange?: (lat: number, lng: number) => void,
  readOnly?: boolean
}) {
  const [position, setPosition] = useState<L.LatLng>(L.latLng(center[0], center[1]));
  const map = useMap();

  useEffect(() => {
    setPosition(L.latLng(center[0], center[1]));
    map.flyTo(center, map.getZoom());
  }, [center, map]);

  useMapEvents({
    click(e) {
      if (!readOnly) {
        setPosition(e.latlng);
        onLocationChange?.(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function LeafletMap({ 
  center = [21.8207079, 76.3769531], 
  zoom = 13, 
  onLocationChange,
  readOnly = false
}: LeafletMapProps) {
  return (
    <div className="w-full h-full min-h-[400px] relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker center={center} onLocationChange={onLocationChange} readOnly={readOnly} />
      </MapContainer>
    </div>
  );
}
