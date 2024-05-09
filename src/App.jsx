import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { LocateSelf, ClickHandler, calculateDistance } from "./mapUtils";
import { Icon } from "leaflet";
import MapIcon from "/Map-Marker.svg";

const customIcon = new Icon({
  iconUrl: MapIcon,
  iconSize: [30, 30],
});

function App() {
  const [markers, setMarkers] = useState([]);
  const [saveMarkers, setSaveMarkers] = useState(false);
  const [polyLines, setPolylines] = useState([]);
  const [adjMatrix, setAdjMatrix] = useState([]);

  const handleSaveMarkers = () => {
    setSaveMarkers(true);
  };

  const handleClearMarkers = () => {
    setSaveMarkers(false);
    setMarkers([]);
    setPolylines([]);
  };

  const handleProcessMarkers = (markers) => {
    let lines = [];
    let matrix = [];
    const len = markers.length;

    // For PolyLines
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        lines.push([markers[i].geoCode, markers[j].geoCode]);
      }
    }

    // For Adjacency Matrix
    for (let i = 0; i < markers.length; i++) {
      let rows = [];
      for (let j = 0; j < markers.length; j++) {
        if (i > j) {
          rows.push(matrix[j][i]); // Mirror the value
        } else {
          const lat1 = markers[i].geoCode[0];
          const lng1 = markers[i].geoCode[1];
          const lat2 = markers[j].geoCode[0];
          const lng2 = markers[j].geoCode[1];
          const distance = calculateDistance(lat1, lng1, lat2, lng2);
          rows.push(i === j ? 0 : distance);
        }
      }
      matrix.push(rows);
    }

    setPolylines(lines);
    setAdjMatrix(matrix);
    console.log(lines);
    console.log(matrix);
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
        <Polyline positions={polyLines} weight={4} color="blue" />
        <LocateSelf markers={markers} setMarkers={setMarkers} />
        {!saveMarkers && markers.length < 10 ? (
          <ClickHandler markers={markers} setMarkers={setMarkers} />
        ) : null}
      </MapContainer>
      <div>
        <button onClick={handleSaveMarkers} disabled={markers.length < 2}>
          Save Markers
        </button>
        <button onClick={handleClearMarkers}>Clear Markers</button>
        <button
          onClick={() => handleProcessMarkers(markers)}
          disabled={!saveMarkers}
        >
          Process Markers
        </button>
        {markers.map((marker, index) => (
          <div key={index}>
            <h2>{marker.popUp}:</h2>
            <p>Latitude: {marker.geoCode[0]}</p>
            <p>Longitude: {marker.geoCode[1]}</p>
            <br />
          </div>
        ))}
        <div>
          <h3>Distance Matrix:</h3>
          <table className="matrix">
            <tbody>
              {adjMatrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((value, colIndex) => (
                    <td key={colIndex}>{value.toFixed(3)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
