import { createContext, useContext } from "react";

import { ContextMenuItemProps } from "components/ContextMenu";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DynamicContextMenuContext = createContext((items: readonly ContextMenuItemProps[]): void => {});

const useDynamicContextMenu = (): { requestContextMenuItems: (items: readonly ContextMenuItemProps[]) => void } => {
  const requestContextMenuItems = useContext(DynamicContextMenuContext);

  return {
    requestContextMenuItems: requestContextMenuItems
  };
};

export default useDynamicContextMenu;
export { DynamicContextMenuContext };
