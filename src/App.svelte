<script>
  import ShowRecords from "./components/ShowRecords.svelte";
  import AddForm from "./components/AddForm.svelte";
  import { recordMachine } from "./machine/recordMachine.js";
  import { interpret, assign } from "xstate";
  var records = [
    {
      id: 0,
      category: 0,
      amount: 100,
    },
  ];
  var machineWithConfig = recordMachine.withConfig({
    actions: {
      setCategories: assign({
        currentCategories: (_, evt) => evt.data.categories,
      }),
      reset: assign({
        isCleaning: () => true,
      }),
      setReady: assign({
        isCleaning: () => false,
      }),
      updateRecords: assign({
        records: (ctx, evt) => [evt.data.record, ...ctx.records],
      }),
    },
  });
  var serviceRecordMachine = interpret(machineWithConfig).start();
  function addRecord(event) {
    serviceRecordMachine.send({ type: "SUBMIT", record: event.detail });
  }
</script>

<main>
  <h1>Hello Svelte!</h1>
  <AddForm {serviceRecordMachine} on:submit={addRecord} />
  <ShowRecords {serviceRecordMachine} />
</main>
