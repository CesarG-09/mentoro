<script>
  import { enhance } from '$app/forms';
  export let form;

  let usuario = '';
  let clave = '';
  let cargando = false;
  let mensajeError = '';

  function customEnhance({ form, data, cancel }) {
    cargando = true;
    mensajeError = '';

    return async ({ result, error, update }) => {
      if (error) {
        cargando = false;
        mensajeError = error?.message || 'Error desconocido';
      } else if (result) {
        cargando = false;
        update(result);

        if (result.type === 'failure') {
          mensajeError = result.data?.error || 'Error en validación';
        }
      }
    };
  }

  $: if (form?.error) {
    mensajeError = form.error;
  }
</script>

<div class="loginbox">
  <div class="imagen1">
      <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo">
  </div>

  <div class="titulo1">
      <h1 class="titulocentreado">Iniciar Sesión</h1>
  </div>

  <form method="POST" use:enhance={customEnhance}>
    <div class="correo">
        <label class="inputText" for="usuario">Usuario</label>
        <input type="text" id="usuario" name="usuario" bind:value={usuario} autocomplete="off" required />
    </div>

    <div class="contrasena">
        <label class="inputText" for="clave">Contraseña</label>
        <input type="password" id="clave" name="clave" bind:value={clave} required />
    </div>

    <div class="loginRegistro">
        <button type="submit" disabled={cargando}>
          {#if cargando}
            Ingresando...
          {:else}
            Ingresar
          {/if}
        </button>
        <p>¿No tienes cuenta? <a href="/registro"><strong>Regístrate aquí</strong></a></p>
    </div>
  </form>
</div>

{#if cargando}
  <p style="text-align: center; margin-top: 0px;">Validando credenciales...</p>
  <div class="spinner"></div>
{/if}

{#if mensajeError}
  <p style="color: red; text-align: center;">{mensajeError}</p>
{/if}

<style>
  :global(body) {
    background-color: #F2EEE6;
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
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

  .loginbox {
    display: flex;
    flex-direction: column;
    max-width: 350px;
    min-width: 250px;
    margin: 10% auto;
    margin-bottom: 50px;
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .titulo1 {
    text-align: center;
  }

  .titulocentreado {
    font-size: 20px;
  }

  .imagen1 {
    text-align: center;
  }

  .imagenlogo {
    width: 150px;
  }

  .inputText {
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }

  .correo, .contrasena {
    max-width: 400px;
    margin: 0 auto; /* centra el div */
  }

  .loginRegistro {
    text-align: center;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 0.5rem;
    box-sizing: border-box;
  }

  button {
    background-color: #1E1E2F;
    color: #F2EEE6;
    border: none;
    margin-top: 0.5rem;
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

  p {
    margin-bottom: 0px;
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
