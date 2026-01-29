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
                  Centrera
                </button>
              ),
              position: COMPONENT_POSITIONS.TOP_LEFT,
              offset: { x: 120, y: 10 },
            },
          ]}
        >
          <div className="categoryBlock">
            <div className="offerNeedCard">
                <p>Title</p>
                <div>
                    <p>Some description</p>
                    <p>Upplagt av: Ingen</p>
                </div>
            </div>
          </div>
          <div className="categoryBlock" style={{left: 1000, top: 300}}>
            2
          </div>
        </ReactInfiniteCanvas>
      </div>
    </>
  );
};

//ReactDOM.render(<InfiniteCanvas />, document.getElementById("root"));

export default InfiniteCanvas;