import React, { useState } from "react";

import triangle from "./triangle.svg";

import styles from "./index.module.scss";

type Props = React.PropsWithChildren<{ title: string }>;

const Section: React.FC<Props> = ({ children, title }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.Section}>
      <div>
        <img
          src={triangle}
          className={isCollapsed ? styles.triangleCollapsed : ""}
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
        />
        <p>{title}</p>
      </div>

      <div className={styles.children} hidden={isCollapsed}>
        {children}
      </div>
    </div>
  );
};

export default Section;
export type { Props };
