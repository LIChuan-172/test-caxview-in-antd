import { FC, Key, ReactNode, useCallback, useState, useMemo } from "react";
import { fetcherBlob } from "../../../lib/fetcher";
import { upperCaseFirst } from "upper-case-first";
import fileDownload from "js-file-download";
import { Radio, RadioChangeEvent } from "antd";
import styles from "./Download.module.css";
import Image from  "../Image";

interface Props {
  className?: string
  modelIds?: Key[]
  children?: ReactNode
}

const Download: FC<Props> = ({ className, modelIds, children }) => {
  const [dataType, setDataType] = useState<"thumbnail" | "origin" | "caxdz">(
    "thumbnail"
  )

  const disabled = useMemo(() => !modelIds?.length, [modelIds])

  const download = useCallback(() => {
    if (!disabled) {
      const url = `/model${upperCaseFirst(dataType ?? "thumbnail")}`
      modelIds?.forEach(async (modelId) => {
        try {
          const { blob, fileName } = await fetcherBlob(url, { modelId })
          fileDownload(blob, fileName)
        } catch (e) {
          alert(`Downloading ${dataType} of model(${modelId}) has failed`)
        }
      })
    }
  }, [dataType, modelIds, disabled])

  return (
    <div className={`${styles.Download} ${className ?? ""}`}>
      <Radio.Group
        disabled={disabled}
        value={dataType}
        onChange={useCallback(
          (e: RadioChangeEvent) => setDataType(e.target.value),
          []
        )}
      >
        <Radio value="thumbnail">缩略图</Radio>
        <Radio value="origin">原始数据</Radio>
        <Radio value="caxdz">caxdz</Radio>
      </Radio.Group>
      <div
        onClick={download}
        className={disabled ? styles.buttonDisabled : styles.button}
      >
        <Image src="/images/download.png" alt="download"/>
        <span>{children ?? "下载数据"}</span>
      </div>
    </div>
  )
}

export default Download
