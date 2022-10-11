import { FC } from "react"
import { InputNumber as InputNumberAntd } from "antd"

interface Props {
  className?: string
  onChange?: (value: number | null) => void
  value?: number
  labelText?: string
  disabled?: boolean
}

const InputNumber: FC<Props> = ({
  className,
  value,
  onChange,
  labelText,
  disabled = false
}) => {
  return (
    <InputNumberAntd
      addonBefore={labelText ? `${labelText}: ` : undefined}
      className={className}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )
}

export default InputNumber
