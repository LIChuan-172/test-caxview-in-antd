import {
  ChangeEvent,
  FC,
  MouseEvent,
  ReactNode,
  useCallback,
  useRef
} from "react"
import { getUint8ArrayFromBlob } from "../../../lib/blob"

import { Model } from "../../CAXViewFull/CAXViewSimple/CAXViewBasic"

interface Props {
  className?: string
  children?: ReactNode
  onOpen?: (model: Model, name: string) => void
  accept?: string
}

const Open: FC<Props> = ({ className, children, onOpen, accept }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const input = e.target
      if (input.files?.length) {
        const dzfile = input.files[0]
        onOpen?.(await getUint8ArrayFromBlob(dzfile), dzfile.name)
      }
    },
    [onOpen]
  )

  const onContainerClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ""
      inputRef.current.click()
    }
  }, [])

  const onInputClick = useCallback((e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }, [])

  return (
    <div className={className} onClick={onContainerClick}>
      <input
        type="file"
        accept={accept}
        ref={inputRef}
        style={{ display: "none" }}
        onClick={onInputClick}
        onChange={onInputChange}
      />
      {children}
    </div>
  )
}

export default Open
