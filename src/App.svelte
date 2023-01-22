<script>
  import ShowRecords from "./components/ShowRecords.svelte";
  import AddForm from "./components/AddForm.svelte";
  var records = [
    {
      id: 0,
      category: 0,
      amount: 100,
    },
  ];
  function addRecord(event) {
    records = [event.detail, ...records];
  }
</script>

<main>
  <h1>Hello Svelte!</h1>
  <AddForm on:submit={addRecord} />
  <ShowRecords {records} />
</main>
