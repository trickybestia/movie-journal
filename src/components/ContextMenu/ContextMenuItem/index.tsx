import React, { HTMLProps } from "react";

import styles from "./index.module.scss";

type Props = HTMLProps<HTMLDivElement> & {
  name: string;
  disabled?: boolean;
};

const ContextMenuItem: React.FC<Props> = (props: Props) => {
  return (
    <div {...props} className={`${styles.ContextMenuItem} ${props.disabled ? styles.disabled : ""}`}>
      <p>{props.name}</p>
    </div>
  );
};

export default ContextMenuItem;
export type { Props };
