import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { LocateSelf, ClickHandler } from "./mapUtils";
import { Icon } from "leaflet";
import MapIcon from "/Map-Marker.svg";

const customIcon = new Icon({
  iconUrl: MapIcon,
  iconSize: [30, 30],
});

function App() {
  const [markers, setMarkers] = useState([]);

  const handleMarkerAdd = (newMarker) => {
    setMarkers([...markers, newMarker]);
    console.log([...markers, newMarker]);
  };

  return (
    <div className="box">
      <MapContainer center={[14.676208, 121.043861]} zoom={14}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker position={marker.geoCode} icon={customIcon} key={index}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
        <LocateSelf markers={markers} onMarkerAdd={handleMarkerAdd} />
        <ClickHandler markers={markers} onMarkerAdd={handleMarkerAdd} />
      </MapContainer>
      <div>
        {markers.map((marker, index) => (
          <div key={index}>
            <h2>{marker.popUp}:</h2>
            <p>Latitude: {marker.geoCode[0]}</p>
            <p>Longitude: {marker.geoCode[1]}</p>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
