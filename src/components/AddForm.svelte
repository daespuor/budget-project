<script>
  import { createEventDispatcher } from "svelte";
  export var serviceRecordMachine;
  var selectedCategory = "0";
  var amount = 0.0;
  $: if ($serviceRecordMachine.context.isCleaning) {
    selectedCategory = "0";
    amount = 0.0;
    serviceRecordMachine.send("CLEANED");
  }
  $: categories = $serviceRecordMachine.context.currentCategories;
  $: if (Number(selectedCategory) > 0 && Number(amount) > 0) {
    serviceRecordMachine.send("COMPLETED");
  } else {
    serviceRecordMachine.send("INVALID");
  }
  var count = 0;
  var dispatch = createEventDispatcher();
  function handleSubmit() {
    count++;
    dispatch("submit", {
      id: count,
      category: selectedCategory,
      amount: amount,
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
    disabled={$serviceRecordMachine.value.form != "filledOut"}>Submit</button
  >
</form>
