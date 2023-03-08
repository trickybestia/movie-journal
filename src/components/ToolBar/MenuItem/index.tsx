import React from "react";
import styles from "./index.module.scss";

type Props = { title: string; onClick: VoidFunction } & (
  | {
      kind: "button";
    }
  | { kind: "checkbox"; checked: boolean }
);

const MenuItem: React.FC<Props> = (props: Props) => {
  return (
    <li
      className={`${styles.MenuItem} pure-menu-item pure-menu-link`}
      onClick={props.onClick}
    >
      <input
        className={props.kind === "checkbox" ? "" : styles.collapsed}
        type="checkbox"
        checked={props.kind === "checkbox" ? props.checked : false}
        readOnly={true}
      />
      <p>{props.title}</p>
    </li>
  );
};

export default MenuItem;
export type { Props };
