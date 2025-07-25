<script>
<<<<<<< Updated upstream
    import PanelTutorVerEstudiante from './PanelTutorVerEstudiante.svelte';
</script>

<PanelTutorVerEstudiante />
=======
  let solicitudes = [
    {
      id: 1,
      estudiante: 'Carlos Ruiz',
      materia: 'Matemáticas',
      horario: 'Lunes 10:00 AM'
    },
    {
      id: 2,
      estudiante: 'Ana Torres',
      materia: 'Historia',
      horario: 'Miércoles 3:00 PM'
    }
  ];

  let activas = [
    {
      id: 101,
      estudiante: 'Luis Navarro',
      materia: 'Programación',
      horario: 'Martes 2:00 PM'
    },
    {
      id: 102,
      estudiante: 'Sofía Díaz',
      materia: 'Química',
      horario: 'Jueves 9:00 AM'
    }
  ];

  function aceptarSolicitud(id) {
    if (confirm('¿Estás seguro de aceptar esta tutoría?')) {
      const solicitud = solicitudes.find(s => s.id === id);
      activas = [...activas, solicitud];
      solicitudes = solicitudes.filter(s => s.id !== id);
    }
  }

  function rechazarSolicitud(id) {
    if (confirm('¿Estás seguro de rechazar esta solicitud?')) {
      solicitudes = solicitudes.filter(s => s.id !== id);
    }
  }

  function cancelarTutoría(id) {
    if (confirm('¿Estás seguro de cancelar esta tutoría?')) {
      activas = activas.filter(t => t.id !== id);
    }
  }
</script>
      <div class="header">
          <h2>Mis Tutorias</h2>
      </div>
<div class="panel">
  <section>
    <h3>📬 Solicitudes pendientes ({solicitudes.length})</h3>
    {#if solicitudes.length === 0}
      <p>No tienes solicitudes pendientes.</p>
    {:else}

    
      <div class="grid">
        {#each solicitudes as s}
          <div class="tarjeta solicitud">
            <h4>{s.materia}</h4>
            <p>👨‍🎓 Estudiante: <strong>{s.estudiante}</strong></p>
            <p>🕒 Horario: <strong>{s.horario}</strong></p>
            <div class="acciones">
              <button class="aceptar" on:click={() => aceptarSolicitud(s.id)}>✅ Aceptar</button>
              <button class="rechazar" on:click={() => rechazarSolicitud(s.id)}>❌ Rechazar</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <section>
    <h3>🔔 Tutorías activas ({activas.length})</h3>
    {#if activas.length === 0}
      <p>No tienes tutorías activas.</p>
    {:else}
      <div class="grid">
        {#each activas as t}
          <div class="tarjeta activa">
            <h4>{t.materia}</h4>
            <p>👨‍🎓 Estudiante: <strong>{t.estudiante}</strong></p>
            <p>🕒 Horario: <strong>{t.horario}</strong></p>
            <div class="acciones">
              <button class="cancelar" on:click={() => cancelarTutoría(t.id)}>🔴 Cancelar</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
    .header {
    display: flex;
    align-items: center;
    padding: 2rem;
    max-width: 1200px;
    padding-left: 5rem;

  }
  .panel {
    max-width: 1000px;
    margin: auto;
    padding: 2rem;
  }

  section {
    margin-bottom: 3rem;
  }

  h3 {
    margin-bottom: 1rem;
  }

  .grid {
    display: grid;
    gap: 1.5rem;
  }

  .tarjeta {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .tarjeta h4 {
    margin-bottom: 0.5rem;
  }

  .tarjeta p {
    margin: 0.3rem 0;
  }

  .acciones {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
  }

  button {
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
  }

  .aceptar {
    background-color: #10B981;
    color: white;
  }

  .rechazar {
    background-color: #6B7280;
    color: white;
  }

  .cancelar {
    background-color: #EF4444;
    color: white;
  }
</style>
>>>>>>> Stashed changes
