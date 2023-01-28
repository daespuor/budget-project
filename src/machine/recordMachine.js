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
function saveRecord(_, evt) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ record: evt.record });
    }, 1000);
  });
}
export var recordMachine = createMachine({
  id: "record",
  type: "parallel",
  context: {
    currentCategories: [],
    records: [],
    isCleaning: false,
  },
  states: {
    form: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            id: "fetchCategories",
            src: loadCategories,
            onDone: {
              actions: "setCategories",
              target: "cleaning",
            },
          },
        },
        cleaning: {
          entry: "reset",
          on: { CLEANED: { target: "ready" } },
        },
        ready: {
          entry: "setReady",
          on: { COMPLETED: { target: "filledOut" } },
        },
        filledOut: {
          on: {
            SUBMIT: { target: "submitting" },
            INVALID: { target: "ready" },
          },
        },
        submitting: {
          invoke: {
            id: "addRecord",
            src: saveRecord,
            onDone: {
              actions: "updateRecords",
              target: "cleaning",
            },
          },
        },
      },
    },
    records: {},
  },
});
