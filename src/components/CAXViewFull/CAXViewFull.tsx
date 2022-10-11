import { FC, useCallback, useState } from "react";
import styles from "./CAXViewFull.module.css";
import CAXViewSimple, { ToolbarPosition } from "./CAXViewSimple";
import CAXViewTree from "./CAXViewTree";
import LayoutHeaderMain from "./layouts/LayoutHeaderMain";
import { ModelInfo, AllNodes, Id } from "./CAXViewSimple/CAXViewBasic";

interface Props {
  className?: string
}

const CAXViewFull: FC<Props> = ({ className }) => {
  const [allNodes, setAllNodes] = useState<AllNodes | undefined>(undefined)
  const [toDisplay, setToDisplay] = useState<Id[]>([])
  const [toHide, setToHide] =useState<Id[]>([])

  const onLoad = useCallback(({ allNodes }: ModelInfo) => {
    setAllNodes(allNodes)
  }, [])


  return (
    <LayoutHeaderMain
      className={`${styles.layout} ${className ?? ""}`}
      header={
        <CAXViewTree
          className={styles.caxViewTree}
          allNodes={allNodes}
          setToDisplay={setToDisplay}
          setToHide={setToHide}
        />
      }
      main={
        <CAXViewSimple
          className={styles.caxViewSimple}
          toolbarPosition={ToolbarPosition.Top}
          onLoad={onLoad}
          toDisplay={toDisplay}
          toHide={toHide}
        />
      }
    />
  )
}

export default CAXViewFull
