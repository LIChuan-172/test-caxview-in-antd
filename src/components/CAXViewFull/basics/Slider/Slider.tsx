import { FC } from "react";
import { Slider as SliderAntd } from "antd";
import styles from "./Slider.module.css";

interface Props {
  className?: string
  onChange?: (value: number) => void
  value?: number
}

const Slider: FC<Props> = ({ className, onChange, value }) => (
  <SliderAntd
    className={`${styles.Slider} ${className ?? ""}`}
    defaultValue={0.0}
    min={-0.5}
    max={2.0}
    step={0.1}
    onChange={onChange}
    value={value}
  />
)

export default Slider
