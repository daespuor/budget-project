import { createMachine } from "xstate";

function saveRecord(_, evt) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ record: evt.record });
    }, 1000);
  });
}
export var formRecordMachine = createMachine({
  id: "formRecord",
  initial: "collecting data",
  states: {
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
