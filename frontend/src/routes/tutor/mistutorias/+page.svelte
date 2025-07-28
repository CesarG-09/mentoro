<script>
  import { transformarTexto } from "../../../utils/transformarTexto";
  import { convertDateToSpanish } from "../../../utils/convertDates";
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

  export let data;

  let estado;

  let solicitudes = data.tutoriasEnEspera.map(m => ({ ...m, materia: transformarTexto(m.materia) })).map(m => ({ ...m, fecha: convertDateToSpanish(m.fecha)}));

  let activas = data.tutoriasActivas.map(m => ({ ...m, materia: transformarTexto(m.materia) })).map(m => ({ ...m, fecha: convertDateToSpanish(m.fecha)}));

  function handleResult({ form, data, cancel }) {
    return async ({ result, error, update }) => {
      if (error) {
        console.error('Error en acción', result.data);
      } else if (result) {
        console.log('Action exitosa', result.data);
        solicitudes = result.data.tutoriasEnEspera.map(m => ({ ...m, materia: transformarTexto(m.materia) })).map(m => ({ ...m, fecha: convertDateToSpanish(m.fecha)}));
        activas = result.data.tutoriasActivas.map(m => ({ ...m, materia: transformarTexto(m.materia) })).map(m => ({ ...m, fecha: convertDateToSpanish(m.fecha)}));
        update(result);
        if (result.type === 'failure') {
          console.error('Error en acción', result.data);
        }
      }
    };
  }

  onMount(() => {
    document.querySelectorAll('button').forEach(boton =>
      boton.addEventListener('click', () => {
        estado = boton.getAttribute('data-texto');
        if (estado === 'Aceptada') estado = 'En Progreso';
      })
    );
  });
</script>

<div class="header">
  <h2>Mis Tutorias</h2>
</div>

<div class="panel">
  
    <section>
      <h3>📬 Solicitudes pendientes ({solicitudes.length})</h3>
      {#if solicitudes.length === 0}
        <p>No tienes solicitudes pendientes.</p>
      {:else}
        <div class="grid">
          {#each solicitudes as s}
            <form method="POST" use:enhance={handleResult}>
              <div class="tarjeta solicitud">
                <h4>{s.materia}</h4>
                <p>👨‍🎓 Estudiante: <strong>{s.estudiante}</strong></p>
                <p>📅 Fecha: <strong>{s.fecha}</strong></p>
                <p>🕒 Horario: <strong>{s.horario}</strong></p>
                <div class="acciones">
                  <button type="submit" class="aceptar" data-texto="Aceptada">✅ Aceptar</button>
                  <button type="submit" class="rechazar" data-texto="Rechazada">❌ Rechazar</button>
                  <input type="hidden" name="id_reserva" value={s.id}>
                  <input type="hidden" name="estado" value={estado}>
                </div>
              </div>
            </form>
          {/each}
        </div>
      {/if}
    </section>

    <section>
      <h3>🔔 Tutorías activas ({activas.length})</h3>
      {#if activas.length === 0}
        <p>No tienes tutorías activas.</p>
      {:else}
        <div class="grid">
          {#each activas as t}
            <form method="POST" use:enhance={handleResult}>
              <div class="tarjeta activa">
                <h4>{t.materia}</h4>
                <p>👨‍🎓 Estudiante: <strong>{t.estudiante}</strong></p>
                <p>📅 Fecha: <strong>{t.fecha}</strong></p>
                <p>🕒 Horario: <strong>{t.horario}</strong></p>
                <div class="acciones">
                  <button type="submit" class="cancelar" data-texto="Cancelada">🔴 Cancelar</button>
                  <input type="hidden" name="id_reserva" value={t.id}>
                  <input type="hidden" name="estado" value={estado}>
                </div>
              </div>
            </form>
          {/each}
        </div>
      {/if}
    </section>
</div>

<style>
    .header {
    display: flex;
    align-items: center;
    padding: 2rem 2rem 0rem 5rem;
    max-width: 1200px;
    cursor:default;
  }
  .panel {
    max-width: 1000px;
    margin: auto;
    cursor:default;
  }

  section {
    margin-bottom: 3rem;
  }

  h3 {
    margin-bottom: 1rem;
  }

  .grid {
    display: grid;
    gap: 1.5rem;
  }

  .tarjeta {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .tarjeta h4 {
    margin: 0rem;
  }

  .tarjeta p {
    margin: 0.3rem 0;
  }

  .acciones {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
  }

  button {
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
  }

  .aceptar {
    background-color: #10B981;
    color: white;
  }

  .rechazar {
    background-color: #6B7280;
    color: white;
  }

  .cancelar {
    background-color: #EF4444;
    color: white;
  }
</style>