import { FC, useEffect, useState } from "react";

import InputNumber from "../../../basics/InputNumber";
import { ClipPlane } from "../../CAXViewBasic";

import styles from "./ClipPlaneComponent.module.css";

interface Props {
  className?: string
  isClipPlaneEnabled?: boolean
  clipPlane?: ClipPlane
  setClipPlane?: (clipPlane: ClipPlane) => void
}

const ClipPlaneComponent: FC<Props> = ({
  className,
  isClipPlaneEnabled,
  clipPlane,
  setClipPlane
}) => {
  const [oX, setOX] = useState<number | null>(clipPlane ? clipPlane.oX : 0.0)
  const [oY, setOY] = useState<number | null>(clipPlane ? clipPlane.oY : 0.0)
  const [oZ, setOZ] = useState<number | null>(clipPlane ? clipPlane.oZ : 0.0)
  const [vX, setVX] = useState<number | null>(clipPlane ? clipPlane.vX : 1.0)
  const [vY, setVY] = useState<number | null>(clipPlane ? clipPlane.vY : 0.0)
  const [vZ, setVZ] = useState<number | null>(clipPlane ? clipPlane.vZ : 0.0)

  useEffect(() => {
    if (
      oX !== null &&
      oY !== null &&
      oZ !== null &&
      vX !== null &&
      vY !== null &&
      vZ !== null
    ) {
      if (vX === 0 && vY === 0 && vZ === 0) {
        setClipPlane?.({
          oX,
          oY,
          oZ,
          vX: 1.0,
          vY,
          vZ
        })
      } else {
        setClipPlane?.({
          oX,
          oY,
          oZ,
          vX,
          vY,
          vZ
        })
      }
    }
  }, [oX, oY, oZ, vX, vY, vZ, setClipPlane])

  return (
    <div className={`${styles.ClipPlaneComponent} ${className ?? ""}`}>
      <div className={styles.row}>
        <InputNumber
          className={styles.InputNumber}
          disabled={!isClipPlaneEnabled}
          value={clipPlane?.oX}
          onChange={setOX}
          labelText={"oX"}
        />
        <InputNumber
          className={styles.InputNumber}
          onChange={setOY}
          disabled={!isClipPlaneEnabled}
          value={clipPlane?.oY}
          labelText={"oY"}
        />
        <InputNumber
          className={styles.InputNumber}
          onChange={setOZ}
          disabled={!isClipPlaneEnabled}
          value={clipPlane?.oZ}
          labelText={"oZ"}
        />
      </div>
      <div className={styles.row}>
        <InputNumber
          className={styles.InputNumber}
          onChange={setVX}
          disabled={!isClipPlaneEnabled}
          value={clipPlane?.vX}
          labelText={"vX"}
        />
        <InputNumber
          className={styles.InputNumber}
          onChange={setVY}
          disabled={!isClipPlaneEnabled}
          value={clipPlane?.vY}
          labelText={"vY"}
        />
        <InputNumber
          className={styles.InputNumber}
          onChange={setVZ}
          disabled={!isClipPlaneEnabled}
          value={clipPlane?.vZ}
          labelText={"vZ"}
        />
      </div>
    </div>
  )
}

export default ClipPlaneComponent
