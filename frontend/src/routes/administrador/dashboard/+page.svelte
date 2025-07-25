<script>
  import { transformarTexto } from '../../../utils/transformarTexto';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  export let data;

  let estudiantesRegistrados = data.totalEstudiantes.count;
  let tutoresActivos = data.totalTutores.count;
  let sesionesCompletadas = data.totalReservas.count;

  let lineChart;
  let barChart;

  const reservasPorMes = {
      labels: data.graficaVs.map(r => r.mes.trim()),
      realizadas: data.graficaVs.map(r => r.realizadas),
      aceptadas: data.graficaVs.map(r => r.aceptadas),
      rechazadas: data.graficaVs.map(r => r.rechazadas)
  };

  const solicitudesMaterias = {
    labels: data.graficaMaterias.map(r => transformarTexto(r.materia.trim())),
    datos: data.graficaMaterias.map(r => r.total)
  }

  onMount(() => {
    const canvasLine = document.getElementById('lineChart');
    const canvasBar = document.getElementById('barChart');

    if (canvasLine instanceof HTMLCanvasElement) {
      const ctxLine = canvasLine.getContext('2d');
      lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: reservasPorMes.labels,
          datasets: [
            {
              label: 'Realizadas',
              data: reservasPorMes.realizadas,
              borderColor: '#008000',
              backgroundColor: '#008000',
              tension: 0.4
            },
            {
              label: 'Aceptadas',
              data: reservasPorMes.aceptadas,
              borderColor: '#FBBF24',
              backgroundColor: '#FBBF24',
              tension: 0.4
            },
            {
              label: 'Rechazadas',
              data: reservasPorMes.rechazadas,
              borderColor: '#B90E0A',
              backgroundColor: '#B90E0A',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    if (canvasBar instanceof HTMLCanvasElement) {
      const ctxBar = canvasBar.getContext('2d');
      barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: solicitudesMaterias.labels,
          datasets: [{
            label: 'Solicitudes en Mayo',
            data: solicitudesMaterias.datos,
            backgroundColor: '#FBBF24'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  });
</script>

<div class="dashboard">
  <div class="header">
    <div class="left">
      <h2>Bienvenido, Admin!</h2>
      <p class="resumen">Resumen</p>
    </div>
    <div class="logo-container">
      <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo" />
    </div>
  </div>

  <div class="stats">
    <div class="card">
      <strong>{estudiantesRegistrados}</strong>
      <p>Estudiantes Registrados</p>
    </div>
    <div class="card">
      <strong>{tutoresActivos}</strong>
      <p>Tutores Activos</p>
    </div>
    <div class="card">
      <strong>{sesionesCompletadas}</strong>
      <p>Sesiones completadas</p>
    </div>
  </div>

  <div class="charts">
    <div class="chart">
      <h3>Solicitudes Aceptadas Vs Rechazadas</h3>
      <canvas id="lineChart" width="400" height="250"></canvas>
    </div>
    <div class="chart">
      <h3>Solicitudes en Mayo</h3>
      <canvas id="barChart" width="400" height="250"></canvas>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #F2EEE6;
  }

  .dashboard {
    max-width: 1200px;
    margin: auto;
    padding-bottom: 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem 1rem;
  }

  .resumen {
    margin: 0.3rem 0 0;
    color: #1E1E2F;
  }

  .imagenlogo {
    height: 50px;
  }

  .stats {
    display: flex;
    gap: 1rem;
    padding: 0 2rem;
    margin-bottom: 2rem;
  }

  .card {
    flex: 1;
    background-color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    text-align: left;
  }

  .charts {
    display: flex;
    gap: 2rem;
    padding: 0 2rem;
    flex-wrap: wrap;
  }

  .chart {
    flex: 1;
    background-color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    min-width: 300px;
  }

  canvas {
    display: block;
    width: 100%;
    height: 250px !important;
  }
</style>