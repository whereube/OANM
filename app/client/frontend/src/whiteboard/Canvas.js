import { useRef } from "react";
import { ReactInfiniteCanvas, ReactInfiniteCanvasHandle } from "react-infinite-canvas";

import { COMPONENT_POSITIONS } from "./helpers/constants.js";
import ReactDOM from "react-dom"; 
import './Canvas.css'


const InfiniteCanvas = () => {
  const canvasRef = useRef(null);
  return (
    <>
      <div className='canvasDiv'>
        <ReactInfiniteCanvas
          ref={canvasRef}
          onCanvasMount={(mountFunc) => {
            mountFunc.fitContentToView({ scale: 1 });
          }}
          customComponents={[
            {
              component: (
                <button
                  onClick={() => {
                    canvasRef.current?.fitContentToView({ scale: 1 });
                  }}
                >
                  fitToView
                </button>
              ),
              position: COMPONENT_POSITIONS.TOP_LEFT,
              offset: { x: 120, y: 10 },
            },
          ]}
        >
          <div style={{ width: "200px", height: "200px", background: "red" }}>
            asdasdsdas
          </div>
          <div style={{ width: "200px", height: "200px", background: "blue" }}>
            2
          </div>
        </ReactInfiniteCanvas>
      </div>
    </>
  );
};

//ReactDOM.render(<InfiniteCanvas />, document.getElementById("root"));

export default InfiniteCanvas;