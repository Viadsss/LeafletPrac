import { useState } from "react";
import RouteLine from "../components/RouteLine";
import axios from "axios";
import { ClickHandler, LocateSelf, createDistanceMatrix } from "../mapUtils";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import PropTypes from "prop-types";
import LocationModal from "../components/LocationModal";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";

const icon = new Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function CreateMap({ center, limit }) {
  const [markers, setMarkers] = useState([]);
  const [saveMarkers, setSaveMarkers] = useState(false);
  const [hasRoutesData, setHasRoutesData] = useState(false);
  const [routesData, setRoutesData] = useState([]);
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [error, setError] = useState(null);
  const [useLocation, setUseLocation] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const handleSaveMarkers = () => {
    setSaveMarkers(true);
  };

  const handleClearMarkers = () => {
    setSaveMarkers(false);
    setMarkers([]);
    setHasRoutesData(false);
    setRoutesData([]);
  };

  const handleProcessMarkers = async (markers) => {
    const startTime = performance.now();
    let flat = [];
    let routeDetails = [];

    for (let i = 0; i < markers.length; i++) {
      for (let j = 0; j < markers.length; j++) {
        if (i < j) {
          flat.push({ x: markers[i].geoCode, y: markers[j].geoCode });
          routeDetails.push({ src: i, dest: j });
        }
      }
    }

    const apiCalls = flat.map(async (pair, index) => {
      try {
        const url = "https://graphhopper.com/api/1/route";
        const query = {
          key: import.meta.env.VITE_GRASSHOPPER_API_KEY,
        };

        const payload = {
          points: [
            [pair.x[1], pair.x[0]],
            [pair.y[1], pair.y[0]],
          ],
          snap_preventions: ["motorway", "ferry", "tunnel"],
          details: ["road_class", "surface"],
          profile: "car",
          locale: "en",
          instructions: true,
          calc_points: true,
          points_encoded: false,
        };

        const response = await axios.post(url, payload, {
          headers: { "Content-Type": "application/json" },
          params: query,
        });

        const distance = response.data.paths[0].distance;
        const coordinates = response.data.paths[0].points.coordinates;
        const properCoords = coordinates.map((coord) => [coord[1], coord[0]]);
        const curRoute = routeDetails[index];

        return {
          distance,
          properCoords,
          src: curRoute.src,
          dest: curRoute.dest,
        };
      } catch (error) {
        throw new Error(
          `Unable to find a right route between Marker ${
            routeDetails[index].src + 1
          } and ${routeDetails[index].dest + 1}`
        );
      }
    });

    // Wait for all API calls to complete
    try {
      const results = await Promise.all(apiCalls);

      setRoutesData(results);
      setDistanceMatrix(createDistanceMatrix(results));

      console.log("Routes Data:", results);
      const endTime = performance.now();
      const duration = endTime - startTime;

      setHasRoutesData(true);
      console.log(`Time taken: ${duration}ms`);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      console.log("End of Loading");
    }
  };

  return (
    <>
      {showModal ? (
        <LocationModal
          setShowModal={setShowModal}
          setUseLocation={setUseLocation}
        />
      ) : (
        <div className="box">
          <MapContainer center={center} zoom={14}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker, index) => (
              <Marker position={marker.geoCode} icon={icon} key={index}>
                <Popup>{marker.popUp}</Popup>
              </Marker>
            ))}
            {hasRoutesData &&
              routesData.map((route, index) => (
                <RouteLine route={route} markers={markers} key={index} />
              ))}

            {useLocation ? (
              <LocateSelf markers={markers} setMarkers={setMarkers} />
            ) : null}

            {!saveMarkers && markers.length < limit ? (
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
            <div>
              <div style={{ color: "red" }}>{error}</div>
              <h3>Distance Matrix:</h3>
              <table className="matrix">
                <tbody>
                  {distanceMatrix.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((value, colIndex) => (
                        <td key={colIndex}>{value}m</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

CreateMap.propTypes = {
  center: PropTypes.array.isRequired,
  limit: PropTypes.number.isRequired,
};
