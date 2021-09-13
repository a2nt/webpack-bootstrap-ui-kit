import { createStore } from "redux";
import reducers from "./reducers";

export default function configure() {
  return createStore(reducers);
}
