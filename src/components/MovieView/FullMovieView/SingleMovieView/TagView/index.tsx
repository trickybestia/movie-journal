import React from "react";
import useDynamicContextMenu from "hooks/use-dynamic-context-menu";
import ParentState from "parent-state";

import styles from "./index.module.scss";

type Props = {
  tags: ParentState<string[]>;
};

const TagView: React.FC<Props> = ({ tags }: Props) => {
  const { requestContextMenuItems } = useDynamicContextMenu();

  return (
    <div className={styles.TagView}>
      {tags.state.map((tag, index) => (
        <div
          className={styles.Tag}
          key={tag}
          onContextMenu={() => {
            requestContextMenuItems([
              {
                name: "Удалить тэг",
                onClick: () => {
                  if (confirm(`Вы уверены, что хотите удалить тэг "${tag}"?`)) {
                    tags.update(tags => {
                      tags.splice(index, 1);
                    });
                  }
                }
              }
            ]);
          }}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default TagView;
export type { Props };
