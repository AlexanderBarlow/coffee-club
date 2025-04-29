"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for missing default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: "/public/leaflet/marker-icon-red.png",
	iconRetinaUrl: "/leaflet/marker-icon-2x-red.png",
	shadowUrl: "/leaflet/marker-shadow.png",
});

export default function MapClientOnly({ lat, lng }) {
	return (
		<MapContainer
			center={[lat, lng]}
			zoom={16}
			style={{ height: "300px", width: "100%", borderRadius: "8px" }}
			scrollWheelZoom={false}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
			/>
			<Marker position={[lat, lng]}>
				<Popup>Pickup here!</Popup>
			</Marker>
		</MapContainer>
	);
}
