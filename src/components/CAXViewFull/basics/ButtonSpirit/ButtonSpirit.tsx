import { FC, MouseEventHandler } from "react";
import styles from "./ButtonSpirit.module.css";

interface Props {
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  x?: number
  y?: number
  width?: number
  height?: number
}

const ButtonSpirit: FC<Props> = ({ className, onClick, x = -84, y = -13, width=22, height=22 }) => {
  return (
    <div
      className={`${styles.buttonSpirit} ${className ?? ""}`}
      onClick={onClick}
      style={{ backgroundPosition: `${x}px ${y}px`, width: `${width}px`, height: `${height}px` }}
    ></div>
  )
}

export default ButtonSpirit
