import React, { FC, ReactNode } from "react";
import styles from "./LayoutHeaderMain.module.css";

interface Prop {
  header?: ReactNode
  main?: ReactNode
  className?: string
}

const LayoutHeaderMain: FC<Prop> = ({ header, main, className }) => {
  return (
    <div className={`${styles.layout} ${className ?? ""}`}>
      <header className={styles.header}>{header ?? "header"}</header>
      <main className={styles.main}>{main ?? "main"}</main>
    </div>
  )
}

export default LayoutHeaderMain;
