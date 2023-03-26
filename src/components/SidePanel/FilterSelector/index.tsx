import React from "react";
import * as f from "filters";
import ParentState from "parent-state";

import styles from "./index.module.scss";

type Props = {
  tags: readonly string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  selectedFilters: ParentState<readonly f.Filter[]>;
};

const FilterSelector: React.FC<Props> = ({ tags, selectedFilters }: Props) => {
  const filters = [
    { name: "Просмотренные", filter: f.watched },
    { name: "Непросмотренные", filter: f.unwatched }
  ].concat(tags.map(tag => ({ name: tag, filter: f.withTag(tag) })));

  return (
    <div className={styles.TagSelector}>
      {filters.map(({ name, filter }, index) => (
        <div key={index}>
          <input
            type="checkbox"
            onClick={() => {
              const filterIndex = selectedFilters.state.indexOf(filter);

              selectedFilters.update(selectedFilters => {
                if (filterIndex === -1) {
                  selectedFilters.push(filter);
                } else {
                  selectedFilters.splice(filterIndex, 1);
                }
              });
            }}
            checked={selectedFilters.state.indexOf(filter) !== -1}
            readOnly={true}
          />
          <p>{name}</p>
        </div>
      ))}
    </div>
  );
};

export default FilterSelector;
export type { Props };
