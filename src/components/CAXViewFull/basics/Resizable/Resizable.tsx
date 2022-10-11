import { FC, HTMLAttributes, MutableRefObject, useLayoutEffect, useRef } from "react";

interface PropsResizable {
  onResize: (
    clientWidth: number,
    clientHeight: number,
    offsetWidth: number,
    offsetHeight: number
  ) => void
  containerRef?: MutableRefObject<HTMLDivElement | null>
  testFrequency?: number
}

const Resizable: FC<HTMLAttributes<HTMLDivElement> & PropsResizable> = ({
  onResize,
  containerRef: containerRefFromParent,
  testFrequency,
  ...htmlAttributes
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const interval = testFrequency && testFrequency > 0 ? 1 / testFrequency : 50
  const ref = containerRefFromParent ?? containerRef

  useLayoutEffect(() => {
    let clientWidthLast = 0
    let clientHeightLast = 0
    let offsetWidthLast = 0
    let offsetHeightLast = 0
    const timer = setInterval(() => {
      if (ref.current) {
        if (
          clientWidthLast !== ref.current.clientWidth ||
          clientHeightLast !== ref.current.clientHeight ||
          offsetWidthLast !== ref.current.offsetWidth ||
          offsetHeightLast !== ref.current.offsetHeight
        ) {
          clientWidthLast = ref.current.clientWidth
          clientHeightLast = ref.current.clientHeight
          offsetWidthLast = ref.current.offsetWidth
          offsetHeightLast = ref.current.offsetHeight
          onResize(
            clientWidthLast,
            clientHeightLast,
            offsetWidthLast,
            offsetHeightLast
          )
        }
      }
    }, interval)

    return () => {
      clearInterval(timer)
    }
    
  }, [onResize, ref, interval])
  
  return <div {...htmlAttributes} ref={ref}></div>
}

export default Resizable
