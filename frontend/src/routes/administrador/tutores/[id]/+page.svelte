<script>
  import { transformarTexto } from '../../../../utils/transformarTexto';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  export let data;

  let tutor = {
    nombre: data.tutor.nombre,
    materias: transformarTexto(data.tutor.materias),
    activas: data.tutor.tutorias_activas,
    completadas: data.tutor.tutorias_completadas,
    promedio: data.tutor.calificacion,
    tutoriasPorMes: {
      labels: data.tutor.tutorias_por_mes.map(m => m.mes.trim()),
      datos: data.tutor.tutorias_por_mes.map(m => m.total)
    }
  };
console.log(tutor.materias);
  let chart;

  onMount(() => {
    const canvas = document.getElementById('lineChartTutor');
    if (canvas instanceof HTMLCanvasElement) {
      const ctx = canvas.getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: tutor.tutoriasPorMes.labels,
          datasets: [{
            label: 'Tutorías por Mes',
            data: tutor.tutoriasPorMes.datos,
            borderColor: '#FBBF24',
            backgroundColor: '#FBBF24',
            tension: 0.4,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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

  const getStars = (count) => Array(count).fill('★').join('');
</script>

<!-- Contenido -->
<div class="contenido">
  <div class="titulo-barra">
    <h2 class="titulo">Tutores</h2>
    <div class="logo-container">
      <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo" />
    </div>
  </div>

  <!-- Línea con nombre, materias y estrellas -->
  <div class="info-linea">
    <h3>{tutor.nombre}</h3>
    <p class="materias">{tutor.materias}</p>
    <p class="estrellas">{getStars(tutor.promedio)}</p>
  </div>

  <!-- Tarjetas y gráfico -->
  <div class="tarjetas-grafico">
    <div class="tarjetas">
      <div class="card">
        <strong>{tutor.activas}</strong>
        <p>Tutorías activas</p>
      </div>
      <div class="card">
        <strong>{tutor.completadas}</strong>
        <p>Tutorías Completadas</p>
      </div>
      <div class="card">
        <strong>{tutor.promedio}/5</strong>
        <p>Promedio de Calificación</p>
      </div>
    </div>

    <div class="grafico">
      <h4>Tutorías por Mes</h4>
      <canvas id="lineChartTutor" width="600" height="300"></canvas>
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
  }

  .titulo {
    text-align: left;
    margin-bottom: 1rem;
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
    margin: 1rem 0 2rem;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .info-linea h3 {
    margin: 0;
    flex: 1;
  }

  .materias {
    text-align: center;
    margin: 0;
    flex: 1;
  }

  .estrellas {
    text-align: right;
    color: gold;
    font-size: 1.2rem;
    margin: 0;
    flex: 1;
  }

  .tarjetas-grafico {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .tarjetas {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .card {
    background: white;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    text-align: left;
    flex: 1;
    min-width: 200px;
  }

  .grafico {
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
