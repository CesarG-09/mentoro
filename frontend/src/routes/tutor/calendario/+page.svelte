<script>
  import { onMount } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';

  let calendarioEl;
  let tutoriasDelDia = [];
  let fechaSeleccionada = '';

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
        fechaSeleccionada = new Date(info.dateStr).toLocaleDateString('es-PA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        tutoriasDelDia = eventos;
      }
    });

    calendar.render();
  });

  function alternarAsistencia(indice) {
    tutoriasDelDia[indice].asistido = !tutoriasDelDia[indice].asistido;
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
{#if tutoriasDelDia.length > 0}
  <div class="panel-tutorias">
    <h3>Tutorías para {fechaSeleccionada}</h3>
    <ul>
      {#each tutoriasDelDia as t, i}
        <li>
          <strong>{t.title}</strong> — {t.hora}<br />
          Tutor: {t.tutor}<br />
          <button on:click={() => alternarAsistencia(i)}>
            {t.asistido ? '❌ Desmarcar asistencia' : '✅ Marcar asistencia'}
          </button>
        </li>
      {/each}
    </ul>
  </div>
{:else if fechaSeleccionada}
  <div class="panel-tutorias">
    <h3>{fechaSeleccionada}</h3>
    <p>No tienes tutorías en este día</p>
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
