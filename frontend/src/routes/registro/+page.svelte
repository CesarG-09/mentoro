<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let error = '';
  let cargando = false;
  let mostrarLista = false;

  // DESPLEGABLES ESTUDIANTE
  let facultades = [];
  let carreras = [];
  let materias = [];
  let id_facultad = '';
  let id_carrera = '';
  let id_materia = '';

  //DATOS GENERALES
  let usuario = '';
  let clave = '';
  let confirmClave = '';
  let tipo_usuario = '';
  let nombre = '';
  let apellido = '';
  let correo_utp = '';
  let fe_nacimiento = '';
  
  //DESPLEGABLE TUTOR
  let materiasSelected = [];
  let materiaInput = '';

  //SECCION DISPONIBILIDAD
  let disponibilidad = [];
  let diaSeleccionado = 'Domingo';
  let horaInicio = '07:00';
  let horaFin = '08:00';

  const diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ];

  onMount(() => {
    nombre = '';
    apellido = '';
    correo_utp = '';
    fe_nacimiento = '';
    usuario = '';
    clave = '';
    confirmClave = '';
    tipo_usuario = '';
  });

  function agregarDisponibilidad() {
    if (!diaSeleccionado || !horaInicio || !horaFin) return;
    disponibilidad = [
      ...disponibilidad,
      { dia: diaSeleccionado, inicio: horaInicio, fin: horaFin }
    ];
    // Limpiar selección
    diaSeleccionado = '';
    horaInicio = '07:00';
    horaFin = '08:00';
  }

  function eliminarDisponibilidad(dia) {
    disponibilidad = disponibilidad.filter(d => d.dia !== dia);
  }

  // Reactive statement que actualiza errorMensaje cuando clave o confirmClave cambian
  $: errorMensaje = (confirmClave && clave !== confirmClave)
    ? 'Las contraseñas no coinciden'
    : '';

  // Variable reactiva que actualiza el listado filtrado automáticamente
  $: materiasFiltradas = materias.filter(materia =>
    materia.de_materia.toLowerCase().includes(materiaInput.toLowerCase())
  );

  function seleccionarMateria(nombre) {
    materiaInput = nombre;
    mostrarLista = false;
  }

  function quitarAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function agregarMateria() {
    const materia = materiaInput.trim();

    // Verifica si existe dentro del arreglo de materias
    const existe = materias.some(m => m.de_materia.toLowerCase() === materia.toLowerCase());

    if (materia && existe && !materiasSelected.includes(materia)) {
      materiasSelected = [...materiasSelected, materia];
    }

    materiaInput = '';
  }

  function eliminarMateria(materia) {
    materiasSelected = materiasSelected.filter(m => m !== materia);
  }

  function registrar() {
    if (tipo_usuario === 'estudiante') {
      regirtrarEstudiante();
    } else if (tipo_usuario === 'tutor') {
      registrarTutor();
    } else {
      alert('Debes seleccionar un tipo de usuario');
    }
  }

  async function regirtrarEstudiante() {
    error = '';
    cargando = true;

    try {
      const res = await fetch('http://localhost:3001/api/registro-estudiante', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ usuario, clave, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, id_carrera })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        const tipo = data.usuario.tipo_usuario;
        if (tipo === 'estudiante') {
          goto('/estudiante/inicio');
        } else if (tipo === 'tutor') {
          //goto('/tutor/inicio');
        } else {
          error = 'Tipo de usuario desconocido';
          console.log(error);
        }
      } else {
        error = data.error || data.mensaje || 'Error en registro';
      }
    } catch (e) {
      error = "Error al conectar con el servidor";
      console.log(error);
    } finally {
      cargando = false;
    }
  }

  async function registrarTutor() {
    console.log("Registro de tutor");
  }

  async function getFacultades() {
    if (tipo_usuario === 'estudiante') {
      try {
        const res = await fetch('http://localhost:3001/api/facultades');
        if (!res.ok) throw new Error('Error al obtener facultades');
        const data = await res.json();
        facultades = data.facultades;
        console.log("facultades");
      } catch (err) {
        console.error('Error en la API: ', err);
      }
    }
  }

  async function getCarreras() {
    try {
      const facultadObj = facultades.find(f => f.id_facultad == id_facultad);
      const res = await fetch(`http://localhost:3001/api/carreras?facultad=${encodeURIComponent(facultadObj.de_facultad)}`);
      if (!res.ok) throw new Error('Error al obtener carreras');
      const data = await res.json();
      carreras = data.carreras;
    } catch (err) {
      console.error('Error en la API:', err);
    }
  }

  async function getMaterias() {
    if (tipo_usuario === 'tutor') {
      try {
        const res = await fetch('http://localhost:3001/api/materias');
        if (!res.ok) throw new Error('Error al obtener materias');
        const data = await res.json();
        console.log("si carga");
        materias = data.materias.map(m => ({
          ...m,
          de_materia: quitarAcentos(m.de_materia)
        }));
      } catch (err) {
        console.error('Error de la API: ', err);
      }
    }
  }
