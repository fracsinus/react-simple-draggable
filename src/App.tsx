import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.css';

import Box from './ForwardRefBox';
import NormalBox from './NormalBox';
import Draggable from './Draggable';
process.env.DRAGGABLE_DEBUG = 'true';

function App() {
  const boxRef = useRef<any>(null);
  return (
    <div className="App">
      <main>
        <p className="boundaryLabel">&lt;div class="boundary" /&gt;</p>
        <div className="boundary">

          <Draggable>
            <div className="draggableWrapper">
              <NormalBox />
            </div>
          </Draggable>

          <p>Texts are not selected while dragging.</p>

          <Draggable nodeRef={boxRef} boundary={'.boundary'}>
            <Box ref={boxRef} style={{backgroundColor: '#eee'}}/>
          </Draggable>

          <Draggable>
            <div className="box">
              <p className="colored" onMouseDown={(e) => e.stopPropagation()}>
                Use stopPropagation(){"\n"}
                to make text selectable
              </p>
            </div>
          </Draggable>

          <Draggable boundary=".boundary">
            <div className="box outlined">
              <p>Works well with scrolling.</p>
              <p>(Bound to the red box)</p>
            </div>
          </Draggable>

        </div>
      </main>
    </div>
  );
}

export default App;
