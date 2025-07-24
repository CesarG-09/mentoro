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

<div class="nav-bar">
    <div class="nav-links">
        <a href="/estudiante/inicio" class:active={esActiva('/estudiante/inicio')}>Dashboard</a>
        <a href="/administrador/tutores" class:active={esActiva('/administrador/tutores')}>Tutores</a>
        <a href="/administrador/estudiantes" class:active={esActiva('/administrador/estudiantes')}>Estudiantes</a>
    </div>
    <div class="user-info">
        <span>Hola, <strong>{data.usuario.usuario}</strong></span>
        <button on:click={cerrarSesion}>Cerrar sesión</button>
    </div>
</div>

<slot />

<style>
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
        color:#1E1E2F;
    }
</style>