<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-navigator';
  let correo_utp  = '';
  let clave = '';
  let error = '';
  let cargando = false;

  async function login() {
    error = '';
    cargando = true;

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ correo_utp, clave })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        const tipo = data.usuario.tipo_usuario;
        if (tipo === 'estudiante') {
          navigate('/estudiante/inicio');
        } else if (tipo === 'profesor') {
          //navigate('/profesor/inicio');
        } else {
          error = 'Tipo de usuario desconocido';
          console.log(error);
        }
      } else {
        error = data.error || data.mensaje || 'Error en login';
      }
    } catch (e) {
      error = "Error al conectar con el servidor";
      console.log(error);
    } finally {
      cargando = false;
    }
  }
</script>

<div class="loginbox">
  <div class="imagen1">
    <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo">
  </div>
  <div class="titulo1">
    <h1 class="titulocentreado" > Iniciar Sesión </h1>
  </div>
  <form on:submit|preventDefault={login}>
    <div class="correo">
      <label for=email>Correo institucional</label>
      <input type="email" id=email bind:value={correo_utp} required />
    </div>

    <div class="contrasena">
      <label for=password>Contraseña</label>
      <input type="password" id=password bind:value={clave} required />
    </div>
    
    <button type="submit" disabled={cargando}>
      {#if cargando}
        Ingresando...
      {:else}
        Ingresar
      {/if}
    </button>
  </form>
  <p>¿No tienes cuenta? <a href="#/registro"><strong>Regístrate aquí</strong></a></p>  
</div>

{#if cargando}
  <p style="text-align: center; margin-top: 10px;">Validando credenciales...</p>
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
