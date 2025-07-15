<script>
  let facultades = [];
  let carreras = [];
  let id_facultad = '';
  let id_carrera = '';

  let usuario = '';
  let clave = '123456';
  let tipo_usuario = '';
  let nombre = '';
  let apellido = '';
  let correo_utp = '';
  let fe_nacimiento = '';
  
  let password = '';
  let confirmPassword = '';
  let materiaInput = '';
  let materias = [];
  let mostrarModalHorario = false;

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

  let disponibilidad = [];

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

  function abrirModalHorario() {
    mostrarModalHorario = true;
  }

  function cerrarModalHorario() {
    mostrarModalHorario = false;
  }

  function guardarHorario() {
    console.log('Día:', diaSeleccionado);
    console.log('Hora inicio:', horaInicio);
    console.log('Hora fin:', horaFin);
    
    // Aquí podrías guardar el horario en un array si quisieras

    mostrarModalHorario = false;
  }

  // Reactive statement que actualiza errorMensaje cuando password o confirmPassword cambian
  $: errorMensaje = (confirmPassword && password !== confirmPassword)
    ? 'Las contraseñas no coinciden'
    : '';
  
  function handleSubmit(event) {
    event.preventDefault();
    if (errorMensaje) {
      return; // Evita envío si hay error
    }
    
    // Procesar formulario
    console.log('Formulario válido, enviar...');
  }

  // Agrega la materia escrita al arreglo
  function agregarMateria() {
    const materia = materiaInput.trim();
    if (materia && !materias.includes(materia)) {
      materias = [...materias, materia];
    }
    materiaInput = '';
  }

  // Elimina materia de la lista si el usuario quiere
  function eliminarMateria(materia) {
    materias = materias.filter(m => m !== materia);
    
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
    usuario = correo_utp.split('@')[0];

    console.log({datos:{
      usuario: usuario,
      clave: clave,
      tipo_usuario: tipo_usuario,
      nombre: nombre,
      apellido: apellido,
      correo_utp: correo_utp,
      fe_nacimiento: fe_nacimiento,
      id_carrera: id_carrera
    }
    });

    /*const res = await fetch('http://localhost:3001/api/registro-estudiante', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ usuario, clave, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, id_carrera })
    });*/
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
      } catch (err) {
        console.error('Error en la API:', err);
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
            <input type="text" id=name bind:value={nombre}>
        </div>

        <div class="texto_titulo">
            <label for=apellido>Apellido</label>
            <input type="text" id=apellido bind:value={apellido}>
        </div>

        <div class="texto_titulo">
            <label for=correo>Correo institucional</label>
            <input type="email" id=correo bind:value={correo_utp}>
        </div>

        <div class="texto_titulo">
            <label for=nacimiento>Fecha de nacimiento</label>
            <input type="date" id=nacimiento bind:value={fe_nacimiento}>
        </div>

        <div class="texto_titulo">
            <label>Usuario</label>
            <input type="text">
        </div>

        <div class="texto_titulo">
          <label>Contraseña</label>
          <input type="password" bind:value={password} required>
        </div>

        <div class="texto_titulo">
          <label>Confirmar contraseña</label>
          <input type="password" bind:value={confirmPassword} required>
          
          {#if errorMensaje}
            <p class="error-mensaje">{errorMensaje}</p>
          {/if}
        </div>

        <div class="texto_titulo">
            <label for=userType>Tipo de usuario</label>
            <select bind:value={tipo_usuario} on:change={getFacultades} id=userType required>
                <option value="" disabled selected>Seleccione...</option>
                <option value="estudiante">Estudiante</option>
                <option value="tutor">Tutor</option>
            </select>
        </div>

        {#if tipo === 'tutor'}
          <div class="texto_titulo">
            <label>Disponibilidad de horario</label>
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
            <div class="disponibilidad-lista">
              <label>Días agregados:</label>
              {#each disponibilidad as item}
                <div class="disponibilidad-item">
                  🗓️ {item.dia}: {item.inicio} - {item.fin}
                  <button type="button" on:click={() => eliminarDisponibilidad(item.dia)}>✕</button>
                </div>
              {/each}
            </div>
          {/if}


          <div class="texto_titulo">
            <label>Materias que deseas enseñar</label>
          </div>
          
          <div class="materia-input">
            <input
              type="text"
              bind:value={materiaInput}
              placeholder="Materia..."
              on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarMateria())}
            />
            <button type="button" on:click={agregarMateria}> Agregar </button>
          </div>

          <div class="materias-lista">
            {#each materias as materia}
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
        <button type="submit">Registrarse</button>
    </form>
</div>

<style>
    :global(body) {
    background-color: #F2EEE6;
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
  }

  .registrobox {
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
    max-width: 400px;
    margin: 6rem auto;
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    width: 700px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .imagenlogo {
    width: 150px;
    margin-bottom: 0.1rem;
    opacity: 100%;

  }

  .Registro {
    padding-top: 1%;
    font-size: 9px;
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
    color: #F2EEE6;
    border: none;
    padding: 0.6rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s ease;
  }

  button:hover {
    background-color: #FBBF24;
    color: #1E1E2F;
  }

  a {
    color: #1E1E2F;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    color: #F59E0B;
    text-decoration: underline;
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
  }

  .materia-chip button {
    background: none;
    border: none;
    color: #F2EEE6;
    margin-left: 0.3em;
    cursor: pointer;
    font-weight: bold;
  }

  .disponibilidad-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal-content {
    background-color: #fff;
    border-radius: 12px;
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  .modal-content h2 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .dias-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .dias-selector button {
    padding: 0.5rem 1rem;
    border: 1px solid #1E1E2F;
    background-color: white;
    color: #1E1E2F;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .dias-selector button.activo {
    background-color: #FBBF24;
    color: #1E1E2F;
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

  .titulo_hora label {
    padding: 0.6rem;        
    border: 1px solid #ccc;     
    border-radius: 5px;        
    width: 100%;                
    box-sizing: border-box;  
  }

</style>
