const getUint8ArrayFromBlob: (blob: Blob) => Promise<Uint8Array> = (blob) => {
  return new Promise<Uint8Array>((res, rej) => {
    const reader = new FileReader()
    const onLoad = (e: ProgressEvent<FileReader>) => {
      if (typeof e.target?.result === "object" && e.target.result) {
        res(new Uint8Array(e.target.result))
      } else {
        rej("Cannot get an uint8Array from blob")
      }

      reader.removeEventListener("load", onLoad)
    }
    reader.addEventListener("load", onLoad)
    reader.readAsArrayBuffer(blob);
  })
}

export { getUint8ArrayFromBlob };
