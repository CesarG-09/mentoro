<script>
  import { page } from '$app/stores';

  const titulos = {
    '/tutor/dashboard': 'Estadísticas del Tutor',
    '/tutor/mistutorias': 'Mis Tutorías',
    '/tutor/estudiantes': 'Estudiantes Asignados',
    '/tutor/calendario': 'Calendario de Tutorías'
  };
</script>

<div class="layout">
  <div class="nav-bar">
    <div class="nav-links">
      <a href="/tutor/dashboard" class:active={$page.url.pathname === '/tutor/dashboard'}>Dashboard</a>
      <a href="/tutor/mistutorias" class:active={$page.url.pathname === '/tutor/mistutorias'}>Mis Tutorías</a>
      <a href="/tutor/estudiantes" class:active={$page.url.pathname === '/tutor/estudiantes'}>Estudiantes</a>
      <a href="/tutor/calendario" class:active={$page.url.pathname === '/tutor/calendario'}>Calendario</a>
    </div>
    <div class="user-info">
      <span>Hola, <strong>tutor@mentoro.pa</strong></span>
      <button>Cerrar sesión</button>
    </div>
  </div>

  <div class="header">
    <h2>{titulos[$page.url.pathname] ?? 'Panel del Tutor'}</h2>
    <div class="logo-container">
      <img src="/mentoro_logo.png" alt="Logo Mentoro" class="imagenlogo" />
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

  .layout {
    width: 100vw;
    min-height: 100vh;
    padding-bottom: 3rem;
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
    font-weight: 500;
  }

  .nav-links a.active {
    border-bottom: 2px solid #FBBF24;
    padding-bottom: 2px;
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

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    max-width: 1200px;
    margin: auto;
  }

  .imagenlogo {
    height: 50px;
  }
</style>