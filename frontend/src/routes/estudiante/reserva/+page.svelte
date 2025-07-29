<script>
  import { transformarTexto } from '../../../utils/transformarTexto'
  import { onMount, onDestroy } from 'svelte';
  import Datepicker from 'flowbite-datepicker/Datepicker';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';

  export let data;

  const fecha = new Date();
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const dd = String(fecha.getDate()).padStart(2, '0');
  const fechaMinima = `${yyyy}-${mm}-${dd}`;

  let calendarioDOM = null;
  let picker;
  let input;
  let calendarioVisible = false;
  let fechasDeshabilitadas = [];
  let diasDeshabilitados = [];
  let fechaSeleccionada = '';

  let horaInicio = '06:00';
  let horaFin;

  let materiaSeleccionada = '';
  let horasSeleccionadas = 1;
  let materias = data.datosMaterias.map(m => ({...m, de_materia: transformarTexto(m.de_materia)}));
  let id_tutor = data.id_tutor;
  let id_materia;
  let tutorNombre = data.nombre;

  function aumentarHoras() {
    if (horasSeleccionadas < 3) {
      horasSeleccionadas++;
    }
  }

  function disminuirHoras() {
    if (horasSeleccionadas > 1) {
      horasSeleccionadas--;
    }
  }

  function toggleCalendario() {
    const calendar = document.querySelector('.datepicker-dropdown');
    if (!calendar) return;

    if (calendarioVisible) {
      calendar.classList.remove('active', 'block');
      calendar.classList.add('hidden');
      calendar.style.display = 'none';
      calendarioVisible = false;
    } else {
      calendar.classList.add('active', 'block');
      calendar.classList.remove('hidden');
      calendar.style.display = 'block';
      calendarioVisible = true;
    }
  }

  function handleOutsideClick(event) {
    const calendar = document.querySelector('.datepicker-dropdown');
    if (
      calendar &&
      !calendar.contains(event.target) &&
      input &&
      !input.contains(event.target)
    ) {
      calendar.classList.remove('active', 'block');
      calendar.classList.add('hidden');
      calendar.style.display = 'none';
      calendarioVisible = false;
    }
  }

  function handleResult_1({ form, data, cancel }) {
    input.disabled = false;
    return async ({ result, error, update }) => {
      if (error) {
        console.error('Error en acción', result.data);
      } else if (result) {
        console.log('Action exitosa', result.data);
        fechasDeshabilitadas = result.data.datosFechas
        diasDeshabilitados = result.data.datosDias
        id_materia = result.data.id_materia
        horaFin = result.data.hora_fin
        if (diasDeshabilitados.length === 7) {
          input.disabled = true;
        } else {
          input.disabled = false;
          picker.setOptions({
            datesDisabled: fechasDeshabilitadas,
            daysOfWeekDisabled: diasDeshabilitados,
          });
        }
        console.log(picker.daysOfWeekDisabled)
        if (result.type === 'failure') {
          console.error('Error en acción', result.data);
        }
      }
    };
  }

  function handleResult_2({ form, data, cancel }) {
    return async ({ result, error, update }) => {
      if (error) {
        console.error('Error en acción', result.data);
      } else if (result) {
        console.log('Action exitosa', result.data);
        update(result);
        if (result.type === 'failure') {
          console.error('Error en acción', result.data);
        }
      }
    };
  }

  onMount(() => {
    input = document.getElementById('datepickerEl');

    const anterior = document.querySelector('.datepicker-dropdown');
    if (anterior) anterior.remove();

    picker = new Datepicker(input, {
      datesDisabled: fechasDeshabilitadas,
      format: 'yyyy-mm-dd',
      minDate: fechaMinima,
      autohide: false, // Controlamos nosotros el hide
      todayHighlight: false
    });

    // Esperar a que el DOM esté montado
    setTimeout(() => {
      calendarioDOM = document.querySelector('.datepicker-dropdown');
    }, 50);

    input.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita que el click fuera lo cierre al instante
      toggleCalendario();
    });

    input.addEventListener('changeDate', (e) => {
      const fecha = e.detail.date;
      const seleccion = fecha.toISOString().split('T')[0];
      fechaSeleccionada = seleccion;

      setTimeout(() => {
        const calendar = document.querySelector('.datepicker-dropdown');
        if (calendar) {
          calendar.classList.remove('active', 'block');
          calendar.classList.add('hidden');
          calendar.style.display = 'none';
          calendarioVisible = false;
        }
      }, 100);
    });

    document.addEventListener('click', handleOutsideClick);

    const handleRouteChange = () => {
      const calendario = document.querySelector('.datepicker-dropdown');
      calendario?.remove();
      calendarioVisible = false;
    };
    window.addEventListener('popstate', handleRouteChange);

    onDestroy(() => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('popstate', handleRouteChange);
      picker?.destroy();
      calendarioDOM?.remove(); // 🧹 limpiar calendario flotante
      calendarioDOM = null;
    });
    
    input.disabled = true;
  });
</script>

<div class="reserva-container">
  <form method="POST" action="?/consultarFechas" use:enhance={handleResult_1}>
    <h2>Reservar tutoría</h2>
    <p class="nombre-tutor">Nombre del tutor: <strong>{tutorNombre}</strong></p>
    <input type="hidden" name="id_tutor" value={id_tutor} />

    <label for="">Materia:</label>
    <select name="id_materia" bind:value={materiaSeleccionada} class="form-select">
      <option value="" disabled selected>Seleccione materia...</option>
      {#each materias as materia}
        <option value={materia.id_materia}>{materia.de_materia}</option>
      {/each}
    </select>

    <div class="date-container">
      <div>
        <label for="">Hora de inicio:</label>
        <input name="hora_inicio" step="1800" type="time" class="form-input" placeholder="Ingresar hora" bind:value={horaInicio} required />
      </div>

      <div>
        <label for="">Cantidad de horas:</label>
        <div class="hora-selector">
          <button type="button" on:click={disminuirHoras}>-</button>
          <span>{horasSeleccionadas} {horasSeleccionadas === 1 ? 'hora' : 'horas'}</span>
          <button type="button" on:click={aumentarHoras}>+</button>
          <input type="hidden" name="horasSeleccionadas" value={horasSeleccionadas}>
        </div>
      </div>
    </div>
    <button type="submit" class="form-button" disabled={!materiaSeleccionada}>Consultar fechas</button>
  </form>

  <form method="POST" action="?/reservarTutoria" use:enhance={handleResult_2}>
    {#if diasDeshabilitados.length === 7}
      <p style="color: crimson; text-aling: center">Fechas no disponibles</p>
    {/if}
    <div>
      <label for="">Selecciona una fecha:</label>
      <input name="fe_reserva" id="datepickerEl" type="text" class="form-input" placeholder="Elegir fecha" readonly/>
    </div>

    <input type="hidden" name="id_tutor" value={id_tutor} />
    <input type="hidden" name="id_usuario" value={data.id_usuario} />
    <input type="hidden" name="id_materia" value={id_materia} />
    <input type="hidden" name="hora_inicio" value={horaInicio} />
    <input type="hidden" name="hora_fin" value={horaFin} />

    <button class="form-button" disabled={!fechaSeleccionada}>
      Enviar solicitud
    </button>
  </form>
</div>


<style>
  .date-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 66px;
  }

  .reserva-container {
    max-width: 405px;
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
    width: 99%;
    padding: 12px;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    border: none;
    border-radius: 12px;
    box-shadow: 3px 3px 0 #bbb;
    font-size: 1rem;
  }

  .form-input {
    width: 94%;
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
</style>
