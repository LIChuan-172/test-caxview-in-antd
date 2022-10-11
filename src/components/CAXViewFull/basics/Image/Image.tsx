import ImageNext from "next/image";
import { FC, useState, useEffect, memo, MouseEventHandler } from "react"

interface Props {
  className?: string
  alt?: string
  src: string
  onClick?: MouseEventHandler<HTMLImageElement>
}

const getImageSize = async (src: string) => {
  if (typeof Image !== "undefined") {
    const image = new Image()
    return new Promise<{ width: number; height: number }>((res) => {
      function onLoad(this: HTMLImageElement) {
        const { width, height } = this
        image.removeEventListener("load", onLoad)
        res({ width, height })
      }
      image.addEventListener("load", onLoad)
      image.src = src
    })
  }
  
  return { width: 0, height: 0 }
}

const ImageCV: FC<Props> = ({ alt = "A Picture", src, onClick }) => {
  const [width, setWidth] = useState(30)
  const [height, setHeight] = useState(30)

  useEffect(() => {
    ;(async () => {
      const { width, height } = await getImageSize(src)
      setWidth(width)
      setHeight(height)
    })()
  }, [src])

  return (
    <ImageNext
      alt={alt}
      src={src}
      width={width}
      height={height}
      layout="fixed"
      onClick={onClick}
    />
  )
}

export default memo(ImageCV);
