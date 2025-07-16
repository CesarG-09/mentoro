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
            <label for=userType>Tipo de usuario</label>
            <select bind:value={tipo_usuario} on:change={getFacultades} id=userType required>
                <option value="" disabled selected>Seleccione...</option>
                <option value="estudiante">Estudiante</option>
                <option value="tutor">Tutor</option>
            </select>
        </div>

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
</style>
