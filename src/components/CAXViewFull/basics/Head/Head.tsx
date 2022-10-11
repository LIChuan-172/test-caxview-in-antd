import HeadNext from "next/head"
import { FC } from "react"

interface Props {
  title: string
}

const Head: FC<Props> = ({ title }) => {
  return (
    <HeadNext>
      <title>{`CAXView-${title}`}</title>
      <link rel="icon" href="/images/logo.png" />
    </HeadNext>
  )
}

export default Head
