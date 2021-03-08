import React, { useState, useRef } from 'react';
import { Modal } from 'antd';
import Draggable from 'react-draggable';

/* customized modal */
const ModalPanel = ({
  title,
  visible,
  handleCancel,
  handleOk,
  children,
  footer,
  width,
  wrapClassName
}) => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });

  const draggleRef = useRef(null);

  const onStart = (e, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();

    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y)
    });
  };

  return (
    <Modal
      title={
        <div
          style={{ display: 'block', cursor: 'move' }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          onFocus={() => {}}
          onBlur={() => {}}>
          {title}
        </div>
      }
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(e, uiData) => onStart(e, uiData)}>
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      footer={footer}
      width={width}
      destroyOnClose
      keyboard
      wrapClassName={wrapClassName}>
      {children}
    </Modal>
  );
};
export default ModalPanel;
