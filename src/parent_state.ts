import produce, { Draft } from "immer";
import { Dispatch } from "react";

class ParentState<S> {
  public readonly state: S;
  public readonly setState: Dispatch<S>;

  public constructor(state: S, setState: Dispatch<S>) {
    this.state = state;
    this.setState = setState;
  }

  public update(recipe: (state: Draft<S>) => void) {
    this.setState(produce(this.state, recipe));
  }
}

export default ParentState;
