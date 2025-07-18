<!-- FALTA MODIFICAR ANCHO DE LA PANTALLA -->

<script>
  import { goto } from '$app/navigation';

  let busqueda = '';

  let tutores = [
    {
      nombre: 'Alexander Acosta',
      materias: ['Matemática', 'Química', 'Ecuaciones'],
      calificacion: 5,
      slug: 'alexander-acosta'
    },
    {
      nombre: 'Anabel Castillo',
      materias: ['Inglés'],
      calificacion: 4,
      slug: 'anabel-castillo'
    },
    {
      nombre: 'Carlos Gómez',
      materias: ['Ecuaciones', 'Matemática Superior'],
      calificacion: 3,
      slug: 'carlos-gomez'
    },
    {
      nombre: 'Camila Méndez',
      materias: ['Cálculo I', 'Cálculo II', 'Cálculo III'],
      calificacion: 5,
      slug: 'camila-mendez'
    }
  ];

  $: tutoresFiltrados = tutores.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.materias.some(m => m.toLowerCase().includes(busqueda.toLowerCase()))
  );

  function verTutor(slug) {
    goto(`/administrador/tutores/${slug}`);
  }
</script>

<div class="dashboard">
  <!-- Encabezado -->
  <div class="header">
    <div class="left">
      <h2>Tutores</h2>
    </div>
    <div class="logo-container">
      <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo" />
    </div>
  </div>

  <!-- Buscador -->
  <div class="search-container">
    <input type="text" placeholder="Buscar Tutores" bind:value={busqueda} />
  </div>

  <!-- Tabla -->
  <div class="table-header">
    <span><strong>Nombre</strong></span>
    <span><strong>Materias</strong></span>
    <span><strong>Calificación</strong></span>
  </div>

  {#each tutoresFiltrados as tutor}
    <button type="button" class="tutor-card clickable" on:click={() => verTutor(tutor.slug)}>
      <span>{tutor.nombre}</span>
      <span>{tutor.materias.join(', ')}</span>
      <span>
        {#each Array(tutor.calificacion) as _}
          ⭐
        {/each}
        {#each Array(5 - tutor.calificacion) as _}
          ☆
        {/each}
      </span>
    </button>
  {/each}
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #F2EEE6;
  }

  .tutor-card {
    all: unset; /* 🔥 Quita todos los estilos nativos del botón */
    display: grid;
    grid-template-columns: 1.5fr 3fr 1.5fr;
    padding: 1rem 2rem;
    background-color: white;
    border-bottom: 1px solid #ddd;
    align-items: center;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.2s;
    text-align: left;
  }

  .tutor-card:hover {
    background-color: #f5f5f5;
  }

  .dashboard {
    max-width: 1200px;
    margin: auto;
    padding-bottom: 3rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem 1rem;
  }

  .imagenlogo {
    height: 50px;
  }

  .search-container {
    padding: 0 2rem 1.5rem;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .table-header,
  .tutor-card {
    display: grid;
    grid-template-columns: 1.5fr 3fr 1.5fr;
    padding: 1rem 2rem;
    background-color: white;
    border-bottom: 1px solid #ddd;
    align-items: center;
  }

  .table-header {
    background-color: transparent;
    font-weight: bold;
    margin-top: 1rem;
  }

  .tutor-card span {
    font-size: 15px;
    color: #1E1E2F;
  }
</style>
