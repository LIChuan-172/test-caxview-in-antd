import { MutableRefObject, FC, useRef, useCallback } from "react";
import styles from "./CanvasResizable.module.css";
import Resizable from "../Resizable";

interface Props {
  className?: string
  onResize?: (width: number, height: number) => void
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
  containerRef?: MutableRefObject<HTMLDivElement | null>
}

const resizeCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  styleWidth: string,
  styleHeight: string
) => {
  console.log("before resizeCanvas")
  console.log("canvas.width: ", canvas.width)
  console.log("canvas.height: ", canvas.height)
  console.log("canvas.style.width: ", canvas.style.width)
  console.log("canvas.style.height: ", canvas.style.height)
  canvas.width = width
  canvas.height = height
  canvas.style.width = styleWidth
  canvas.style.height = styleHeight
  console.log("after resizeCanvas")
  console.log("canvas.width: ", canvas.width)
  console.log("canvas.height: ", canvas.height)
  console.log("canvas.style.width: ", canvas.style.width)
  console.log("canvas.style.height: ", canvas.style.height)
}

// 
const Canvas: FC<Props> = ({
  className,
  onResize: onResizeFormParent,
  canvasRef,
  containerRef
}) => {
  const onResize = useCallback(
    (clientWidth: number, clientHeight: number) => {
      if (canvasRef.current) {
        // calculate the width and height of canvas view box
        const width = clientWidth * window.devicePixelRatio
        const height = clientHeight * window.devicePixelRatio
        resizeCanvas(
          canvasRef.current,
          width,
          height,
          `${clientWidth}px`,
          `${clientHeight}px`
        )
        onResizeFormParent?.(width, height)
      }
      console.log(window);
      if (typeof window !== 'undefined'){
        console.log("window22222222222"+document.body.offsetWidth);
        window.onresize = () => {
          console.log(document.body.offsetWidth);
          const offsetWidth = document.body.offsetWidth-208-31;
          console.log(offsetWidth);
          // if (!graph || graph.get('destroyed')) return;
          // if (!container || !container.scrollWidth || !container.scrollHeight) return;
          // graph.changeSize(offsetWidth, container.scrollHeight);
          // graph.fitCenter();
        };
      }
    },
    [canvasRef, onResizeFormParent]
  )

  return (
    <Resizable
      className={`${styles.container} ${className ?? ""}`}
      containerRef={containerRef}
      onResize={onResize}
    >
      <canvas ref={canvasRef} />
    </Resizable>
  )
}

export default Canvas
