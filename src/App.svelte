<script>
  import ShowRecords from "./components/ShowRecords.svelte";
  import AddForm from "./components/AddForm.svelte";
  import { useMachine } from "@xstate/svelte";
  import { categoriesMachine } from "./machine/categoriesMachine";
  import { assign } from "xstate";
  var newRecord;
  var { state } = useMachine(categoriesMachine, {
    actions: {
      setCategories: assign({
        categories: (_, evt) => evt.data.categories,
      }),
    },
  });
  $: categories = $state.context.categories;
  function addRecord(event) {
    newRecord = event;
  }
</script>

<main>
  <h1>Hello Svelte!</h1>
  <AddForm on:submit={addRecord} {categories} />
  {#if categories.length > 0}
    <ShowRecords {newRecord} {categories} />
  {/if}
</main>
