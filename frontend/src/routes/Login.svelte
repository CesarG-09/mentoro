 <script>
  </script>


<div class="loginbox">
  <div class="imagen1">
    <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo">
  </div>
  <div class="titulo1">
    <h1 class="titulocentreado"> Iniciar Sesión </h1>
  </div>
  <form>
    <div class="correo">
      <label>Correo institucional</label>
      <input type="email"/>
    </div>

    <div class="contrasena">
      <label>Contraseña</label>
      <input type="password"/>
    </div>
    
    <button type="submit">Ingresar</button>
  </form>

  <p>¿No tienes cuenta? <a href="#/registro"><strong>Regístrate aquí</strong></a></p>  
</div>

<style>
  :global(body) {
    background-color: #F2EEE6;
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
  }

  .loginbox {
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
    max-width: 400px;
    margin: 5rem auto;
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .titulocentreado {
    padding-top: 5%;
    font-size: 20px;
    text-align: center;
    opacity: 100%;
  }

  .imagenlogo {
    width: 150px;
    margin-bottom: 0.1rem;
    opacity: 100%;

  }

  .correo {
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }


  .contrasena {
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%; 
    margin-left: 0; 
    margin-bottom: 0.3rem;
  }


  button {
    background-color: #1E1E2F;
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
