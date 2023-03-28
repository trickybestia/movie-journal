import React from "react";

import FilterSelector, { Props as FilterSelectorProps } from "./FilterSelector";
import Section from "./Section";

import "./index.scss";

type Props = FilterSelectorProps;

const SidePanel: React.FC<Props> = (props: Props) => {
  return (
    <div className="SidePanel">
      <Section title="ФИЛЬТРЫ" className="FiltersSection">
        <FilterSelector {...props} />
      </Section>
    </div>
  );
};

export default SidePanel;
export type { Props };
