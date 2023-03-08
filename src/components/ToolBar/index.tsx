import React from "react";
import ToolBarItem, { Props as ToolBarItemProps } from "./ToolBarItem";

type Props = {
  buttons: readonly ToolBarItemProps[];
};

const ToolBar: React.FC<Props> = (props: Props) => {
  return (
    <div className={`pure-menu pure-menu-horizontal`}>
      <ul className="pure-menu-list">
        {props.buttons.map((button) => (
          <ToolBarItem key={button.title} {...button} />
        ))}
      </ul>
    </div>
  );
};

export default ToolBar;
export type { Props };
