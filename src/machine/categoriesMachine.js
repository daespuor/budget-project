import { createMachine } from "xstate";
import categories from "../assets/categories.json";

function loadCategories() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({
        categories,
      });
    }, 1000);
  });
}
export var categoriesMachine = createMachine({
  id: "categoriesMachine",
  context: {
    categories: [],
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: "fetchCategories",
        src: loadCategories,
        onDone: {
          actions: "setCategories",
          target: "using categories",
        },
      },
    },
    "using categories": {
      type: "final",
    },
  },
  onDone: {
    actions: () => console.log("Categories loaded"),
  },
});
