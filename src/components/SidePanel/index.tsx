import React from "react";

import FilterSelector, { Props as FilterSelectorProps } from "./FilterSelector";
import Section from "./Section";

import styles from "./index.module.scss";

type Props = FilterSelectorProps;

const SidePanel: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.SidePanel}>
      <Section title="ФИЛЬТРЫ">
        <FilterSelector {...props} />
      </Section>
    </div>
  );
};

export default SidePanel;
export type { Props };