</script>

<div class = "registrobox">
    <div class="imagen1">
        <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo">
    </div>
    <div class="Registro">
        <h1>Registro</h1>
    </div>
    <form on:submit|preventDefault={registrar}>

        <div class="texto_titulo">
            <label for=name>Nombre</label>
            <input type="text" id=name bind:value={nombre} autocomplete="off">
        </div>

        <div class="texto_titulo">
            <label for=apellido>Apellido</label>
            <input type="text" id=apellido bind:value={apellido} autocomplete="off">
        </div>

        <div class="texto_titulo">
            <label for=correo>Correo institucional</label>
            <input type="email" id=correo bind:value={correo_utp} autocomplete="off">
        </div>

        <div class="texto_titulo">
            <label for=nacimiento>Fecha de nacimiento</label>
            <input type="date" id=nacimiento bind:value={fe_nacimiento} autocomplete="off">
        </div>

        <div class="texto_titulo">
            <label for=usuario>Usuario</label>
            <input id=usuario type="text" bind:value={usuario} autocomplete="off">
        </div>

        <div class="texto_titulo">
          <label for=clave>Contraseña</label>
          <input id=clave type="password" bind:value={clave} required>
        </div>

        <div class="texto_titulo">
          <label for=confirmpass>Confirmar contraseña</label>
          <input id=confirmpass type="password" bind:value={confirmClave} required>
          
          {#if errorMensaje}
            <p class="error-mensaje">{errorMensaje}</p>
          {/if}
        </div>

        <div class="texto_titulo">
            <label for=userType>Tipo de usuario</label>
            <select bind:value={tipo_usuario} on:change={getFacultades(), getMaterias} id=userType autocomplete="off" required>
                <option value="" disabled selected>Seleccione...</option>
                <option value="estudiante">Estudiante</option>
                <option value="tutor">Tutor</option>
            </select>
        </div>

        {#if tipo_usuario === 'tutor'}
          <div id=disponibilidad class="texto_titulo">
            <label for=disponibilidad>Disponibilidad de horario</label>
          </div>

          <div class="dias-circulos">
            {#each diasSemana as dia}
              <button
                type="button"
                class="dia-circulo {dia === diaSeleccionado ? 'activo' : ''} {disponibilidad.find(d => d.dia === dia) ? 'ya-agregado' : ''}"
                on:click={() => !disponibilidad.find(d => d.dia === dia) && (diaSeleccionado = dia)}
                disabled={disponibilidad.find(d => d.dia === dia)}
              >
                {dia[0]}
              </button>
            {/each}
          </div>

          {#if diaSeleccionado}
            <div class="horario-fields">
              <label class="titulo_hora">
                Hora de inicio:
                <input type="time" bind:value={horaInicio}>
              </label>
              <label class="titulo_hora">
                Hora de fin:
                <input type="time" bind:value={horaFin}>
              </label>
              <button type="button" on:click={agregarDisponibilidad}>Agregar disponibilidad</button>
            </div>
          {/if}

          {#if disponibilidad.length > 0}
            <div id=aggdias class="disponibilidad-lista">
              <label for=aggdias>Días agregados:</label>
              {#each disponibilidad as item}
                <div class="disponibilidad-item">
                  🗓️ {item.dia}: {item.inicio} - {item.fin}
                  <button type="button" on:click={() => eliminarDisponibilidad(item.dia)}>✕</button>
                </div>
              {/each}
            </div>
          {/if}


          <div id=aggmaterias class="texto_titulo">
            <label for=aggmaterias>Materias que deseas enseñar</label>
          </div>
          
          <div class="materia-input">
            <input
              type="text"
              bind:value={materiaInput}
              placeholder="Materia..."
              on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarMateria())}
              on:focus={() => mostrarLista = true}
            />
            <button type="button" on:click={agregarMateria}> Agregar </button>
          </div>

          {#if mostrarLista}
            <div class="dropdown">
              {#each materiasFiltradas as materia}
                <button
                  type="button"
                  class="item"
                  on:click={() => seleccionarMateria(materia.de_materia)}>
                  {materia.de_materia}
                </button>
              {/each}
            </div>
          {/if}

          <div class="materias-lista">
            {#each materiasSelected as materia}
              <div class="materia-chip">
                {materia}
                <button type="button" on:click={() => eliminarMateria(materia)}>✕</button>
              </div>
            {/each}
          </div>
        {/if}

        {#if tipo_usuario === 'estudiante'}
            <h3>Datos del Estudiante</h3>
            <div class="texto_titulo">
                <label for=faculty>Facultad</label>
                <select id=faculty bind:value={id_facultad} on:change={getCarreras}>
                    <option value="" disabled selected>Seleccione...</option>
                    {#each facultades as facultad}
                        <option value={facultad.id_facultad}>{facultad.de_facultad}</option>
                    {/each}
                </select>
            </div>
            <div class= "texto_titulo">
                <label for=carreer>Carrera</label>
                <select id=carreer bind:value={id_carrera}>
                    <option value="" disabled selected>Seleccione...</option>
                    {#each carreras as carrera}
                        <option value={carrera.id_carrera}>{carrera.de_carrera}</option>
                    {/each}
                </select>
            </div>
        {/if}
        <div class="registrar">
            <button type="submit" disabled={cargando}>
            {#if cargando}
                Registrando...
            {:else}
                Registrarse
            {/if}
            </button>
        </div>
    </form>
</div>

{#if cargando}
  <p style="text-align: center; margin-top: 10px;">Validando datos...</p>
{/if}

{#if error}
  <p style="color: red; text-align: center;">{error}</p>
{/if}

{#if cargando}
  <div class="spinner"></div>
{/if}

<style>
    :global(body) {
    background-color: #F2EEE6;
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
  }

  .dropdown {
    border: 1px solid #ccc;
    background: white;
    position: absolute;
    z-index: 10;
    width: 200px;
    max-height: 140px; /* Altura máxima */
    min-width: 315px;
    overflow-y: auto;  /* Scroll si excede */
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
    border-radius: 5px;
    margin-top: -5px;
  }

  .item {
    all: unset;               /* Resetea casi todos los estilos del botón */
    display: block;           /* Que ocupe toda la línea */
    width: 100%;              /* Ancho completo del dropdown */
    padding: 0.5rem;          /* Espaciado cómodo */
    cursor: pointer;          /* Cursor tipo mano */
    border-radius: 0;         /* Sin bordes redondeados */
    text-align: left;         /* Texto alineado a la izquierda */
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
  }

  .item:hover,
  .item:focus {
    background-color: #eee;   /* Fondo claro al pasar o foco */
    outline: none;            /* Sin outline extra */
  }

  .spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #1E1E2F;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 0.8s linear infinite;
    margin: 10px auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .registrobox {
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
    max-width: 400px;
    margin: 6rem auto;
    margin-bottom: 50px;
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    width: 700px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .imagen1, .registrar {
    text-align: center;
  }

  .imagenlogo {
    width: 150px;
    margin-bottom: 0.1rem;
    opacity: 100%;
  }

  .Registro {
    padding-top: 1%;
    font-size: 14px;
    text-align: center;
    opacity: 100%;
  }

  .texto_titulo {
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 0.3rem;
    color: #1E1E2F;
  }

  input, select {
    padding: 0.6rem;        
    border: 1px solid #ccc;     
    border-radius: 5px;        
    width: 100%;                
    box-sizing: border-box;  
  }

  button {
    background-color: #1E1E2F;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #F2EEE6;
    border: none;
    padding: 0.6rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s ease;
    font-size: 14px;
    font-family: 'Segoe UI', sans-serif;
    height: 42px;
  }

  button:hover {
    background-color: #FBBF24;
    color: #1E1E2F;
  }

  .error-mensaje{
    color: #ce1414;
    text-decoration: none;
    font-weight: lighter;
  }

  .materia-input {
    display: flex;
    gap: 0.7rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .materia-input input,
  .materia-input button {
    border-radius: 5px;
    font-size: 14px;
    font-family: 'Segoe UI', sans-serif;
    box-sizing: border-box;
    height: 42px;
  }

  .materia-input input {
    border: 1px solid #ccc;
    flex: 1;
  }
  .materia-input button {
    background-color: #1E1E2F;
    color: #F2EEE6;
    border: none;
    padding: 0.6rem;
    margin: 0rem;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s ease;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
  }

  .materia-input button:hover {
    background-color: #FBBF24;
    color: #1E1E2F;
  }

  .materias-lista {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .materia-chip {
    display: flex;
    align-items: center;
    background-color: #1E1E2F;
    color: #F2EEE6;
    padding: 0.0005rem 0.6rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: bold;
    height: 40px;
  }

  .materia-chip button {
    background: none;
    border: none;
    color: #F2EEE6;
    margin-left: 0.3em;
    cursor: pointer;
    font-weight: bold;
  }

  .dias-circulos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }

  .dia-circulo {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 2px solid #1E1E2F;
    background-color: #ffffff;
    color: #1E1E2F;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s ease;
  }

  .dia-circulo:hover {
    background-color: #FBBF24;
    color: #1E1E2F;
  }

  .dia-circulo.activo {
    background-color: #FBBF24;
    border-color: #FBBF24;
    color: #1E1E2F;
  }

  .horario-fields {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .horario-fields label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .disponibilidad-lista {
    margin-top: 1rem;
    background-color: #F9F6EF;
    padding: 0.8rem;
    border-radius: 8px;
  }

  .disponibilidad-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.3rem;
    font-size: 0.95rem;
  }

  .disponibilidad-item button {
    background: none;
    border: none;
    color: #ce1414;
    cursor: pointer;
    font-weight: bold;
  }

  .dia-circulo.ya-agregado {
    background-color: #1E1E2F;
    color: #F2EEE6;
    border-color: #1E1E2F;
    opacity: 0.6;
    cursor: not-allowed;
  }

</style>
