import React from 'react';

interface Props {
  ref?: React.RefObject<any>;
}
const Box = React.forwardRef<HTMLDivElement, any>((props, ref) => {
    return (
      <div className="box" {...props} ref={ref}>
        <p>... or use forwardRef(){"\n"}in the component.</p>
        <p>This component is {"\n"}bound to the red box</p>
      </div>
    )
})

export default Box
