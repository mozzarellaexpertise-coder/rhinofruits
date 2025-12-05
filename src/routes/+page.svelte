<script>
  import { onMount } from 'svelte';
  import { createClient } from '@supabase/supabase-js';

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  let fruits = [];
  let newFruitName = '';
  let file;

  async function fetchFruits() {
    const res = await fetch('/api/items');
    fruits = await res.json();
  }

  async function addFruit() {
    if (!newFruitName || !file) return alert('Name + photo required');

    // 1️⃣ Upload photo to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage
      .from('fruits')
      .upload(fileName, file);

    if (uploadError) return alert('Upload failed: ' + uploadError.message);

    const photo_url = supabase.storage.from('fruits').getPublicUrl(fileName).data.publicUrl;

    // 2️⃣ Send name + photo_url to Neon API
    const res = await fetch('/api/additem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newFruitName, photo_url })
    });

    if (res.ok) {
      newFruitName = '';
      file = null;
      fetchFruits();
    } else {
      alert('Failed to add fruit');
    }
  }

  onMount(fetchFruits);
</script>

<input type="text" placeholder="Fruit name" bind:value={newFruitName} />
<input type="file" bind:files={file} />
<button on:click={addFruit}>Add Fruit</button>

<ul>
  {#each fruits as f}
    <li>{f.name} {f.photo_url ? <img src={f.photo_url} width="50"/> : ''}</li>
  {/each}
</ul>