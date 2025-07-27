<script>
    /** @type {import('./$types').PageData} */
    export let data;
    import { goto } from '$app/navigation';

    let busqueda = '';
    let resultados = [];


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
        foto: 'https://cdn-icons-png.flaticon.com/512/3135/3135716.png'
        }
    ];

    function buscar() {
        const texto = busqueda.toLowerCase();
        resultados = todosLosTutores.filter(t =>
        t.nombre.toLowerCase().includes(texto) ||
        t.materias.some(m => m.toLowerCase().includes(texto))
        );
    }

    function irADetalle(id) {
        goto(`/tutor/${id}`);
    }
</script>

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
    border-radius: 8px;
    border: 1px solid #ccc;
    margin-bottom: 1rem;
  }

  .professor-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }

  .professor-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.08);
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 300px;
    max-width: 450px;
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
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }

  .professor-card button:hover {
    background-color: #FFA500;
  }
</style>

<div class="buscador-container">
  <h2>Buscar tutor o materia</h2>
  <input
    type="text"
    placeholder="Escribe el nombre del tutor o una materia..."
    bind:value={busqueda}
    on:input={buscar}
  />

  {#if resultados.length > 0}
    <div class="professor-container">
      {#each resultados as tutor}
        <div class="professor-card">
          <img src={tutor.foto} alt="Foto de tutor" />
          <div>
            <h3>{tutor.nombre}</h3>
            <p><strong>Materias:</strong> {tutor.materias.join(', ')}</p>
            <p>{#each Array(tutor.calificacion) as _}⭐{/each}</p>
            <button on:click={() => irADetalle(tutor.id)}>Ver perfil</button>
          </div>
        </div>
      {/each}
    </div>
  {:else if busqueda.trim() !== ''}
    <p>No se encontraron tutores para “{busqueda}”.</p>
  {/if}
</div>
