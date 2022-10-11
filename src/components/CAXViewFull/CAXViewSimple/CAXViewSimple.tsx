import { FC, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./CAXViewSimple.module.css";

import CAXViewBasic, {
  View,
  Model,
  ClipPlane,
  ModelInfo,
  Id
} from "./CAXViewBasic";
import CAXViewToolbar, { Direction } from "./CAXViewToolbar";

import LayoutHeaderMain from "../layouts/LayoutHeaderMain";
import type { RGB } from "../basics/OccViewer/caxview";

enum ToolbarPosition {
  Top = "Top",
  Right = "Right",
  Bottom = "Bottom",
  Left = "Left"
}

interface Props {
  className?: string
  toolbarPosition?: ToolbarPosition
  onLoad?: (modelInfo: ModelInfo) => void
  toDisplay?: Id[]
  toHide?: Id[]
}

const getDirectionFromPosition = (position: ToolbarPosition) =>
  position in [ToolbarPosition.Left, ToolbarPosition.Right]
    ? Direction.Vertical
    : Direction.Horizontal

const CAXViewSimple: FC<Props> = ({
  className,
  toolbarPosition = ToolbarPosition.Top,
  onLoad,
  toDisplay,
  toHide
}) => {
  const [view, setView] = useState<View | undefined>(View.ISO)
  const [triggerFitAll, setTriggerFitAll] = useState(false)
  const [triggerRemoveAll, setTriggerRemoveAll] = useState(false)
  const [model, setModel] = useState<Model>(null)
  const [explodeScale, setExplodeScale] = useState<number>(0)
  const [explodeScaleOnXAxis, setExplodeScaleOnXAxis] = useState<number>(0)
  const [explodeScaleOnYAxis, setExplodeScaleOnYAxis] = useState<number>(0)
  const [explodeScaleOnZAxis, setExplodeScaleOnZAxis] = useState<number>(0)
  const [backgroundColor, setBackgroundColor] = useState<[...RGB, ...RGB]>([
    0x71 / 0xff,
    0x7a / 0xff,
    0x84 / 0xff,
    0x16 / 0xff,
    0x1f / 0xff,
    0x28 / 0xff
  ])
  const [isClipPlaneEnabled, setIsClipPlaneEnabled] = useState<boolean>(false)
  const [clipPlane, setClipPlane] = useState<ClipPlane>({
    oX: 0.0,
    oY: 0.0,
    oZ: 0.0,
    vX: 1.0,
    vY: 0.0,
    vZ: 0.0
  })

  const toolbarDirection = useMemo(
    () => getDirectionFromPosition(toolbarPosition),
    [toolbarPosition]
  )

  // 对View进行复位
  useEffect(() => {
    setView(undefined)
  }, [view])

  // 对fitAllTrigger进行复位
  useEffect(() => {
    if (triggerFitAll) {
      setTriggerFitAll(false)
    }
  }, [triggerFitAll])

  // 对removeAllTrigger进行复位
  useEffect(() => {
    if (triggerRemoveAll) {
      setTriggerRemoveAll(false)
      setModel(null)
    }
  }, [triggerRemoveAll])

  const onLoadMiddle = useCallback(
    (modelInfo: ModelInfo) => {
      onLoad?.(modelInfo)
    },
    [onLoad]
  )

  return (
    <LayoutHeaderMain
      header={
        <CAXViewToolbar
          direction={toolbarDirection}
          setView={setView}
          setFitAllTrigger={setTriggerFitAll}
          onOpen={setModel}
          setRemoveAllTrigger={setTriggerRemoveAll}
          explodeScale={explodeScale}
          explodeScaleOnXAxis={explodeScaleOnXAxis}
          explodeScaleOnYAxis={explodeScaleOnYAxis}
          explodeScaleOnZAxis={explodeScaleOnZAxis}
          setExplodeScale={setExplodeScale}
          setExplodeScaleOnXAxis={setExplodeScaleOnXAxis}
          setExplodeScaleOnYAxis={setExplodeScaleOnYAxis}
          setExplodeScaleOnZAxis={setExplodeScaleOnZAxis}
          isClipPlaneEnabled={isClipPlaneEnabled}
          setIsClipPlaneEnabled={setIsClipPlaneEnabled}
          clipPlane={clipPlane}
          setClipPlane={setClipPlane}
        />
      }
      main={
        <CAXViewBasic
          className={styles.caxViewBasic}
          view={view}
          fitAllTrigger={triggerFitAll}
          model={model}
          removeAllTrigger={triggerRemoveAll}
          explodeScale={explodeScale}
          explodeScaleOnXAxis={explodeScaleOnXAxis}
          explodeScaleOnYAxis={explodeScaleOnYAxis}
          explodeScaleOnZAxis={explodeScaleOnZAxis}
          isClipPlaneEnabled={isClipPlaneEnabled}
          clipPlane={clipPlane}
          backgroundColor={backgroundColor}
          toDisplay={toDisplay}
          toHide={toHide}
          onLoad={onLoadMiddle}
        />
      }
      className={`${styles[toolbarPosition]} ${className ?? ""}`}
    />
  )
}

export default CAXViewSimple
export { ToolbarPosition }
