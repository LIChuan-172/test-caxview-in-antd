import { FC, useCallback } from "react";

interface CmProps {
  command: (param: any) => void
  param: any
}

const Command: <Ps extends { onClick?: (...params: any[]) => any }>(
  Fc: FC<Ps>
) => FC<Ps & CmProps> = (Fc) => {
  return function CC(allProps) {
    const { command, param } = allProps
    const onClick = useCallback(() => {
      command(param)
    }, [command, param])
    return <Fc {...allProps} onClick={onClick}></Fc>
  }
}

export default Command
export type { CmProps }
