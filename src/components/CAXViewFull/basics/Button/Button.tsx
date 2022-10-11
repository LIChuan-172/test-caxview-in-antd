import { FC, MouseEventHandler, ReactNode } from "react"

import { Button as ButtonAntd } from "antd"

interface Props {
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
  children?: ReactNode
  isLoading?: boolean
  htmlType?: "button" | "submit" | "reset" | undefined
  disabled?: boolean
}

const Button: FC<Props> = ({
  className,
  onClick,
  children,
  isLoading,
  htmlType,
  disabled
}) => (
  <ButtonAntd
    htmlType={htmlType}
    className={className}
    onClick={onClick}
    loading={isLoading}
    disabled={disabled}
  >
    {children}
  </ButtonAntd>
)

export default Button
