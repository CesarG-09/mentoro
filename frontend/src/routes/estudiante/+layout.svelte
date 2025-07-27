<script>
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  $: pathname = $page.url.pathname;

  export let data;

  let intervalId;

	onMount(() => {
		// Ejecuta al montar el layout
		checkSession();

		// Verifica cada 60 segundos
		intervalId = setInterval(checkSession, 60_000);
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});

	async function checkSession() {
		try {
			const res = await fetch('/api/check-session');

			if (!res.ok) {
				console.log('Sesión inválida o expirada. Redirigiendo...');
				goto('/login');
			}
		} catch (err) {
			console.error('Error verificando sesión:', err);
			goto('/login');
		}
	}

  async function cerrarSesion() {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });

      goto('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  function esActiva(ruta) {
    return pathname.startsWith(ruta);
  }
</script>

<div class="layout">
  <div class="nav-bar">
    <div class="nav-links">
        <a href="/estudiante/inicio" class:active={esActiva('/estudiante/inicio')}>Home</a>
        <a href="/estudiante/buscador" class:active={esActiva('/estudiante/buscador')}>Buscador</a>
        <a href="/administrador/estudiantes" class:active={esActiva('/administrador/estudiantes')}>Estudiantes</a>
    </div>
    <div class="logo-container">
      <img src="/single_logo.png" alt="Logo Mentoro" class="imagenlogo" />
    </div>
    <div class="user-info">
      <span>Hola, <strong>tutor@mentoro.pa</strong></span>
      <button>Cerrar sesión</button>
    </div>
    
  </div>

  <!-- Aquí se insertan las páginas hijas -->
  <slot />
</div>

<style>
     :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #F2EEE6;
  }
  .logo-container {
    display: flex;
    align-items: center;
    justify-content: right;
    flex-grow: 1;
  }
  .imagenlogo {
    height: 50px;
  }
  .nav-bar {
    background-color: #1E1E2F;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links a {
    color: white;
    margin-right: 1rem;
    text-decoration: none;
  }

  .nav-links a.active {
    font-weight: bold;
    border-bottom: 2px solid white;
    padding-bottom: 1.2rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-info button {
    background-color: #FBBF24;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    color: #1E1E2F;
  }
</style>