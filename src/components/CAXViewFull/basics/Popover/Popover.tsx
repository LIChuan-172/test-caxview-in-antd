import { FC, ReactNode } from "react";

import { Popover as PopoverAntd } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";

interface Props {
  className?: string
  children?: ReactNode
  placement?: TooltipPlacement
  title?: ReactNode
  content?: ReactNode | (() => ReactNode)
  open?: boolean
  onOpenChange?: (visible: boolean) => void
}

const Popover: FC<Props> = ({
  className,
  children,
  placement,
  title,
  content,
  open,
  onOpenChange
}) => {
  return (
    <PopoverAntd
      title={title}
      content={content}
      placement={placement}
      className={className}
      trigger="click"
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </PopoverAntd>
  )
}

export default Popover
export type { TooltipPlacement }
