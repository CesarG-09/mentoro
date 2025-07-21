<script>
  let filtroEstado = '';
  let criterioPrincipal = 'fecha';

  let ordenNombreAscendente = true;
  let ordenMateriaAscendente = true;
  let ordenFechaReciente = true;

  let estudiantes = [
    {
      nombre: 'María Gómez',
      materia: 'Cálculo I',
      estado: 'Por evaluar',
      comentario: '',
      fechaEvaluacion: '2025-07-14'
    },
    {
      nombre: 'Luis Navarro',
      materia: 'Programación',
      estado: 'Reprobado',
      comentario: '',
      fechaEvaluacion: '2025-07-16'
    },
    {
      nombre: 'Sofía Díaz',
      materia: 'Química',
      estado: 'Aprobado',
      comentario: '',
      fechaEvaluacion: '2025-07-15'
    }
  ];

  const opcionesEstado = ['Aprobado', 'Reprobado', 'Por evaluar'];

  function obtenerColor(estado) {
    if (estado === 'Aprobado') return '#10B981';
    if (estado === 'Reprobado') return '#EF4444';
    return '#9CA3AF';
  }

  function guardarEvaluacion(estudiante) {
    alert(`✅ Evaluación guardada para ${estudiante.nombre} — Estado: ${estudiante.estado}`);
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
    .filter(e => !filtroEstado || e.estado === filtroEstado)
    .slice()
    .sort(comparar);
</script>

<!-- 🔎 Filtros -->
<div class="filtros">
  <label>
    🟢 Estado:
    <select bind:value={filtroEstado}>
      <option value="">Todos</option>
      {#each opcionesEstado as opcion}
        <option value={opcion}>{opcion}</option>
      {/each}
    </select>
  </label>

  <button on:click={alternarOrdenFecha}>📅 Fecha {ordenFechaReciente ? '🔽' : '🔼'}</button>
  <button on:click={alternarOrdenNombre}>🔠 Nombre {ordenNombreAscendente ? '🔼' : '🔽'}</button>
  <button on:click={alternarOrdenMateria}>📘 Materia {ordenMateriaAscendente ? '🔼' : '🔽'}</button>
</div>

<!-- 👥 Evaluaciones -->
<div class="contenedor-evaluaciones">
  {#each estudiantesFiltrados as est}
    <div class="tarjeta-evaluacion" style="border-left: 6px solid {obtenerColor(est.estado)};">
      <div class="tarjeta-encabezado">
        <h3>{est.materia} — {est.nombre}</h3>
        <select bind:value={est.estado}>
          {#each opcionesEstado as opcion}
            <option value={opcion}>{opcion}</option>
          {/each}
        </select>
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
  .filtros {
    max-width: 1000px;
    margin: 0 auto;
    padding: 1rem 2rem;
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
    align-items: center;
  }

  .filtros select {
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    background-color: white;
    font-weight: bold;
    cursor: pointer;
  }

  .filtros label select {
    margin-left: 0.5rem;
    border: none;
    font-weight: bold;
    background-color: white;
  }

  .contenedor-evaluaciones {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    gap: 2rem;
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
</style>
