<script>
  import { transformarTexto } from '../../../utils/transformarTexto'
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;
  
  let busqueda = '';
  let resultados = [];
  let mostrarPopup = false;
  let tutorSeleccionado = null;

  let todosLosTutores = data.listaTutores
    .map(m => ({ ...m, materias: transformarTexto(m.materias) }))
    .map(item => ({...item, foto: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}))
    .map(item => {
      return {
        ...item,
        materias: item.materias.split(',').map(materia => materia.trim())
      };
    });

  let filtro = 'tutor'; // puede ser 'tutor' o 'materia'

  onMount(() => {
    if (sessionStorage.getItem('dato')) {
      busqueda = sessionStorage.getItem('dato');
      filtro = sessionStorage.getItem('filtro');
      sessionStorage.clear();
    }
	});

  // Reacción a cambios en busqueda o filtro
  $: {
    const texto = busqueda.trim().toLowerCase(); // Asegúrate de eliminar espacios extra

    // Filtrar los resultados dependiendo de la opción de filtro (tutor o materia)
    resultados = todosLosTutores.filter(t => {
      if (filtro === 'tutor') {
        return t.nombre.toLowerCase().includes(texto);
      } else {
        return t.materias.some(m => m.toLowerCase().includes(texto));
      }
    });
  }

  function reservarTutor(id_tutor, nombre) {
    goto(`/estudiante/reserva?id_tutor=${id_tutor}&nombre=${nombre}`);
  }

  function abrirPopup(tutor) {
    tutorSeleccionado = tutor;
    mostrarPopup = true;
  }

  function cerrarPopup() {
    mostrarPopup = false;
  }

  function reservarTutoria() {
    alert(`Reservando tutoría con ${tutorSeleccionado.nombre}`);
    cerrarPopup();
  }
</script>

<div class="buscador-container">
  <h2>Buscar tutor o materia</h2>

  <div class="dropdown-filtro">
    <label for="filtro">Filtrar por:</label>
    <select id="filtro" bind:value={filtro}>
      <option value="tutor">Tutor</option>
      <option value="materia">Materia</option>
    </select>
  </div>

  <input
    type="text"
    placeholder="Escribe el nombre del tutor o una materia..."
    bind:value={busqueda}
  />

  {#if resultados.length > 0}
    <div class="professor-container">
      {#each resultados as tutor}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="professor-card" on:click={() => abrirPopup(tutor)}>
          <img src={tutor.foto} alt="Foto de tutor" />
          <div>
            <h3>{tutor.nombre}</h3>
            <p><strong>Materias:</strong> {tutor.materias.join(', ')}</p>
            <p>{#each Array(tutor.calificacion) as _}⭐{/each}</p>
            <button>Reservar</button>
          </div>
        </div>
      {/each}
    </div>

    {#if mostrarPopup}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="popup-overlay" on:click|self={cerrarPopup}>
        <div class="popup-content">
            <h2>{tutorSeleccionado.nombre}</h2>
            <img src={tutorSeleccionado.foto} alt="Foto del tutor" />
            <p><strong>Calificación:</strong> {#each Array(tutorSeleccionado.calificacion) as _}⭐{/each}</p>
            <p><strong>Materias:</strong></p>
            <div class="materias-badges">
            {#each tutorSeleccionado.materias as materia}
                <span class="badge">{materia}</span>
            {/each}
            </div>
          <button on:click={() => reservarTutor(tutorSeleccionado.id_tutor, tutorSeleccionado.nombre)}>Reservar tutoría</button>
        </div>
      </div>
    {/if}
  {:else if busqueda.trim() !== ''}
    <p>No se encontraron tutores para “{busqueda}”.</p>
  {/if}
</div>

<style>
  .buscador-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

    input {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border-radius: 12px;
    border: none;
    margin-bottom: 2rem;
    box-shadow: 3px 3px 0 #bbb; /* sombra gris */
    }

  .professor-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }

    .professor-card {
    background: white;
    border-radius: 16px;
    box-shadow: 4px 4px 0 #f2cd6d; /* sombra amarilla */
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    min-width: 320px;
    max-width: 500px;
    flex: 1 1 40%;
    }

  .professor-card img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }

  .professor-card button {
    margin-top: 0.5rem;
    background-color: #FFBF00;
    color: black;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }

  .professor-card button:hover {
    background-color: #FFA500;
  }

    .dropdown-filtro {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    }

    .dropdown-filtro label {
    font-weight: 600;
    color: #333;
    }

    .dropdown-filtro select {
    padding: 12px;
    font-size: 16px;
    border-radius: 12px;
    border: none;
    box-shadow: 3px 3px 0 #bbb; /* sombra gris */
    background-color: white;
    cursor: pointer;
    }

    .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    }

    .popup-content {
    background: white;
    border-radius: 20px;
    box-shadow: 5px 5px 0 #f2cd6d;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    text-align: center;
    }

    .popup-content img {
    width: 120px;
    height: 120px;
    margin: 1rem 0;
    border-radius: 50%;
    object-fit: cover;
    }

    .popup-content button {
    background-color: #FFBF00;
    color: black;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    margin-top: 1rem;
    cursor: pointer;
    }

    .popup-content button:hover {
    background-color: #FFA500;
    }

    .materias-badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin: 0.5rem 0 1rem;
    }

    .badge {
    background-color: #FFF2CC;
    color: #333;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.95rem;
    font-weight: 500;
    box-shadow: 2px 2px 0 #f2cd6d;
    transition: transform 0.2s ease, background-color 0.2s ease;
    cursor: default;
    }

</style>
