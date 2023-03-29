import React from "react";
import * as f from "filters";
import useDynamicContextMenu from "hooks/use-dynamic-context-menu";
import ParentState from "parent-state";

import styles from "./index.module.scss";

type Props = {
  tags: readonly string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  selectedFilters: ParentState<readonly f.Filter[]>;
};

const FilterSelector: React.FC<Props> = ({ tags, selectedFilters, addTag, removeTag }: Props) => {
  const { requestContextMenuItems } = useDynamicContextMenu();

  const filters = [
    { name: "Просмотренные", filter: f.watched, canRemove: false },
    { name: "Непросмотренные", filter: f.unwatched, canRemove: false }
  ].concat(tags.map(tag => ({ name: tag, filter: f.withTag(tag), canRemove: true })));

  return (
    <div
      className={styles.FilterSelector}
      onContextMenu={() => {
        requestContextMenuItems([
          {
            name: "Добавить тэг",
            onClick: () => {
              const tag = prompt("Введите новый тэг");

              if (tag !== null) addTag(tag);
            }
          }
        ]);
      }}
    >
      {filters.map(({ name, filter, canRemove }, index) => (
        <div
          className={styles.Filter}
          key={index}
          onContextMenu={() => {
            requestContextMenuItems([
              {
                name: "Удалить тэг",
                disabled: !canRemove,
                onClick: () => {
                  if (confirm(`Вы уверены, что хотите удалить тэг "${name}"?`)) {
                    removeTag(name);
                  }
                }
              }
            ]);
          }}
        >
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
