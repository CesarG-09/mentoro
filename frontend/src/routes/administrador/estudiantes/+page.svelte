<script>
  import { goto } from '$app/navigation';
  
  export let data;

  let busqueda = '';

  let estudiantes = data.listaEstudiantes;

  $: estudiantesFiltrados = estudiantes.filter(t =>
  t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
  t.facultad
    .split(',')
    .some(m => m.trim().toLowerCase().includes(busqueda.toLowerCase()))
  );

  function verEstudiante(slug, id_estudiante, id_usuario) {
    goto(`/administrador/estudiantes/${slug}-${id_estudiante}-${id_usuario}`);
  }
</script>

<div class="contenido">
  <div class="header">
    <h2>Estudiantes</h2>
    <div class="logo-container">
      <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo" />
    </div>
  </div>

  <input class="buscador" type="text" placeholder="Buscar Estudiantes" bind:value={busqueda} />

  <div class="tabla">
    <div class="fila encabezado">
      <div>Nombre</div>
      <div>Facultad</div>
      <div>Correo</div>
      <div>Tutorías Recibidas</div>
      <div>Estado</div>
    </div>

    {#each estudiantesFiltrados as estudiante}
      <button type="button" class="fila tarjeta" on:click={() => verEstudiante(estudiante.slug, estudiante.id_estudiante, estudiante.id_usuario)}>
        <span>{estudiante.nombre}</span>
        <span>{estudiante.facultad}</span>
        <span>{estudiante.correo}</span>
        <span>{estudiante.tutorias_recibidas}</span>
        <span>{estudiante.estado === 'activo' ? 'Activo' : 'Inactivo'}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #F2EEE6;
  }

  .contenido {
    padding: 2rem 4rem;
    max-width: 1400px;
    margin: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .imagenlogo {
    height: 50px;
  }

  .buscador {
    padding: 1rem;
    border-radius: 12px;
    border: none;
    width: 100%;
    max-width: 800px;
    box-shadow: 3px 3px 0 #e4c168;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .tabla {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .fila {
    all: unset;
    display: grid;
    grid-template-columns: 2fr 1fr 3fr 1fr 1fr;
    background: white;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 5px 5px 0 #f2cd6d;
    align-items: center;
    font-size: 1.1rem;
    text-align: center;
  }

  .tarjeta {
    cursor: pointer;
  }

  .tarjeta:hover {
    background-color: #f5f5f5;
  }

  .encabezado {
    background: transparent;
    box-shadow: none;
    font-weight: bold;
    color: #FBBF24;
  }
</style>