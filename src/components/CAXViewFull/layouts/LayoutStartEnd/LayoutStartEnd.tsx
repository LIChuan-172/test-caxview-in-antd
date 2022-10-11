import { FC, ReactNode } from "react";
import styles from "./LayoutStartEnd.module.css";

interface Props {
  className?: string
  start?: ReactNode
  end?: ReactNode
}

const LayoutStartEnd: FC<Props> = ({ className, start, end }) => {
  return (
    <div className={`${styles.layout} ${className ?? ""}`}>
      <div className={styles.start}>{start ?? "start"}</div>
      <div className={styles.end}>{end ?? "end"}</div>
    </div>
  )
}

export default LayoutStartEnd
