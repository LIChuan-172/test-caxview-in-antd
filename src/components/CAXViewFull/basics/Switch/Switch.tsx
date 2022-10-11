import { FC } from "react"
import { Switch as SwitchAntd } from "antd"
import { SwitchChangeEventHandler } from "antd/lib/switch"

import styles from "./Switch.module.css"

interface Props {
  className?: string
  checked?: boolean
  onChange?: SwitchChangeEventHandler
}

const Switch: FC<Props> = ({ className, checked, onChange }) => (
  <SwitchAntd
    className={`${styles.Switch} ${className ?? ""}`}
    checked={checked}
    onChange={onChange}
  />
)

export default Switch
