import { FC } from "react";
import ModelTree from "../basics/ModelTree";
import CAXViewTreeHeader from "./CAXViewTreeHeader";
import LayoutHeaderMain from "../layouts/LayoutHeaderMain";
import styles from "./CAXViewTree.module.css";
import type { AllNodes, Id } from "../CAXViewSimple/CAXViewBasic";

interface Props {
  className?: string
  allNodes?: AllNodes
  setToDisplay?: (toDisplay: Id[]) => void
  setToHide?: (toHide: Id[]) => void
}

const CAXViewTree: FC<Props> = ({
  className,
  allNodes: allNodes,
  setToDisplay,
  setToHide
}) => {
  return (
    <LayoutHeaderMain
      className={styles.layout}
      header={<CAXViewTreeHeader />}
      main={
        <ModelTree
          setToDisplay={setToDisplay}
          setToHide={setToHide}
          className={className}
          allNodes={allNodes}
        />
      }
    />
  )
}

export default CAXViewTree
