import { FC, useEffect, useState } from "react";

import OccViewer, {
  OCCViewerModule,
  ModelType
} from "../../basics/OccViewer";

import type { Box, RGB } from "../../basics/OccViewer/caxview";

type Model = Uint8Array | null

type Id = string

interface Node {
  name: string
  children: Id[] | null
}

interface Tree {
  id: Id
  name: string
  children: Tree[] | null
}

const extractTree = (tree: Tree): Tree => {
  const { id, name, children } = tree
  if (children === null) {
    return { id, name, children }
  } else if (children.length === 1) {
    return extractTree(children[0])
  } else {
    return { id, name, children: children.map(extractTree) }
  }
}

const travers = (
  action: (result: any, tree: Tree) => void,
  result: any,
  tree: Tree
): void => {
  action(result, tree)
  tree.children?.forEach((tree) => travers(action, result, tree))
}

interface AllNodes {
  roots: Id[]
  nodes: {
    [id: Id]: Node | undefined
  }
}

const addTreeToAllNodes = (allNodes: AllNodes, tree: Tree): void => {
  allNodes.nodes[tree.id] = {
    ...tree,
    children: tree.children == null ? null : tree.children.map(({ id }) => id)
  }
}

const convertTreesToAllNodes = (trees: Tree[]): AllNodes => {
  const allNodes: AllNodes = {
    roots: trees.map(({ id }) => id),
    nodes: {}
  }

  trees.forEach((tree) => travers(addTreeToAllNodes, allNodes, tree))

  return allNodes
}

interface ModelInfo {
  modelId?: number
  allNodes?: AllNodes
  borderBox?: Box
}

interface ClipPlane {
  oX: number
  oY: number
  oZ: number
  vX: number
  vY: number
  vZ: number
}

enum View {
  Front = "Front",
  Back = "Back",
  Left = "Left",
  Right = "Right",
  Top = "Top",
  Bottom = "Bottom",
  ISO = "ISO"
}

interface Props {
  className?: string
  model?: Model
  view?: View
  explodeScale?: number
  explodeScaleOnXAxis?: number
  explodeScaleOnYAxis?: number
  explodeScaleOnZAxis?: number
  fitAllTrigger?: boolean
  isClipPlaneEnabled?: boolean
  clipPlane?: ClipPlane
  removeAllTrigger?: boolean
  backgroundColor?: [...RGB, ...RGB]
  toDisplay?: Id[]
  toHide?: Id[]
  toRemove?: Id[]
  onLoad?: (modelInfo: ModelInfo) => void
  type?: ModelType
}

const CAXViewBasic: FC<Props> = ({
  className,
  view,
  fitAllTrigger,
  isClipPlaneEnabled,
  clipPlane,
  explodeScale,
  explodeScaleOnXAxis,
  explodeScaleOnYAxis,
  explodeScaleOnZAxis,
  model,
  removeAllTrigger,
  backgroundColor,
  toDisplay,
  toHide,
  toRemove,
  onLoad,
  type
}) => {
  const [occViewer, setOccViewer] = useState<OCCViewerModule | null>(null)

  // 设置occViewer的View
  useEffect(() => {
    view && occViewer?.[`view${view}`]?.()
  }, [view, occViewer])

  // fit all
  useEffect(() => {
    fitAllTrigger && occViewer?.fitAllObjects?.(false)
  }, [fitAllTrigger, occViewer])

  // clear all
  useEffect(() => {
    if (removeAllTrigger) {
      occViewer?.removeAllObjects?.()
    }
  }, [removeAllTrigger, occViewer])

  // 激活或停止剖面图
  useEffect(() => {
    occViewer?.[isClipPlaneEnabled ? "enableClipPlane" : "disableClipPlane"]?.()
  }, [isClipPlaneEnabled, occViewer])

  // 设置剖面
  useEffect(() => {
    clipPlane &&
      isClipPlaneEnabled &&
      occViewer?.updateClipPlane?.(
        clipPlane.oX,
        clipPlane.oY,
        clipPlane.oZ,
        clipPlane.vX,
        clipPlane.vY,
        clipPlane.vZ
      )
  }, [isClipPlaneEnabled, clipPlane, occViewer])

  // 设置爆炸图比例
  useEffect(() => {
    if (explodeScale != null) {
      occViewer?.explode?.(explodeScale)
    }
  }, [explodeScale, occViewer])

  useEffect(() => {
    if (explodeScaleOnXAxis != null) {
      occViewer?.setXScale?.(explodeScaleOnXAxis)
    }
  }, [explodeScaleOnXAxis, occViewer])

  useEffect(() => {
    if (explodeScaleOnYAxis != null) {
      occViewer?.setYScale?.(explodeScaleOnYAxis)
    }
  }, [explodeScaleOnYAxis, occViewer])

  useEffect(() => {
    if (explodeScaleOnZAxis != null) {
      occViewer?.setZScale?.(explodeScaleOnZAxis)
    }
  }, [explodeScaleOnZAxis, occViewer])

  // 添加 删除 或改变models
  useEffect(() => {
    if (occViewer && model !== undefined) {
      occViewer.removeAllObjects?.()
      occViewer.loadModel?.(model, type)

      const docId = occViewer.getCurrentDocId?.()
      const treeStr = occViewer.getTreeStr?.(docId ?? 0)
      onLoad?.({
        modelId: docId,
        allNodes: treeStr
          ? convertTreesToAllNodes(JSON.parse(treeStr).roots.map(extractTree))
          : undefined,
        borderBox: docId
          ? occViewer.getBox?.()
          : ([0.0, 0.0, 0.0, 0.0, 0.0, 0.0] as Box)
      })
    }
  }, [model, occViewer, onLoad, type])

  // 设置背景颜色
  useEffect(() => {
    if (occViewer && backgroundColor) {
      occViewer.setBackGround?.(...backgroundColor)
    }
  }, [backgroundColor, occViewer])

  // 设置显示的模型
  useEffect(() => {
    toDisplay?.forEach((id) => {
      occViewer?.displayObject?.(id)
    })
  }, [toDisplay, occViewer])

  // 设置隐藏的模型
  useEffect(() => {
    toHide?.forEach((id) => {
      occViewer?.hideObject?.(id)
    })
  }, [toHide, occViewer])

  // 删除模型
  useEffect(() => {
    toRemove?.forEach((id) => occViewer?.removeObject?.(id))
  }, [toRemove, occViewer])

  return <OccViewer className={className} onInitialize={setOccViewer} />
}

export default CAXViewBasic
export { View }
export type { Model, ClipPlane, ModelInfo, AllNodes, Id, Node, ModelType }
