import { FC, ReactNode } from "react";
import styles from "./LayoutHalved.module.css";

interface Props {
  className?: string
  part1: ReactNode
  part2: ReactNode
}

const LayoutHalved: FC<Props> = ({ className, part1, part2 }) => {
  return (
    <div className={`${styles.LayoutHalved} ${className ?? ""}`}>
      <div className={styles.part1}>{part1 ?? "part1"}</div>
      <div
        style={{
          display: part2 ? "block" : "none"
        }}
        className={styles.part2}
      >
        {part2 ?? "part2"}
      </div>
    </div>
  )
}

export default LayoutHalved
