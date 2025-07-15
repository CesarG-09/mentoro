<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let estudiante = {
    nombre: "Ana González",
    facultad: "FISC",
    correo: "ana.gonzalez@utp.ac.pa",
    activas: 1,
    completadas: 4,
    horas: 6,
    materias: [
      { nombre: "Estructura de Datos", horas: 1 },
      { nombre: "Programación", horas: 2 },
      { nombre: "Cálculo II", horas: 3 }
    ]
  };

  let chart;

  onMount(() => {
    const ctx = document.getElementById('barChartEstudiante').getContext('2d');

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: estudiante.materias.map(m => m.nombre),
        datasets: [{
          label: 'Horas',
          data: estudiante.materias.map(m => m.horas),
          backgroundColor: '#FBBF24'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    });
  });
</script>

<!-- Barra superior -->
<div class="nav-bar">
  <div class="nav-links">
    <a href="#">Dashboard</a>
    <a href="#">Tutores</a>
    <a href="#" class="active">Estudiantes</a>
  </div>
  <div class="user-info">
    <span>Hola, <strong>admin@mentoro.pa</strong></span>
    <button>Cerrar sesión</button>
  </div>
</div>

<!-- Contenido -->
<div class="contenido">
  <!-- Título con logo -->
  <div class="titulo-barra">
    <h2 class="titulo">Estudiantes</h2>
    <div class="logo-container">
      <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo" />
    </div>
  </div>

  <!-- Línea de datos del estudiante -->
  <div class="info-linea">
    <h3 class="izquierda">{estudiante.nombre}</h3>
    <p class="centro">{estudiante.facultad}</p>
    <p class="derecha">{estudiante.correo}</p>
  </div>

  <!-- Tarjetas y gráfico -->
  <div class="layout">
    <!-- Tarjetas -->
    <div class="izquierda">
      <div class="card">
        <strong>{estudiante.activas}</strong>
        <p>Tutorías activas</p>
      </div>
      <div class="card">
        <strong>{estudiante.completadas}</strong>
        <p>Tutorías Completadas</p>
      </div>
      <div class="card">
        <strong>{estudiante.horas}</strong>
        <p>Horas de Tutoría Recibidas</p>
      </div>
    </div>

    <!-- Gráfico -->
    <div class="derecha">
      <h4>Horas de Tutoría Recibidas</h4>
      <canvas id="barChartEstudiante" width="500" height="300"></canvas>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #F2EEE6;
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
    margin-right: 1.5rem;
    text-decoration: none;
    font-weight: normal;
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

  .contenido {
    padding: 2rem 4rem;
    max-width: 1400px;
    margin: auto;
  }

  .titulo-barra {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .titulo {
    text-align: left;
    margin: 0;
  }

  .logo-container {
    display: flex;
    align-items: center;
  }

  .imagenlogo {
    height: 50px;
  }

  .info-linea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .info-linea h3,
  .info-linea p {
    margin: 0;
    flex: 1;
    padding: 0;
    background: none;
  }

  .izquierda {
    text-align: left;
  }

  .centro {
    text-align: center;
  }

  .derecha {
    text-align: right;
  }

  .layout {
    display: flex;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .izquierda {
    flex: 1;
    min-width: 250px;
    max-width: 300px;
  }

  .card {
    background: white;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
    text-align: left;
  }

  .derecha {
    flex: 2;
    min-width: 400px;
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }

  canvas {
    width: 100% !important;
    height: 300px !important;
  }
</style>