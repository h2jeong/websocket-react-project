import React, { useState } from 'react';

/* customized input */
const FloatLabel = (props) => {
  const { children, label, value } = props;
  const [focus, setFocus] = useState(false);

  const labelClass = focus || value ? 'label label-float' : 'label';

  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}>
      {children}
      <label className={labelClass}>{label}</label>
    </div>
  );
};

export default FloatLabel;
