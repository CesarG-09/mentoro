<script>
  import { onMount, onDestroy } from 'svelte';
  import Datepicker from 'flowbite-datepicker/Datepicker';

  let fechaSeleccionada = '';
  let materiaSeleccionada = '';
  let horasSeleccionadas = 1;
  let materias = ['Cálculo I', 'Álgebra', 'Química'];
  let disponibilidad = [];
  let franjaSeleccionada = '';
  let tutorNombre = 'Prof. Juan Pérez';

  const hoy = new Date('2025-07-28'); // Cambiar a new Date() en producción
  let fechaMinima = hoy.toISOString().split('T')[0];

  let picker;

  function actualizarDisponibilidad() {
    const franjas = [
      '2:00 p.m. - 3:00 p.m.',
      '3:00 p.m. - 4:00 p.m.',
      '4:00 p.m. - 5:00 p.m.',
      '5:00 p.m. - 6:00 p.m.',
      '6:00 p.m. - 7:00 p.m.',
    ];
    disponibilidad = [];
    for (let i = 0; i <= franjas.length - horasSeleccionadas; i++) {
      const grupo = franjas.slice(i, i + horasSeleccionadas);
      disponibilidad.push(grupo.join(', '));
    }
    franjaSeleccionada = '';
  }

  function seleccionarFranja(franja) {
    franjaSeleccionada = franja;
  }

  function aumentarHoras() {
    if (horasSeleccionadas < 3) {
      horasSeleccionadas++;
      actualizarDisponibilidad();
    }
  }

  function disminuirHoras() {
    if (horasSeleccionadas > 1) {
      horasSeleccionadas--;
      actualizarDisponibilidad();
    }
  }

  onMount(() => {
    const input = document.getElementById('datepickerEl');
    picker = new Datepicker(input, {
      format: 'yyyy-mm-dd',
      minDate: fechaMinima,
      autohide: false,
      todayHighlight: false,
    });

    const handleOutsideClick = (event) => {
      const calendar = document.querySelector('.datepicker');
      if (
        calendar &&
        !calendar.contains(event.target) &&
        !input.contains(event.target)
      ) {
        picker.hide();
      }
    };

    const handleRouteChange = () => {
      picker.hide();
    };

    input.addEventListener('changeDate', (e) => {
      const fecha = e.detail.date;
      const seleccion = fecha.toISOString().split('T')[0];
      if (new Date(seleccion) > hoy) {
        fechaSeleccionada = seleccion;
      } else {
        fechaSeleccionada = '';
      }
      picker.hide();
    });

    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('popstate', handleRouteChange);

    actualizarDisponibilidad();

    onDestroy(() => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('popstate', handleRouteChange);
      picker?.destroy();
    });
  });
</script>


<div class="reserva-container">
  <h2>Reservar tutoría</h2>
  <p class="nombre-tutor">Nombre del tutor: <strong>{tutorNombre}</strong></p>

  <label>Materia:</label>
  <select bind:value={materiaSeleccionada} class="form-select">
    <option value="" disabled selected>Seleccione materia...</option>
    {#each materias as materia}
      <option value={materia}>{materia}</option>
    {/each}
  </select>

  <label>Selecciona una fecha:</label>
  <input id="datepickerEl" type="text" class="form-input" placeholder="Elegir fecha" readonly />
  {#if fechaSeleccionada}
    <p><strong>Fecha seleccionada:</strong> {fechaSeleccionada}</p>
  {/if}

  <label>Cantidad de horas:</label>
  <div class="hora-selector">
    <button on:click={disminuirHoras}>-</button>
    <span>{horasSeleccionadas} {horasSeleccionadas === 1 ? 'hora' : 'horas'}</span>
    <button on:click={aumentarHoras}>+</button>
  </div>

  {#if disponibilidad.length > 0}
    <div class="disponibilidad">
      <h3>Disponibilidad:</h3>
      <ul>
        {#each disponibilidad as franja}
          <li class:selected={franjaSeleccionada === franja} on:click={() => seleccionarFranja(franja)}>{franja}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <button class="form-button" disabled={!materiaSeleccionada || !fechaSeleccionada || !franjaSeleccionada}>
    Enviar solicitud
  </button>
</div>

<style>
  .reserva-container {
    max-width: 600px;
    margin: 2rem auto;
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 4px 4px 0 #f2cd6d;
    font-family: sans-serif;
  }

  h2 {
    margin-bottom: 0.5rem;
  }

  .nombre-tutor {
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  label {
    margin-top: 1rem;
    display: block;
    font-weight: bold;
  }

  .form-select, .form-input {
    width: 100%;
    padding: 12px;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    border: none;
    border-radius: 12px;
    box-shadow: 3px 3px 0 #bbb;
    font-size: 1rem;
  }

  .hora-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
  }

  .hora-selector button {
    background-color: #FFBF00;
    border: none;
    padding: 8px 16px;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
  }

  .form-button {
    width: 100%;
    padding: 12px;
    background-color: #FFBF00;
    color: black;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
  }

  .form-button:hover:enabled {
    background-color: #FFA500;
  }

  .form-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .disponibilidad ul {
    list-style: none;
    padding-left: 0;
    margin-top: 1rem;
  }

  .disponibilidad li {
    padding: 10px;
    margin: 0.3rem 0;
    border-radius: 8px;
    background-color: #f8f8f8;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .disponibilidad li:hover {
    background-color: #f2cd6d;
  }

  .disponibilidad li.selected {
    background-color: #1e1e2f;
    color: white;
  }
</style>
