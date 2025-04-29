"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix icon issues with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
	iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function LeafletMap({ coords = [40.7128, -74.006] }) {
	return (
		<MapContainer
			center={coords}
			zoom={14}
			scrollWheelZoom={false}
			style={{ height: "300px", borderRadius: "10px" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Marker position={coords}>
				<Popup>Pickup Location</Popup>
			</Marker>
		</MapContainer>
	);
}
