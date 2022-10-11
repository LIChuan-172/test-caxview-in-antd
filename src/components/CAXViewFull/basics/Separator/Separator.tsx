import { FC } from "react";
import Image from "../Image";

enum Direction {
  Horizontal = "Horizontal",
  Vertical = "Vertical"
}

interface Props {
  className?: string
  direction?: Direction
}

const Separator: FC<Props> = ({
  className,
  direction = Direction.Horizontal
}) => {
  const imagePath =
    direction === Direction.Horizontal
      ? "/images/separator-horizontal.png"
      : "/images/separator-vertical.png"

  return <Image className={className} src={imagePath} alt={direction} />
}

export default Separator
