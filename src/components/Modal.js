import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const Modal = forwardRef((props, ref) => {
  const [o, setO] = useState(props.open);

  useImperativeHandle(ref, () => ({
    open() {
      setO(true);
    },
    close() {
      setO(false);
    },
    toggle() {
      setO(!o);
    },
  }));

  if (o) {
    return (
      <div className="modal-frame">
        <div className="modal-box">
          <div className="close" onClick={() => setO(false)} />
          <div className="content">{props.children}</div>
        </div>
      </div>
    );
  }

  return "";
});

export default Modal;
