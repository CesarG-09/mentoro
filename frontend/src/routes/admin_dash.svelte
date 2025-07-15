<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let estudiantesRegistrados = 55;
  let tutoresActivos = 24;
  let sesionesCompletadas = 39;

  let lineChart;
  let barChart;

  onMount(() => {
    const canvasLine = document.getElementById('lineChart');
    const canvasBar = document.getElementById('barChart');

    if (canvasLine instanceof HTMLCanvasElement) {
      const ctxLine = canvasLine.getContext('2d');
      lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
          datasets: [
            {
              label: 'Tutores',
              data: [18, 26, 28, 35, 36],
              borderColor: '#FBBF24',
              backgroundColor: '#FBBF24',
              tension: 0.4
            },
            {
              label: 'Estudiantes',
              data: [6, 14, 15, 23, 25],
              borderColor: '#1E1E2F',
              backgroundColor: '#1E1E2F',
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
          labels: ['Cálculo', 'Física', 'Química', 'Ecuaciones', 'Inglés'],
          datasets: [{
            label: 'Solicitudes en Mayo',
            data: [5, 11, 20, 23, 29],
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

<svelte:head>
  <title>Dashboard - Mentoro</title>
</svelte:head>

<div class="dashboard">
  <div class="nav-bar">
    <div class="nav-links">
      <a href="/">Registro</a>
      <a href="/dashboard" class="active">Dashboard</a>
      <a href="/tutores">Tutores</a>
    </div>
    <div class="user-info">
      <span>Hola, <strong>admin@mentoro.pa</strong></span>
      <button>Cerrar sesión</button>
    </div>
  </div>

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
      <h3>Solicitudes por Mes</h3>
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
    padding-bottom: 3rem;
  }

  .nav-bar {
    background-color: #1E1E2F;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links a {
    color: white;
    margin-right: 1rem;
    text-decoration: none;
  }

  .nav-links a.active {
    font-weight: bold;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-info button {
    background-color: #FBBF24;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    color: #1E1E2F;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem 1rem;
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
