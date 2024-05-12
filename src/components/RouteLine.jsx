import { getRandomColor } from "../mapUtils";
import { Polyline, Popup } from "react-leaflet";
import PropTypes from "prop-types";

export default function RouteLine({ route, markers }) {
  return (
    <>
      <Polyline
        positions={route.properCoords}
        weight={4}
        color={getRandomColor()}
      >
        <Popup>
          Marker {route.src + 1} to Marker {route.dest + 1}
          <br />
          Distance: {route.distance}
        </Popup>
      </Polyline>

      {/* Dashed Polyline from Marker X to its first route coordinate */}
      <Polyline
        positions={[markers[route.src].geoCode, route.properCoords[0]]}
        color="green"
        dashArray="5, 5"
      />

      {/* Dashed Polyline from last route coordinate to Marker Y */}
      <Polyline
        positions={[
          route.properCoords[route.properCoords.length - 1],
          markers[route.dest].geoCode,
        ]}
        color="green"
        dashArray="5, 5"
      />
    </>
  );
}

RouteLine.propTypes = {
  route: PropTypes.shape({
    properCoords: PropTypes.array.isRequired,
    distance: PropTypes.number.isRequired,
    src: PropTypes.number.isRequired,
    dest: PropTypes.number.isRequired,
  }).isRequired,
  markers: PropTypes.array.isRequired,
};
