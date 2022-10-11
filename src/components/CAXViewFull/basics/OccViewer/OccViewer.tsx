import { FC, useEffect, useRef, useCallback, memo } from "react";
import createOCCViewerModule, { OCCViewerModule, ModelType } from "./caxview";
import CanvasResizable from "../CanvasResizable";

interface Props {
  className?: string
  onInitialize: (occViewer: OCCViewerModule) => void
}

const OccViewer: FC<Props> = ({ className, onInitialize }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const occViewerRef = useRef<OCCViewerModule | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!occViewerRef.current) {
        occViewerRef.current = await createOCCViewerModule(canvasRef.current!)
        occViewerRef.current.tryResize?.()
      }
      onInitialize(occViewerRef.current)
    })()
  }, [onInitialize])

  const onResize = useCallback(() => {
    occViewerRef.current?.tryResize?.()
  },[])

  return canvasRef ? (
    <CanvasResizable
      className={className}
      canvasRef={canvasRef}
      onResize={onResize}
    />
  ) : null
}

export default memo(OccViewer)
export type { OCCViewerModule, ModelType }
