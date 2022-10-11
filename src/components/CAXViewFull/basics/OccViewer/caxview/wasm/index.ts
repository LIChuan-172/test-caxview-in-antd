// import createCreator from "./caxview"
import createCreator20220908 from "./caxview20220908";

type VERSIONS =
  | "20220908"
  | "latest"

const createCreator: {
  [key in VERSIONS]: () => (occViewerModule: any) => any
} = {
  "20220908": createCreator20220908,
  latest: createCreator20220908
}

const VERSION: VERSIONS = "latest"

export type Box = [
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number
]

type Model = Uint8Array | null
type ModelType = "caxdz" | "stl" | "brep" | "caxd"

export type RGB = [red: number, green: number, blue: number]

interface OCCViewerModule {
  print?: (arg0: any, ...args: any[]) => any
  printErr?: (arg0: any, ...args: any[]) => any
  canvas?: HTMLCanvasElement
  removeAllObjects?: () => void
  _malloc?: (bufferLength: number) => any
  HEAPU8?: {
    set: (uint8Array: Uint8Array, buffer: any) => void
  }
  openFromMemory?: (
    modelId: string,
    buffer: any,
    bufferLength: number,
    toTheTree: boolean,
    isClearOld: boolean // new parameter from v20220831
  ) => void
  displayGround?: (isDisplay: boolean) => void
  displayObject?: (modelId: string) => boolean
  hideObject?: (modelId: string) => boolean
  removeObject?: (modelId: string) => boolean
  viewFront?: () => void
  viewBack?: () => void
  viewLeft?: () => void
  viewRight?: () => void
  viewTop?: () => void
  viewBottom?: () => void
  viewISO?: () => void
  explode?: (scale: number) => void
  setXScale?: (xScale: number) => void
  setYScale?: (yScale: number) => void
  setZScale?: (zScale: number) => void
  fitAllObjects?: (auto: boolean) => void
  enableClipPlane?: () => void
  disableClipPlane?: () => void
  updateClipPlane?: (
    oX: number,
    oY: number,
    oZ: number,
    vX: number,
    vY: number,
    vZ: number
  ) => void
  tryResize?: () => void // new method from v20220825
  getGlobalBndBox?: () => string // new method from v20220831 return value: `${minX};${minY};${minZ};${maxX};${maxY};${maxZ}`
  setBackGround?: (...upAndDownRGB: [...RGB, ...RGB]) => void // new method from v20220831
  getCurrentDocId?: () => number // new method from v20220831
  getTreeStr?: (docId: number) => string
  loadModel?: (model: Model, type?: ModelType) => void // method added in this file
  setObjectVisibility?: (modelId: string, isShow: boolean) => void // method added in this file
  getBox?: () => Box // method added in this file
}

const loadModel = (
  occViewerModule: OCCViewerModule,
  modelId: string,
  modelDataArray: Uint8Array
) => {
  const buffer = occViewerModule._malloc?.(modelDataArray.length)
  occViewerModule.HEAPU8?.set(modelDataArray, buffer)
  occViewerModule.openFromMemory?.(
    modelId,
    buffer,
    modelDataArray.length,
    true,
    true
  )
  occViewerModule.displayGround?.(false)
}

const setObjectVisibility = (
  occViewerModule: OCCViewerModule,
  modelId: string,
  isShow: boolean
) => {
  occViewerModule[isShow ? "displayObject" : "hideObject"]?.(modelId)
}

const print = (text: any) => console.log(text)
const printErr = (err: any) => console.log(err)

async function createOCCViewerModule(
  canvas: HTMLCanvasElement
): Promise<OCCViewerModule> {
  if (
    canvas?.getContext("webgl2", {
      alpha: false,
      depth: true,
      antialias: false,
      preserveDrawingBuffer: true
    }) === null
  ) {
    canvas.getContext("webgl", {
      alpha: false,
      depth: true,
      antialias: false,
      preserveDrawingBuffer: true
    })
  }

  let occViewerModule: OCCViewerModule = {
    print,
    printErr,
    canvas
  }

  await createCreator[VERSION]()(occViewerModule)

  occViewerModule.loadModel = function (model: Model, type?: ModelType) {
    const modelFileId = `fileName.${type ?? "caxdz"}`
    if (model) {
      loadModel(this, modelFileId, model)
    }
  }

  occViewerModule.setObjectVisibility = function (
    modelId: string,
    isShow: boolean
  ) {
    setObjectVisibility(this, modelId, isShow)
  }

  occViewerModule.getBox = function () {
    const boxString = this.getGlobalBndBox?.()
    if (boxString) {
      return boxString.split(";").map(parseFloat) as Box
    } else {
      return [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    }
  }

  return occViewerModule
}

export type { OCCViewerModule, ModelType }
export default createOCCViewerModule
