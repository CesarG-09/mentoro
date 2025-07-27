<script>
  let hover = 0;
  let criterioPrincipal = 'fecha';

  let ordenNombreAscendente = true;
  let ordenMateriaAscendente = true;
  let ordenFechaReciente = true;

  let estudiantes = [
    {
      nombre: 'María Gómez',
      materia: 'Cálculo I',
      comentario: '',
      fechaEvaluacion: '2025-07-14',
      calificacion: 0
    },
    {
      nombre: 'Luis Navarro',
      materia: 'Programación',
      comentario: '',
      fechaEvaluacion: '2025-07-16',
      calificacion: 0
    },
    {
      nombre: 'Sofía Díaz',
      materia: 'Química',
      comentario: '',
      fechaEvaluacion: '2025-07-15',
      calificacion: 0
    }
  ];

  function guardarEvaluacion(estudiante) {
    alert(`✅ Evaluación guardada para ${estudiante.nombre}`);
  }

  function alternarOrdenNombre() {
    criterioPrincipal = 'nombre';
    ordenNombreAscendente = !ordenNombreAscendente;
  }

  function alternarOrdenMateria() {
    criterioPrincipal = 'materia';
    ordenMateriaAscendente = !ordenMateriaAscendente;
  }

  function alternarOrdenFecha() {
    criterioPrincipal = 'fecha';
    ordenFechaReciente = !ordenFechaReciente;
  }

  function calificar(estudiante, estrellas) {
    estudiante.calificacion = estrellas;
  }

  $: comparar = (a, b) => {
    switch (criterioPrincipal) {
      case 'nombre':
        return ordenNombreAscendente
          ? a.nombre.localeCompare(b.nombre)
          : b.nombre.localeCompare(a.nombre);
      case 'materia':
        return ordenMateriaAscendente
          ? a.materia.localeCompare(b.materia)
          : b.materia.localeCompare(a.materia);
      case 'fecha':
      default:
        const fechaA = new Date(a.fechaEvaluacion).getTime();
        const fechaB = new Date(b.fechaEvaluacion).getTime();
        return ordenFechaReciente ? fechaB - fechaA : fechaA - fechaB;
    }
  };

  $: estudiantesFiltrados = estudiantes
    .slice()
    .sort(comparar);
</script>

<div class="header">
  <h2>Evaluar Tutorías</h2>
</div>

<!-- 🔍 Botones de orden -->
<div class="filtros">
  <button on:click={alternarOrdenFecha}>📅 Fecha {ordenFechaReciente ? '🔽' : '🔼'}</button>
  <button on:click={alternarOrdenNombre}>🔠 Nombre {ordenNombreAscendente ? '🔼' : '🔽'}</button>
  <button on:click={alternarOrdenMateria}>📘 Materia {ordenMateriaAscendente ? '🔼' : '🔽'}</button>
</div>

<!-- 📝 Evaluaciones -->
<div class="contenedor-evaluaciones">
  {#each estudiantesFiltrados as est}
    <div class="tarjeta-evaluacion">
      <div class="tarjeta-encabezado">
        <h3>{est.materia} — {est.nombre}</h3>
        <div class="calificacion">
          <p>⭐ ¿Qué calificación le das al Estudiante?</p>
          <div class="estrellas">
            {#each Array(5) as _, i}
              <span
                role="button"
                tabindex="0"
                class={i < (hover || est.calificacion) ? 'activa' : 'inactiva'}
                on:click={() => calificar(est, i + 1)}
                on:keydown={(e) => e.key === 'Enter' && calificar(est, i + 1)}
                on:mouseover={() => hover = i + 1}
                on:mouseout={() => hover = 0}
                on:focus={() => hover = i + 1}
                on:blur={() => hover = 0}
              >★</span>
            {/each}
          </div>
        </div>
      </div>

      <div class="fecha-evaluacion">
        📅 Evaluación: {new Date(est.fechaEvaluacion).toLocaleDateString('es-ES', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}
      </div>

      <label>
        Comentario del tutor:
        <textarea bind:value={est.comentario} rows="3" placeholder="Escribe tu comentario..."></textarea>
      </label>

      <button on:click={() => guardarEvaluacion(est)}>Guardar evaluación</button>
    </div>
  {/each}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #F2EEE6;
  }
    .header {
    display: flex;
    align-items: center;
    padding: 2rem;
    max-width: 1200px;
    padding-left: 5rem;
    cursor:default;
  }
  .filtros {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    gap: 0.3rem;
    flex-wrap: wrap;
    align-items: center;
    
  }

  .filtros button {
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: white;
    font-weight: bold;
    color: #1E1E2F;
    cursor: pointer;
    height: 40px;
    display: flex;

  }


  .contenedor-evaluaciones {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    gap: 2rem;
    cursor:default;
  }

  .tarjeta-evaluacion {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .tarjeta-encabezado {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .fecha-evaluacion {
    font-size: 0.95rem;
    color: #4B5563;
    margin-bottom: 0.5rem;
  }

  textarea {
    width: 100%;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    resize: vertical;
    font-family: inherit;
    margin-top: 0.5rem;
  }

  button {
    margin-top: 1rem;
    background-color: #FBBF24;
    padding: 0.5rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    color: #1E1E2F;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  button:hover {
    background-color: #facc15;
  }

   .calificacion {
    margin-top: 1rem;
  }

  .calificacion p {
    font-weight: bold;
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
  }

  .estrellas {
    font-size: 2rem;
    display: flex;
    gap: 0.3rem;
    margin-left: 10rem;
  }

  .estrellas span {
    cursor: pointer;
    transition: transform 0.2s, color 0.3s;
    user-select: none;
  }

  .estrellas .activa {
    color: #FBBF24;
  }

  .estrellas .inactiva {
    color: #D1D5DB;
  }

  .estrellas span:hover {
    transform: scale(1.2);
  }
</style>