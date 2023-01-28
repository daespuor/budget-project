<script>
  import categories from "../assets/categories.json";
  export var serviceRecordMachine;
  $: recordsFormated = $serviceRecordMachine.context.records.map((rec) => ({
    ...rec,
    category: categories.find((c) => c.id == rec.category)?.desc || "",
  }));
</script>

<table>
  <thead>
    <td>ID</td>
    <td>Category</td>
    <td>Amount</td>
  </thead>
  {#each recordsFormated as record (record.id)}
    <tr>
      <td>{record.id}</td>
      <td>{record.category}</td>
      <td>{record.amount}</td>
    </tr>
  {/each}
</table>
