<script>
  import { createEventDispatcher } from "svelte";
  import { useMachine } from "@xstate/svelte";
  import { formRecordMachine } from "../machine/formRecordMachine";
  export var categories = [];
  var dispatch = createEventDispatcher();
  var selectedCategory = "0";
  var amount = 0.0;
  var { state, send } = useMachine(formRecordMachine, {
    actions: {
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
  $: if (Number(selectedCategory) > 0 && Number(amount) > 0) {
    send("COMPLETED");
  } else {
    send("INVALID");
  }
  var count = 0;
  function handleSubmit() {
    count++;
    send({
      type: "SUBMIT",
      record: {
        id: count,
        category: selectedCategory,
        amount: amount,
      },
    });
  }

  $: console.log($state);
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
    disabled={$state.value["collecting data"] != "ready to submit"}
    >Submit</button
  >
</form>
