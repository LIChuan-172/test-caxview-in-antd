import { FC, useCallback, useEffect, useState } from "react";

import Image from "../../Image";

import styles from "./TreeItem.module.css";

interface ShowHideEvent {
  itemKey: string | undefined
  show: boolean
}

interface Props {
  className?: string
  onShowHide?: (showHideEvent: ShowHideEvent) => void
  isLeaf?: boolean
  title?: string
  itemKey?: string
}

const TreeItem: FC<Props> = ({ className, title, onShowHide, itemKey, isLeaf }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    onShowHide?.({ itemKey, show })
  }, [itemKey, show, onShowHide])

  const onClick = useCallback(() => setShow((show) => !show), [])

  return (
    <div className={`${styles.TreeItem} ${className ?? ""}`}>
      <Image
        src={isLeaf ? "/images/tree-part.png" : "/images/tree-model.png"}
        alt="part or model image"
      />
      <span>{title}</span>
      {show === undefined || !isLeaf ? null : (
        <Image
          src={show ? "/images/show.svg" : "/images/hide.svg"}
          onClick={onClick}
          alt="show or hide image"
        />
      )}
    </div>
  )
}

export default TreeItem
export type { ShowHideEvent }
