<script>
    /** @type {import('./$types').PageData} */
    export let data;
    import { goto } from '$app/navigation';

    let busqueda = '';
    let resultados = [];
    let mostrarPopup = false;
    let tutorSeleccionado = null;



    // Simulado - deberías hacer fetch desde Supabase o tu backend
    let todosLosTutores = [
        {
        id: 1,
        nombre: 'Juan Pérez',
        materias: ['Cálculo I', 'Álgebra'],
        calificacion: 5,
        foto: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
        },
        {
        id: 2,
        nombre: 'Laura Gómez',
        materias: ['Química I'],
        calificacion: 4,
        foto: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
        }
    ];

    let filtro = 'tutor'; // puede ser 'tutor' o 'materia'

    function buscar() {
    const texto = busqueda.toLowerCase();

    resultados = todosLosTutores.filter(t => {
        if (filtro === 'tutor') {
        return t.nombre.toLowerCase().includes(texto);
        } else {
        return t.materias.some(m => m.toLowerCase().includes(texto));
        }
    });
    }

    function irADetalle(id) {
        goto(`/tutor/${id}`);
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
    <select id="filtro" bind:value={filtro} on:change={buscar}>
      <option value="tutor">Tutor</option>
      <option value="materia">Materia</option>
    </select>
  </div>

  <input
    type="text"
    placeholder="Escribe el nombre del tutor o una materia..."
    bind:value={busqueda}
    on:input={buscar}
  />

  {#if resultados.length > 0}
    <div class="professor-container">
      {#each resultados as tutor}
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
          <button on:click={reservarTutoria}>Reservar tutoría</button>
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
