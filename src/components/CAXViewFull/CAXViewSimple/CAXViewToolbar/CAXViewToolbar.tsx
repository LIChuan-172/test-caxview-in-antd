import { FC, useMemo } from "react";
import styles from "./CAXViewToolbar.module.css";
import Command, { CmProps } from "../../basics/Command";
import ButtonSpirit from "../../basics/ButtonSpirit";
import { View, Model, ClipPlane } from "../CAXViewBasic";
import Separator from "../../basics/Separator";
import LayoutStartEnd from "../../layouts/LayoutStartEnd";
import Open from "../../basics/Open";
import Button from "../../basics/Button";
import Popover from "../../basics/Popover";
import Slider from "../../basics/Slider";
import Switch from "../../basics/Switch";
import ClipPlaneComponent from "./ClipPlaneComponent";

enum Direction {
  Horizontal = "Horizontal",
  Vertical = "Vertical"
}

interface Spirit {
  x?: number
  width?: number
}

interface CommandSpiritProps extends CmProps {
  name: string
  icon: Spirit
}

interface Props {
  className?: string
  direction?: Direction
  setView: (view: View) => void
  setFitAllTrigger: (fit: boolean) => void
  onOpen: (model: Model) => void
  setRemoveAllTrigger: (remove: boolean) => void
  explodeScale:   number
  explodeScaleOnXAxis: number
  explodeScaleOnYAxis: number
  explodeScaleOnZAxis: number
  setExplodeScale: (explodeScale: number) => void
  setExplodeScaleOnXAxis: (explodeScaleXAxis: number) => void
  setExplodeScaleOnYAxis: (explodeScaleYAxis: number) => void
  setExplodeScaleOnZAxis: (explodeScaleZAxis: number) => void
  isClipPlaneEnabled: boolean
  setIsClipPlaneEnabled: (isClipPlanEnabled: boolean) => void
  clipPlane: ClipPlane
  setClipPlane: (clipPlane: ClipPlane) => void
}

const CommandSpirit = Command(ButtonSpirit)

const createViewCommands = (
  setView: (view: View) => void,
  setFitAllTrigger: (fitAll: boolean) => void
) => [
  {
    command: setView,
    param: View.Front,
    name: "front view",
    icon: {
      x: -84
    }
  },
  {
    command: setView,
    param: View.Back,
    name: "back view",
    icon: {
      x: -126
    }
  },
  {
    command: setView,
    param: View.Left,
    name: "left view",
    icon: {
      x: -169
    }
  },
  {
    command: setView,
    param: View.Right,
    name: "right view",
    icon: {
      x: -211
    }
  },
  {
    command: setView,
    param: View.Top,
    name: "top view",
    icon: {
      x: -253
    }
  },
  {
    command: setView,
    param: View.Bottom,
    name: "bottom view",
    icon: {
      x: -296
    }
  },
  {
    command: setView,
    param: View.ISO,
    name: "iso view",
    icon: {
      x: -339
    }
  },
  {
    command: setFitAllTrigger,
    param: true,
    name: "fit all",
    icon: {
      x: -585,
      width: 23
    }
  }
]

const CAXViewToolbar: FC<Props> = ({
  className,
  direction = Direction.Horizontal,
  setView,
  setFitAllTrigger,
  onOpen,
  setRemoveAllTrigger,
  explodeScale,
  explodeScaleOnXAxis,
  explodeScaleOnYAxis,
  explodeScaleOnZAxis,
  setExplodeScale,
  setExplodeScaleOnXAxis,
  setExplodeScaleOnYAxis,
  setExplodeScaleOnZAxis,
  isClipPlaneEnabled,
  setIsClipPlaneEnabled,
  clipPlane,
  setClipPlane
}) => {
  const commands: CommandSpiritProps[] = useMemo(
    () => createViewCommands(setView, setFitAllTrigger), [setView, setFitAllTrigger]
  )

  const ExplodeScale = useMemo(
    () => <div>
            <span>XYZ:</span>
            <Slider value={explodeScale} onChange={setExplodeScale} />
            <span>X向:</span>
            <Slider value={explodeScaleOnXAxis} onChange={setExplodeScaleOnXAxis} />
            <span>Y向:</span>
            <Slider value={explodeScaleOnYAxis} onChange={setExplodeScaleOnYAxis} />
            <span>Z向:</span>
            <Slider value={explodeScaleOnZAxis} onChange={setExplodeScaleOnZAxis} />
          </div>,
          [explodeScale, explodeScaleOnXAxis, explodeScaleOnYAxis, explodeScaleOnZAxis,
            setExplodeScale, setExplodeScaleOnXAxis, setExplodeScaleOnYAxis, setExplodeScaleOnZAxis]
  )

  const ClipPlaneTitle = useMemo(
    () => (
      <div>
        <span>剖面图</span>
        <Switch checked={isClipPlaneEnabled} onChange={setIsClipPlaneEnabled} />
      </div>
    ),
    [isClipPlaneEnabled, setIsClipPlaneEnabled]
  )

  const ClipPlane = useMemo(() => {
    return (
      <ClipPlaneComponent
        isClipPlaneEnabled={isClipPlaneEnabled}
        clipPlane={clipPlane}
        setClipPlane={setClipPlane}
      />
    )
  }, [isClipPlaneEnabled, clipPlane, setClipPlane])

  const Functions = useMemo(
    () => (
      <div
        className={`${styles.Functions} ${styles[direction]} ${
          className ?? ""
        }`}
      >
        {commands.map(({ command, param, name, icon: { x, width } }) => (
          <CommandSpirit
            command={command}
            param={param}
            x={x}
            width={width}
            key={name}
          />
        ))}
        <Separator direction={direction} />
        <CommandSpirit
          command={setRemoveAllTrigger}
          param={true}
          width={24}
          x={-627}
        />
        <Popover title="滑动选择爆炸比例" content={ExplodeScale}>
          <ButtonSpirit x={-486} width={27} />
        </Popover>
        <Popover title={ClipPlaneTitle} content={ClipPlane}>
          <ButtonSpirit x={-431} width={22} />
        </Popover>
      </div>
    ),
    [
      className,
      commands,
      setRemoveAllTrigger,
      direction,
      ExplodeScale,
      ClipPlane,
      ClipPlaneTitle
    ]
  )

  const Files = useMemo(
    () => (
      <div className={`${styles.Files} ${styles[direction]}`}>
        <Open onOpen={onOpen} accept=".caxdz">
          <Button
            className={`${styles.Button} ${styles.Open} ${styles[direction]}`}
          >
            打开本地文件
          </Button>
        </Open>
        <Button
          className={`${styles.Button} ${styles.Save} ${styles[direction]}`}
        >
          保存数据
        </Button>
      </div>
    ),
    [direction, onOpen]
  )

  const toolbar = useMemo(
    () => (
      <LayoutStartEnd
        className={`${styles.LayoutStartEnd} ${styles[direction]}`}
        start={Functions}
        end={Files}
      />
    ),
    [Functions, Files, direction]
  )

  return toolbar
}

export default CAXViewToolbar
export { Direction }
