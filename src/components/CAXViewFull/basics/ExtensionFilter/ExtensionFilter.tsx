import { FC, useState, useCallback } from "react";
import { Checkbox } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import styles from "./ExtensionFilter.module.css";

const { Group } = Checkbox

interface Props {
  onChange: (list: string[]) => void
  className?: string
  extensions?: string[]
}

const isStringArray = (array: unknown[]): array is string[] => {
  for (const value of array) {
    if (typeof value !== "string") {
      return false
    }
  }
  return true
}

const CheckboxGroup: FC<Props> = ({
  onChange,
  className,
  extensions = [".stp", ".stl", ".caxdz", ".brep"]
}) => {
  const [value, setValue] = useState<CheckboxValueType[]>([])

  const onGroupChange = useCallback((list: CheckboxValueType[]) => {
    setValue(list)
    if (isStringArray(list)) {
      onChange(list)
    }
  }, [onChange])

  return (
    <Group
      className={`${styles.group} ${className ?? ""}`}
      options={extensions}
      value={value}
      onChange={onGroupChange}
    ></Group>
  )
}

export default CheckboxGroup
