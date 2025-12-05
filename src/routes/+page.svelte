<script>
  import { onMount } from 'svelte';
  import { createClient } from '@supabase/supabase-js';

  // Supabase client
  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY
  );

  let fruits = [];
  let newFruitName = '';
  let files; // bind to input
  let file;  // single file extracted

  // Extract first file from FileList
  function prepareFile() {
    file = files ? files[0] : null;
  }

  // Fetch fruits from Neon API
  async function fetchFruits() {
    const res = await fetch('/api/items');
    fruits = await res.json();
  }

  // Add fruit with photo
  async function addFruit() {
    prepareFile();
    if (!newFruitName || !file) return alert('Name + photo required');

    // Upload file to Supabase
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage
      .from('fruits')
      .upload(fileName, file);

    if (uploadError) return alert('Upload failed: ' + uploadError.message);

    const { publicUrl } = supabase.storage.from('fruits').getPublicUrl(fileName).data;

    // Send name + photo URL to Neon API
    const res = await fetch('/api/additem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newFruitName, photo_url: publicUrl })
    });

    if (res.ok) {
      newFruitName = '';
      files = null;
      file = null;
      fetchFruits();
    } else {
      alert('Failed to add fruit');
    }
  }

  onMount(fetchFruits);
</script>

<h2>Boss Fruits 🍌🍎🥭</h2>

<input type="text" placeholder="Fruit name" bind:value={newFruitName} />
<input type="file" bind:files={files} />
<button on:click={addFruit}>Add</button>

<ul>
  {#each fruits as f}
    <li>
      {f.name}
      {#if f.photo_url}
        <img src={f.photo_url} width="50" alt={f.name} />
      {/if}
    </li>
  {/each}
</ul>