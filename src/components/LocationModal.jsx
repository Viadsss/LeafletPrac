import "../styles/modal.css";
import PropTypes from "prop-types";

export default function LocationModal({ setShowModal, setUseLocation }) {
  function handleYes() {
    setUseLocation(true);
    setShowModal(false);
  }

  function handleNo() {
    setUseLocation(false);
    setShowModal(false);
  }

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        Use Your current location as one of the marker?
        <button onClick={handleYes}>Yes</button>
        <button onClick={handleNo}>No</button>
      </div>
    </div>
  );
}

LocationModal.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  setUseLocation: PropTypes.func.isRequired,
};
