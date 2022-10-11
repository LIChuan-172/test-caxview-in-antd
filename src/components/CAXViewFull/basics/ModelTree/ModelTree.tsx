import { FC, useCallback, useMemo } from "react";
import { Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import type { AllNodes, Id } from "../../CAXViewSimple/CAXViewBasic";
import styles from "./ModelTree.module.css";
import type { ShowHideEvent } from "./TreeItem";
import TreeItem from "./TreeItem";

interface Props {
  className?: string
  allNodes?: AllNodes
  setToDisplay?: (toDisplay: Id[]) => void
  setToHide?: (toHide: Id[]) => void
}

const createDataNode = (
  allNodes: AllNodes,
  id: Id,
  onShowHide: (showHideEvent: ShowHideEvent) => void
): DataNode | undefined => {
  const node = allNodes.nodes[id]
  if (node) {
    if (node.children == null) {
      return {
        key: id,
        title: () => {
          return (
            <TreeItem
              className={styles.TreeItem}
              title={node.name}
              itemKey={id}
              isLeaf={true}
              onShowHide={onShowHide}
            />
          )
        },
        isLeaf: true
      }
    } else {
      return {
        key: id,
        title: () => {
          return <TreeItem className={styles.TreeItem} title={node.name} />
        },
        children: createDataNodes(allNodes, node.children, onShowHide)
      }
    }
  } else {
    return undefined
  }
}

const createDataNodes = (
  allNodes: AllNodes,
  ids: Id[],
  onShowHide: (showHideEvent: ShowHideEvent) => void
): DataNode[] => {
  return ids
    .map((id) => createDataNode(allNodes, id, onShowHide))
    .filter(precludeUndefined)
}

const precludeUndefined = <T,>(x: T | undefined): x is T => x !== undefined

const ModelTree: FC<Props> = ({
  className,
  allNodes,
  setToDisplay,
  setToHide
}) => {
  const onShowHide = useCallback(
    ({ itemKey, show }: ShowHideEvent) => {
      if (itemKey !== undefined) {
        show ? setToDisplay?.([itemKey]) : setToHide?.([itemKey])
      }
    },
    [setToDisplay, setToHide]
  )

  const treeData = useMemo(
    () =>
      allNodes ? createDataNodes(allNodes, allNodes.roots, onShowHide) : [],
    [allNodes, onShowHide]
  )

  return (
    <Tree
      selectable={false}
      showLine={{ showLeafIcon: false }}
      className={`${styles.Tree} ${className ?? ""}`}
      treeData={treeData}
      height={1000}
    />
  )
}

export default ModelTree
