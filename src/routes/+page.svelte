<script>
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';

  let fruits = [];
  let name = '';
  let file = null;
  let fileInput;

  async function fetchFruits() {
    const res = await fetch('/api/items');
    fruits = await res.json();
  }

  async function addFruit() {
    if (!name || !file) return alert("Enter name and choose an image!");

    // Upload image to Supabase Storage
    const { data, error: uploadError } = await supabase
      .storage
      .from('fruits')
      .upload(`public/${file.name}`, file);

    if (uploadError) {
      return alert("Upload failed: " + uploadError.message);
    }

    // Get public URL
    const { publicUrl, error: urlError } = supabase
      .storage
      .from('fruits')
      .getPublicUrl(`public/${file.name}`);

    if (urlError) return alert("Cannot get URL: " + urlError.message);

    // Send to Neon via API
    const res = await fetch('/api/additem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, photo_url: publicUrl })
    });

    if (res.ok) {
      name = '';
      file = null;
      fileInput.value = '';
      await fetchFruits();
    } else {
      alert("Failed to add fruit");
    }
  }

  onMount(fetchFruits);
</script>

<h2>Add New Fruit</h2>
<input type="text" bind:value={name} placeholder="Fruit Name" />
<input type="file" bind:this={fileInput} on:change={e => file = e.target.files[0]} />
<button on:click={addFruit}>Add Fruit</button>

<h2>Fruit List</h2>
<ul>
  {#each fruits as fruit}
    <li>
      {fruit.name} 
      {#if fruit.photo_url}
        <img src={fruit.photo_url} alt={fruit.name} width="50"/>
      {/if}
    </li>
  {/each}
</ul>
<style>
  img {
    margin-left: 10px;
    vertical-align: middle;
  }
</style>