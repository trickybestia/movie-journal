import React, { MouseEventHandler } from "react";
import { Item, Menu, PredicateParams, useContextMenu } from "react-contexify";
import * as f from "filters";
import ParentState from "parent-state";

import styles from "./index.module.scss";

type Props = {
  tags: readonly string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  selectedFilters: ParentState<readonly f.Filter[]>;
};

const CONTEXT_MENU_ID = "FilterSelectorContextMenu";

type ContextMenuProps = {
  filterName: string;
};

const FilterSelector: React.FC<Props> = ({ tags, selectedFilters, addTag, removeTag }: Props) => {
  const { show: showContextMenu } = useContextMenu({ id: CONTEXT_MENU_ID });

  const isContextMenuRemoveButtonHidden = ({ props }: PredicateParams<ContextMenuProps>): boolean => {
    return props === undefined;
  };

  const filters = [
    { name: "Просмотренные", filter: f.watched, canRemove: false },
    { name: "Непросмотренные", filter: f.unwatched, canRemove: false }
  ].concat(tags.map(tag => ({ name: tag, filter: f.withTag(tag), canRemove: true })));

  return (
    <div
      className={styles.FilterSelector}
      onContextMenu={event => {
        if (event.currentTarget === event.target) showContextMenu({ event: event });
      }}
    >
      {filters.map(({ name, filter, canRemove }, index) => {
        let onContextMenu: MouseEventHandler<HTMLDivElement> | undefined = event => showContextMenu({ event: event });

        if (canRemove) {
          onContextMenu = event => {
            showContextMenu({
              event,
              props: {
                filterName: name
              }
            });
          };
        }

        return (
          <div className={styles.Filter} key={index} onContextMenu={onContextMenu}>
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
        );
      })}
      <Menu id={CONTEXT_MENU_ID}>
        <Item
          onClick={() => {
            const tag = prompt("Введите новый тэг");

            if (tag !== null) addTag(tag);
          }}
        >
          Создать тэг
        </Item>
        <Item
          hidden={isContextMenuRemoveButtonHidden}
          onClick={({
            props: menuProps // When named just props, some React's diagnostic considers it as component props and shows errors
          }: PredicateParams<ContextMenuProps>) => {
            if (menuProps !== undefined) {
              if (confirm(`Вы уверены, что хотите удалить тэг "${menuProps.filterName}"?`)) {
                removeTag(menuProps.filterName);
              }
            }
          }}
        >
          Удалить тэг
        </Item>
      </Menu>
    </div>
  );
};

export default FilterSelector;
export type { Props };
