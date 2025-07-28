<script>
  import { transformarTexto } from "../../../utils/transformarTexto"
  import { Legend } from 'chart.js';
  import { onMount } from 'svelte';

  export let data;

  let graficaAprobados;
  let graficaRealizadas;
  let graficaMensual;

  let estadisticas = {
    valoracionPromedio: data.datosTutor.calificacion_promedio,
    tutoriasAceptadas: data.datosTutor.tutorias_aceptadas,
    tutoriasRechazadas: data.datosTutor.tutorias_rechazadas,
    tutoriasRealizadas: data.datosTutor.tutorias_finalizadas,
    tutoriasCanceladas: data.datosTutor.tutorias_canceladas,
    estudiantesAprobados: 7,
    estudiantesReprobados: 3,
    tutoriasEsteMes: 4,
    historialMaterias: {
      labels: data.datosTutor.grafica_materias.map(m => transformarTexto(m.materia.trim())),
      series: data.datosTutor.grafica_materias.map(m => m.total)
    },
    historialMensual: {
      labels: data.datosTutor.grafica_mensual.map(m => m.mes.trim()),
      series: data.datosTutor.grafica_mensual.map(m => m.total)
    }
  };

  onMount(async () => {
    const module = await import('apexcharts');
    const ApexCharts = module.default;

    if (graficaRealizadas) {
      new ApexCharts(graficaRealizadas, {
        chart: { type: 'donut' },
        labels: ['Realizadas', 'No realizadas'],
        series: [
          estadisticas.tutoriasRealizadas,
          estadisticas.tutoriasAceptadas - estadisticas.tutoriasRealizadas
        ],
        colors: ['#3B82F6', '#D1D5DB'],
        title: { text: 'Aceptadas vs Realizadas' }
      }).render();
    }

    if (graficaAprobados) {
      new ApexCharts(graficaAprobados, {
        chart: { type: 'bar' },
        series: [{ name: 'Tutorías realizadas', data: estadisticas.historialMaterias.series }],
        xaxis: { categories: estadisticas.historialMaterias.labels },
        colors: ['#6366F1'],
        title: { text: 'Historial mensual' },
        responsive: [{ breakpoint: 500, options: { chart: { height: 800 } } }]
      }).render();
    }
    
    if (graficaMensual) {
      new ApexCharts(graficaMensual, {
        chart: { type: 'bar' },
        series: [{ name: 'Tutorías realizadas', data: estadisticas.historialMensual.series }],
        xaxis: { categories: estadisticas.historialMensual.labels },
        colors: ['#6366F1'],
        title: { text: 'Historial mensual' },
        responsive: [{ breakpoint: 500, options: { chart: { height: 300 } } }]
      }).render();
    }

  });
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.css">
</svelte:head>
    <div class="header">
      <h2>Estadísticas del Tutor</h2>
    </div>
  <div class="grid">
    <div class="tarjeta">⭐ Valoración Promedio<p class="valor">{estadisticas.valoracionPromedio} / 5</p></div>
    <div class="tarjeta">✅ Aceptadas<p class="valor">{estadisticas.tutoriasAceptadas}</p></div>
    <div class="tarjeta">❌ Rechazadas<p class="valor">{estadisticas.tutoriasRechazadas}</p></div>
    <div class="tarjeta">🔁 Realizadas<p class="valor">{estadisticas.tutoriasRealizadas}</p></div>
    <div class="tarjeta">🚫 Canceladas<p class="valor">{estadisticas.tutoriasCanceladas}</p></div>
  </div>
<div class="contenedor">
  {#if estadisticas.tutoriasAceptadas > 0}
    <div class="grafico" bind:this={graficaRealizadas}></div>
  {/if}
  {#if estadisticas.tutoriasAceptadas == 0}
    <div class="grafico" style="text-align: center; padding: 30%">No hay datos del tutor</div>
  {/if}
  {#if estadisticas.historialMaterias.labels.length > 0}
    <div class="grafico" bind:this={graficaAprobados}></div>
  {/if}
  {#if estadisticas.historialMaterias.labels.length == 0}
    <div class="grafico" style="text-align: center; padding: 30%">No hay datos del tutor</div>
  {/if}
  <div class="grafico" bind:this={graficaMensual}></div>
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

  .contenedor {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    justify-content: center;
    max-width: 1800px;
    min-width: 500px;
    padding: 1rem;
    padding-left: 5rem;
    padding-right: 5rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    padding-left: 5rem;
    padding-right: 5rem;
  }

  .tarjeta {
    background: white;
    padding: 1rem;
    border-radius: 10px;
    text-align: center;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    cursor:default;
  }

  .valor {
    font-size: 1.4rem;
    font-weight: bold;
    color: #1E1E2F;
    margin: 5px;
  }

 .grafico {
    background: white;
    border-radius: 8px;
    padding: 0.8rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.04);
  }
</style>
