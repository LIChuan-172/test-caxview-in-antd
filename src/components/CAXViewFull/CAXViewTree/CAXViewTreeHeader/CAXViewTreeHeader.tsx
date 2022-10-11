import { FC } from "react";
import styles from "./CAXViewTreeHeader.module.css";

interface Props {
  className?: string
}

const CAXViewTreeHeader: FC<Props> = ({ className }) => {
  return (
    <div className={`${styles.CAXViewTreeHeader} ${className ?? ""}`}>
      模型树
    </div>
  )
}

export default CAXViewTreeHeader
