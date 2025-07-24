<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  export let data;

  let estudiante = {
    nombre: data.estudiante.nombre,
    facultad: data.estudiante.facultad,
    correo: data.estudiante.correo,
    activas: data.estudiante.tutorias_activas,
    completadas: data.estudiante.tutorias_completadas,
    horas: data.estudiante.horas_tutoria_recibidas,
    materias: {
      labels: data.estudiante.grafica_horas_por_materia.map(m => m.materia),
      data: data.estudiante.grafica_horas_por_materia.map(m => m.horas)
    }
  };

  let chart;

  onMount(() => {
    const ctx = document.getElementById('barChartEstudiante').getContext('2d');

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: estudiante.materias.labels,
        datasets: [{
          label: 'Horas',
          data: estudiante.materias.data,
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
    <div class="derecha card">
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
  }

  canvas {
    width: 100% !important;
    height: 300px !important;
  }
</style>