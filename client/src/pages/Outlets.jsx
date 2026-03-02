import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet default icons
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const stores = [
  {
    id: 1,
    name: "MENSFASHION Dhanmondi",
    address: "House - 12, Road - 27, Dhanmondi, Dhaka",
    tel: "+88 02 9123456",
    hours: "10am - 9pm",
    position: [23.7509, 90.3754],
  },
  {
    id: 2,
    name: "MENSFASHION Banani",
    address: "Block - E, Road - 11, Banani, Dhaka",
    tel: "+88 02 9876543",
    hours: "10am - 10pm",
    position: [23.7937, 90.4066],
  },
  {
    id: 3,
    name: "MENSFASHION Uttara",
    address: "Sector - 3, Jashimuddin Avenue, Uttara, Dhaka",
    tel: "+88 02 5566778",
    hours: "11am - 8pm",
    position: [23.8728, 90.3907],
  },
];

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

export const Outlets = () => {
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen w-full overflow-hidden">
      {/* Sidebar Section */}
      <div className="sidebar w-full md:w-[350px] h-[40vh] md:h-full border-t md:border-t-0 md:border-r border-gray-300 overflow-y-auto bg-white z-10">
        <div className="p-[15px] border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="m-0 text-[18px] font-bold">MENSFASHION</h2>
          <p className="text-gray-400 text-[12px] mt-[5px]">
            {stores.length} Stores Found
          </p>
        </div>

        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => setSelectedStore(store)}
            className={`p-[15px] border-b border-gray-100 cursor-pointer transition-all 
              ${
                selectedStore.id === store.id
                  ? "bg-gray-50 border-l-[5px] border-l-[#ff4500]"
                  : "bg-white border-l-[5px] border-l-transparent"
              }`}
          >
            <h3 className="m-0 mb-[5px] text-[15px]! font-semibold">
              {store.name}
            </h3>
            <p className="text-[12px] text-gray-600 my-[2px]">
              {store.address}
            </p>
            <p className="text-[12px] text-gray-500">
              <strong className="font-bold">Tel:</strong> {store.tel}
            </p>
          </div>
        ))}
      </div>

      {/* Map Section */}
      <div className="map-wrapper flex-1 h-[60vh] md:h-full relative">
        <MapContainer
          center={selectedStore.position}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ChangeView center={selectedStore.position} />
          {stores.map((store) => (
            <Marker
              key={store.id}
              position={store.position}
              eventHandlers={{ click: () => setSelectedStore(store) }}
            >
              <Popup>
                <div className="text-[12px]">
                  <strong className="block mb-1">{store.name}</strong>
                  <p className="m-0 text-gray-700">{store.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
