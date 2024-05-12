import PropTypes from "prop-types";
import "../styles/modal.css";

export default function Modal({ children }) {
  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">{children}</div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
};
