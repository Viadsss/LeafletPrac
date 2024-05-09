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
      console.log([...markers, newMarker]);
    },
  });

  return null;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Earth's radius in kilometers

  // Convert latitude and longitude from degrees to radians
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  // Calculate the distance using the Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance; // Distance in kilometers
}

LocateSelf.propTypes = {
  markers: PropTypes.array.isRequired,
  setMarkers: PropTypes.func.isRequired,
};

ClickHandler.propTypes = {
  markers: PropTypes.array.isRequired,
  setMarkers: PropTypes.func.isRequired,
};

export { LocateSelf, ClickHandler, calculateDistance };
