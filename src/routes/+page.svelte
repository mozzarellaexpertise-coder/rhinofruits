<script>
  import { onMount } from 'svelte';

  let fruits = [];
  let newFruit = "";

async function loadFruits() {
  try {
    const res = await fetch("/api/items");
    fruits = await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function addFruit() {
  if (!newFruit) return;
  try {
    await fetch("/api/additem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFruit })
    });
    newFruit = "";
    loadFruits();
  } catch (err) {
    console.error(err);
  }
}

async function deleteFruit(id) {
  try {
    await fetch("/api/delitem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    loadFruits();
  } catch (err) {
    console.error(err);
  }
}

  // Run fetch only in the browser
  onMount(() => {
    loadFruits();
  });
</script>

<main>
  <h1>My Awesome Fruit List 🥭🍎🍌</h1>
  <input placeholder="New fruit" bind:value={newFruit} />
  <button on:click={addFruit}>Add</button>

  <ul>
    {#each fruits as fruit}
      <li>
        {fruit.name} 
        <button on:click={() => deleteFruit(fruit.id)}>❌</button>
      </li>
    {/each}
  </ul>
</main>

<style>
  main { text-align: center; margin-top: 2rem; font-family: sans-serif; }
  input { padding: 0.3rem; margin-right: 0.5rem; }
  button { margin-left: 0.3rem; }
  ul { list-style: none; padding: 0; margin-top: 1rem; }
  li { padding: 0.3rem 0; font-size: 1.2rem; }
</style>