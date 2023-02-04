<script>
  import { assign, send } from "xstate";
  import { useMachine } from "@xstate/svelte";
  import { recordTableMachine } from "../machine/recordTableMachine";
  export var newRecord;
  export var categories = [];
  var { state, send: sendToMachine } = useMachine(recordTableMachine, {
    actions: {
      setRecords: assign({
        records: (_, evt) =>
          evt.data.records.map((rec) => ({
            ...rec,
            category: categories.find((c) => c.id == rec.category)?.desc || "",
          })),
        categories,
      }),
      sendToUpdater: send((_, evt) => evt, { to: "recordUpdate" }),
      updateRecords: assign({
        records: (_, evt) => evt.data.records,
      }),
      notifyUpdated: send({ type: "UPDATED" }),
    },
  });
  function addRecord(record) {
    if (record) {
      sendToMachine({ type: "ADD", data: record });
    }
  }
  $: addRecord(newRecord);
  $: console.log($state);
</script>

<table>
  <thead>
    <td>ID</td>
    <td>Category</td>
    <td>Amount</td>
  </thead>
  {#each $state.context.records as record (record.id)}
    <tr>
      <td>{record.id}</td>
      <td>{record.category}</td>
      <td>{record.amount}</td>
    </tr>
  {/each}
</table>
