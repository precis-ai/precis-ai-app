import { useState } from "react";

export const useMergeState = (initialState: any) => {
  const [state, setState] = useState(initialState);

  const setMergedState = (newState: any) =>
    setState((prevState: any) => ({ ...prevState, ...newState }));

  return [state, setMergedState];
};
