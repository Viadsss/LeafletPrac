import { useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import PropTypes from "prop-types";

function LocateSelf({ markers, onMarkerAdd }) {
  const map = useMapEvents({
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
      const newMarker = {
        geoCode: [e.latlng.lat, e.latlng.lng],
        popUp: `Marker ${markers.length + 1}`,
      };
      onMarkerAdd(newMarker);
    },
  });

  useEffect(() => {
    map.locate();

    return () => {};
  }, [map]);

  return null;
}

function ClickHandler({ markers, onMarkerAdd }) {
  useMapEvents({
    click: (e) => {
      const newMarker = {
        geoCode: [e.latlng.lat, e.latlng.lng],
        popUp: `Marker ${markers.length + 1}`,
      };
      onMarkerAdd(newMarker);
    },
  });

  return null;
}

LocateSelf.propTypes = {
  markers: PropTypes.array.isRequired,
  onMarkerAdd: PropTypes.func.isRequired,
};

ClickHandler.propTypes = {
  markers: PropTypes.array.isRequired,
  onMarkerAdd: PropTypes.func.isRequired,
};

export { LocateSelf, ClickHandler };
