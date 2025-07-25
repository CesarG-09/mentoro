<script>
<<<<<<< Updated upstream
    import PanelTutorEstadisticas from './PanelTutorEstadisticas.svelte';
</script>

<PanelTutorEstadisticas />
=======
  import { onMount } from 'svelte';

  let graficaAprobados;
  let graficaRealizadas;
  let graficaMensual;

  let historialMensual = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
    series: [2, 1, 3, 2, 4]
  };

  let estadisticas = {
    valoracionPromedio: 4.3,
    tutoriasAceptadas: 15,
    tutoriasRechazadas: 5,
    tutoriasRealizadas: 12,
    estudiantesAprobados: 9,
    estudiantesReprobados: 3,
    tutoriasEsteMes: 4
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
      title: { text: 'Realizadas vs Aceptadas' }
    }).render();
    }

    if (graficaAprobados) {
      new ApexCharts(graficaAprobados, {
        chart: { type: 'donut' },
      labels: ['Aprobados', 'Reprobados'],
      series: [estadisticas.estudiantesAprobados, estadisticas.estudiantesReprobados],
      colors: ['#10B981', '#EF4444'],
      title: { text: 'Aprobados vs Reprobados' }
    }).render();
    }
    if (graficaMensual) {
      new ApexCharts(graficaMensual, {
        chart: { type: 'bar' },
      series: [{ name: 'Tutorías realizadas', data: historialMensual.series }],
      xaxis: { categories: historialMensual.labels },
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
    <div class="tarjeta">🎓 Aprobados<p class="valor">{estadisticas.estudiantesAprobados}</p></div>
    <div class="tarjeta">⚠️ Reprobados<p class="valor">{estadisticas.estudiantesReprobados}</p></div>
    <div class="tarjeta">📅 Este Mes<p class="valor">{estadisticas.tutoriasEsteMes}</p></div>
  </div>
<div class="contenedor">
  <div class="grafico" bind:this={graficaRealizadas}></div>
  <div class="grafico" bind:this={graficaAprobados}></div>
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

  }
  .contenedor {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 3rem;
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
    margin-bottom: 3rem;
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
  }

  .valor {
    font-size: 1.4rem;
    font-weight: bold;
    color: #1E1E2F;
    margin-top: 0.3rem;
  }

 .grafico {
  background: white;
  border-radius: 8px;
  padding: 0.8rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.04);
}
  
</style>
>>>>>>> Stashed changes
