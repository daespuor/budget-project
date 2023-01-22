<script>
  import categories from '../assets/categories.json';
  import {createEventDispatcher} from 'svelte';
  var selectedCategory  = '';
  var amount = 0.0;
  var count = 0;
  var dispatch = createEventDispatcher();
  $: console.log(`Category:${selectedCategory}, Amount: ${amount}`);
  function handleSubmit(){
    count++;
    dispatch('submit',{
      id: count,
      category: selectedCategory,
      amount
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <select bind:value={selectedCategory} on:change={() => amount = 0.0 }>
    <option value="">Select...</option>
    {#each categories as category (category.id) }
      <option value={category.id}>{category.desc}</option>
    {/each}
  </select>
  <input bind:value={amount} />
  <button type="submit" >Submit</button>
</form>

