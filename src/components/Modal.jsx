import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children, open, onClose }) => {
  const modal = useRef();

  useEffect(() => {
    if (open) {
      modal.current.showModal();
    } else {
      modal.current.close();
    }
  }, [open]);

  return createPortal(
    <dialog className="modal" ref={modal} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
};

export default Modal;
