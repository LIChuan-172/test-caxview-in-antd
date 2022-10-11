import { FC, ReactNode } from "react";
import styles from "./LayoutCenter.module.css";

interface Prop {
  children?: ReactNode
  className?: string
}

const LayoutCenter: FC<Prop> = ({ children, className }) => {
  return (
    <div className={`${styles.layout} ${className ?? ""}`}>
      {children ?? "children"}
    </div>
  )
}

export default LayoutCenter
