import React from "react";
import MenuItem, { Props as MenuItemProps } from "../MenuItem";
import styles from "./index.module.scss";

type Props = {
  title: string;
  items: readonly MenuItemProps[];
};

const ToolBarItem: React.FC<Props> = (props: Props) => {
  return (
    <li
      className={`${styles.ToolBarItem} pure-menu-item pure-menu-allow-hover`}
    >
      <p className="pure-menu-link">{props.title}</p>
      <ul className="pure-menu-children">
        {props.items.map((item) => (
          <MenuItem key={item.title} {...item} />
        ))}
      </ul>
    </li>
  );
};

export default ToolBarItem;
export type { Props };
