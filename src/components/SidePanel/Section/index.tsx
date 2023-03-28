import React, { useState } from "react";

import triangle from "./triangle.svg";

import "./index.scss";

type Props = React.PropsWithChildren<{ title: string; className?: string | undefined }>;

const Section: React.FC<Props> = ({ children, title, className }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`Section ${className ?? ""}`}>
      <div className="SectionHeading">
        <img
          src={triangle}
          className={isCollapsed ? "triangleCollapsed" : ""}
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
        />
        <p>{title}</p>
      </div>

      <div className="children" hidden={isCollapsed}>
        {children}
      </div>
    </div>
  );
};

export default Section;
export type { Props };
