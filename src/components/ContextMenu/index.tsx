import React from "react";

import ContextMenuItem, { Props as ContextMenuItemProps } from "./ContextMenuItem";

import styles from "./index.module.scss";

type Props = {
  left: number;
  top: number;
  items: readonly ContextMenuItemProps[];
};

const ContextMenu: React.FC<Props> = ({ left, top, items }: Props) => {
  return (
    <div
      className={styles.ContextMenu}
      style={{ left: left, top: top }}
      onClick={event => {
        if (event.target === event.currentTarget) event.stopPropagation();
      }}
    >
      {items.map((item, index) => (
        <ContextMenuItem key={index} {...item} />
      ))}
    </div>
  );
};

export default ContextMenu;
export type { ContextMenuItemProps, Props };
