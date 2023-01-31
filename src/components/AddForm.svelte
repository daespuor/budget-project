<script>
  import { createEventDispatcher } from "svelte";
  import { formRecordMachine } from "../machine/formRecordMachine";
  import { interpret, assign } from "xstate";
  var dispatch = createEventDispatcher();
  var selectedCategory = "0";
  var amount = 0.0;
  var machineWithConfig = formRecordMachine.withConfig({
    actions: {
      setCategories: assign({
        currentCategories: (_, evt) => evt.data.categories,
      }),
      reset: () => {
        console.log("Cleaning");
        selectedCategory = "0";
        amount = 0.0;
      },
      updateRecords: (_, evt) => {
        console.log("Updating");
        dispatch("submit", evt.data.record);
      },
    },
  });
  var serviceRecordMachine = interpret(machineWithConfig).start();
  $: categories = $serviceRecordMachine.context.currentCategories;
  $: if (Number(selectedCategory) > 0 && Number(amount) > 0) {
    serviceRecordMachine.send("COMPLETED");
  } else {
    serviceRecordMachine.send("INVALID");
  }
  var count = 0;
  function handleSubmit() {
    count++;
    serviceRecordMachine.send({
      type: "SUBMIT",
      record: {
        id: count,
        category: selectedCategory,
        amount: amount,
      },
    });
  }

  $: console.log($serviceRecordMachine);
</script>

<form on:submit|preventDefault={handleSubmit}>
  <select bind:value={selectedCategory} on:change={() => (amount = 0.0)}>
    <option value="0">Select...</option>
    {#each categories as category (category.id)}
      <option value={category.id}>{category.desc}</option>
    {/each}
  </select>
  <input bind:value={amount} />
  <button
    type="submit"
    disabled={$serviceRecordMachine.value["collecting data"] !=
      "ready to submit"}>Submit</button
  >
</form>
