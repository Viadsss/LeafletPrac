import { useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import PropTypes from "prop-types";

function LocateSelf({ markers, setMarkers }) {
  const map = useMapEvents({
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
      const newMarker = {
        geoCode: [e.latlng.lat, e.latlng.lng],
        popUp: `Marker ${markers.length + 1}`,
      };
      setMarkers([...markers, newMarker]);
      console.log([...markers, newMarker]);
    },
  });

  useEffect(() => {
    map.locate();

    return () => {};
  }, [map]);

  return null;
}

function ClickHandler({ markers, setMarkers }) {
  useMapEvents({
    click: (e) => {
      const newMarker = {
        geoCode: [e.latlng.lat, e.latlng.lng],
        popUp: `Marker ${markers.length + 1}`,
      };
      setMarkers([...markers, newMarker]);
    },
  });

  return null;
}

function createDistanceMatrix(routes) {
  const lastRoute = routes.length - 1;
  const lastRouteDest = routes[lastRoute].dest;
  const matrixSize = lastRouteDest + 1;

  // Initialize a matrix with zeros
  const matrix = Array.from(Array(matrixSize), () => Array(matrixSize).fill(0));

  routes.forEach((route) => {
    const { src, dest, distance } = route;
    matrix[src][dest] = distance;
    matrix[dest][src] = distance;
  });

  return matrix;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

LocateSelf.propTypes = {
  markers: PropTypes.array.isRequired,
  setMarkers: PropTypes.func.isRequired,
};

ClickHandler.propTypes = {
  markers: PropTypes.array.isRequired,
  setMarkers: PropTypes.func.isRequired,
};

export { LocateSelf, ClickHandler, createDistanceMatrix, getRandomColor };
