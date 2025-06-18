<script>
    let tipo = '';

</script>

<div class = "registrobox">
    <div class="imagen1">
        <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo">
    </div>
    <div class="Registro">
        <h1>Registro</h1>
    </div>
    <form>

        <div class="texto_titulo">
            <label for=name>Nombre</label>
            <input type="text" id=name>
        </div>

        <div class="texto_titulo">
            <label for=apellido>Apellido</label>
            <input type="text" id=apellido>
        </div>

        <div class="texto_titulo">
            <label for=correo>Correo institucional</label>
            <input type="email" id=correo>
        </div>

        <div class="texto_titulo">
            <label for=nacimiento>Fecha de nacimiento</label>
            <input type="date" id=nacimiento>
        </div>

        <div class="texto_titulo">
            <label for=userType>Tipo de usuario</label>
            <select bind:value={tipo} id=userType required>
                <option value="" disabled selected>Seleccione...</option>
                <option value="estudiante">Estudiante</option>
                <option value="tutor">Tutor</option>
            </select>
        </div>

        {#if tipo === 'estudiante'}
            <h3>Datos del Estudiante</h3>
            <div class="texto_titulo">
                <label for=faculty>Facultad</label>
                <select id=faculty>
                    <option value="" disabled selected>Seleccione...</option>
                    <option value="fac1">Ex. 1</option>
                    <option value="fac2">Ex. 2</option>
                    <option value="fac3">Ex. 3</option>
                    <option value="fac4">Ex. 4</option>
                </select>
            </div>

            <div class= "texto_titulo">
                <label for=carreer>Carrera</label>
                <select id=carreer>
                    <option value="" disabled selected>Seleccione...</option>
                    <option value="Carrera1">Ex. 1</option>
                    <option value="Carrera2">Ex. 2</option>
                    <option value="Carrera3">Ex. 3</option>
                    <option value="Carrera4">Ex. 4</option>
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
