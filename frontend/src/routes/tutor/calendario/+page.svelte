<script>
  import { onMount } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';

  let calendarioEl;
  let tutoriasDelDia = [];
  let fechaSeleccionada = '';

  let panelTutoriasEl;

  const tutorias = [
    {
      title: 'Tutoría de Cálculo',
      date: '2025-07-15',
      hora: '10:00 AM',
      tutor: 'Profa. Herrera',
      asistido: false
    },
    {
      title: 'Programación',
      date: '2025-07-17',
      hora: '2:00 PM',
      tutor: 'Ing. López',
      asistido: false
    },
    {
      title: 'Química',
      date: '2025-08-02',
      hora: '4:30 PM',
      tutor: 'Dr. Fernández',
      asistido: false
    }
  ];

  onMount(() => {
    const calendar = new Calendar(calendarioEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      buttonText: {
        today: 'Este mes'
      },
      events: tutorias.map(t => ({
        title: t.title,
        start: t.date
      })),
      dateClick(info) {
        const eventos = tutorias.filter(e => e.date === info.dateStr);
        // Parse date as local to avoid timezone issues
        const [year, month, day] = info.dateStr.split('-').map(Number);
        const fechaLocal = new Date(year, month - 1, day);
        fechaSeleccionada = fechaLocal.toLocaleDateString('es-PA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        tutoriasDelDia = eventos;
        
        // Scroll al panel después de actualizar los datos
        setTimeout(() => {
          if (panelTutoriasEl) {
            panelTutoriasEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });

    calendar.render();
  });

  function alternarAsistencia(indice) {
    tutoriasDelDia[indice].asistido = !tutoriasDelDia[indice].asistido;
  }

  function capitalizeWords(str) {
    // Capitaliza la primera letra de cada palabra, excepto "de"
    if (!str) return '';
    return str
      .split(' ')
      .map((word, idx) => {
        if (word.toLocaleLowerCase('es-ES') === 'de') {
          return 'de';
        }
        // Capitaliza la primera letra, el resto minúsculas
        return word.charAt(0).toLocaleUpperCase('es-ES') + word.slice(1).toLocaleLowerCase('es-ES');
      })
      .join(' ');
  }

</script>

<svelte:head>
  <link href="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.8/main.min.css" rel="stylesheet" />
</svelte:head>
  <div class="header">
    <h2>Calendario de Tutorías</h2>
  </div>
<!-- Calendario principal -->
<div class="calendario-contenedor">
  <div bind:this={calendarioEl} id="calendario"></div>
</div>

<!-- Panel inferior -->
{#if fechaSeleccionada}
  <div
    class="panel-tutorias"
    style="margin-bottom: 4rem;"
    bind:this={panelTutoriasEl}
  >
    <h3>{`Tutorías para el día ${capitalizeWords(fechaSeleccionada)}`}</h3>
    {#if tutoriasDelDia.length > 0}
      <ul>
        {#each tutoriasDelDia as t, i}
          <li>
            <strong>Materia:</strong> {t.title}<br />
            <strong>Hora:</strong> {t.hora}<br />
            <strong>Tutor:</strong> {t.tutor}<br />
            <button on:click={() => alternarAsistencia(i)} style="margin-top: 1rem;">
              {t.asistido ? '❌ Desmarcar asistencia' : '✅ Marcar asistencia'}
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <p>No tienes tutorías en este día</p>
    {/if}
  </div>
{/if}


<style>
    .header {
    display: flex;
    align-items: center;
    padding: 2rem;
    max-width: 1200px;
    padding-left: 5rem;

  }
  .calendario-contenedor {
    max-width: 1000px;
    margin: 2rem auto;
    background-color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  #calendario {
    height: 600px;
  }

  :global(.fc-daygrid-event) {
    background-color: #FBBF24 !important;
    border: none !important;
    color: #1E1E2F !important;
    font-weight: bold;
  }
  .header {
    display: flex;
    align-items: center;
    padding: 2rem;
    max-width: 1200px;
    padding-left: 5rem;

  }
  .panel-tutorias {
    max-width: 1000px;
    margin: 2rem auto 0;
    background: #fffef9;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    color: #1E1E2F;
  }

  .panel-tutorias h3 {
    margin-bottom: 1rem;
    color: #F59E0B;
  }

  .panel-tutorias ul {
    list-style: none;
    padding-left: 0;
  }

  .panel-tutorias li {
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0e8cf;
  }

  .panel-tutorias button {
    margin-top: 0.5rem;
    background-color: #FBBF24;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    color: #1E1E2F;
    transition: background-color 0.2s ease;
  }

  .panel-tutorias button:hover {
    background-color: #facc15;
  }
</style>