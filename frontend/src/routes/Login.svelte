<script>
    import { navigate } from 'svelte-navigator';
    let correo = '';
    let contrasena = '';
    let error = '';
  
    async function iniciarSesion() {
      error = '';
      try {
        const res = await fetch('http://172.29.36.160:3001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, contrasena })
        });
  
        const data = await res.json();
  
        if (data.success) {
          navigate('/dashboard');
        } else {
          error = data.mensaje;
        }
      } catch (e) {
        error = "Error al conectar con el servidor";
      }
    }
  </script>
  
  <h1>Inicio de Sesión</h1>
  <input type="email" placeholder="Correo" bind:value={correo} />
  <input type="password" placeholder="Contraseña" bind:value={contrasena} />
  <button on:click={iniciarSesion}>Ingresar</button>
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  