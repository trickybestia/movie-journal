import { useState } from "react";

function useStateWithSetCallback<S>(
  initialState: S | (() => S),
  callback: (value: S) => void
): [S, (value: S) => void] {
  const [state, setState] = useState(initialState);

  return [
    state,
    value => {
      setState(value);

      callback(value);
    }
  ];
}

export default useStateWithSetCallback;
