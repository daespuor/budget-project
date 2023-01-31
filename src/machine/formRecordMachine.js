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
export var formRecordMachine = createMachine({
  id: "formRecord",
  context: {
    currentCategories: [],
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: "fetchCategories",
        src: loadCategories,
        onDone: {
          actions: "setCategories",
          target: "collecting data",
        },
      },
    },
    "collecting data": {
      entry: "reset",
      initial: "filling fields",
      states: {
        "filling fields": {
          on: { COMPLETED: { target: "ready to submit" } },
        },
        "ready to submit": {
          on: {
            SUBMIT: { target: "saving" },
            INVALID: { target: "filling fields" },
          },
        },
        saving: {
          type: "final",
        },
      },
      onDone: {
        target: "submitting",
      },
    },
    submitting: {
      tags: ["submitting"],
      invoke: {
        id: "addRecord",
        src: saveRecord,
        onDone: {
          actions: "updateRecords",
          target: "collecting data",
        },
      },
    },
    records: {},
  },
});
