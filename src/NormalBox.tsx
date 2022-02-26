import React from 'react';

interface Props {
  ref?: React.RefObject<any>;
}
export default function Box() {
    return (
      <div className="box">
        <p>By default,{"\n"}boundary is set for 'body'</p>
        <p>In order to make{"\n"}a component draggable,{"\n"}wrap it in &lt;div&gt;</p>
      </div>
    )
}
