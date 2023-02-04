import { createMachine } from "xstate";

function loadRecords() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({
        records: [
          {
            id: 0,
            category: 1,
            amount: 100,
          },
        ],
      });
    }, 1000);
  });
}
function createUpdater(records, categories) {
  return {
    add(newRecord) {
      var newRecordWithCategory = {
        ...newRecord,
        category:
          categories.find((c) => c.id == newRecord.category)?.desc ||
          newRecord.category,
      };
      return [newRecordWithCategory, ...records];
    },
    remove(recordId) {},
  };
}
const invokeRecordUpdate = (ctx) => (sendBack, receive) => {
  var recordUpdater = createUpdater(ctx.records, ctx.categories);
  receive((evt) => {
    switch (evt.type) {
      case "ADD":
        var records = recordUpdater.add(evt.data.detail);
        sendBack({
          type: "UPDATE",
          data: { records },
        });
        break;
      case "REMOVE":
        recordUpdater.remove(evt.data);
        break;
      default:
        break;
    }
  });
};
export var recordTableMachine = createMachine({
  id: "recordTable",
  context: {
    records: [],
    categories: [],
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: "fetchRecords",
        src: loadRecords,
        onDone: {
          actions: "setRecords",
          target: "showing",
        },
      },
    },
    showing: {
      on: {
        ADD: { target: "updating" },
      },
    },
    updating: {
      entry: "sendToUpdater",
      invoke: {
        id: "recordUpdate",
        src: invokeRecordUpdate,
        onDone: {},
      },
      on: {
        UPDATE: { actions: ["updateRecords", "notifyUpdated"] },
        UPDATED: {
          target: "showing",
        },
      },
    },
  },
});
