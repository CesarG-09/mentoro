<script>
  import RutaProtegida from '$lib/RutaProtegida.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  $: pathname = $page.url.pathname;

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    goto('/login');
  }

  function esActiva(ruta) {
    return pathname.startsWith(ruta);
  }
</script>

<RutaProtegida tipoEsperado="administrador"/>

<div class="nav-bar">
  <div class="nav-links">
    <a href="/administrador/dashboard" class:active={esActiva('/administrador/dashboard')}>Dashboard</a>
    <a href="/administrador/tutores" class:active={esActiva('/administrador/tutores')}>Tutores</a>
    <a href="/administrador/estudiantes" class:active={esActiva('/administrador/estudiantes')}>Estudiantes</a>
  </div>
  <div class="user-info">
    <span>Hola, <strong>admin@mentoro.pa</strong></span>
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
    color: #1E1E2F;
  }
</style>
