<!-- FALTA MODIFICAR ANCHO DE LA PANTALLA -->

<script>
  let tutores = [
    {
      nombre: 'Alexander Acosta',
      materias: ['Matemática', 'Química', 'Ecuaciones'],
      calificacion: 5
    },
    {
      nombre: 'Anabel Castillo',
      materias: ['Inglés'],
      calificacion: 4
    },
    {
      nombre: 'Carlos Gómez',
      materias: ['Ecuaciones', 'Matemática Superior'],
      calificacion: 3
    },
    {
      nombre: 'Camila Méndez',
      materias: ['Cálculo I', 'Cálculo II', 'Cálculo III'],
      calificacion: 5
    }
  ];
</script>

<div class="dashboard">
  <!-- Barra superior -->
  <div class="nav-bar">
    <div class="nav-links">
      <a href="#">Dashboard</a>
      <a href="#" class="active">Tutores</a>
      <a href="#">Estudiantes</a>
    </div>
    <div class="user-info">
      <span>Hola, <strong>admin@mentoro.pa</strong></span>
      <button>Cerrar sesión</button>
    </div>
  </div>

  <!-- Encabezado -->
  <div class="header">
    <div class="left">
      <h2>Tutores</h2>
    </div>
    <div class="logo-container">
      <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo" />
    </div>
  </div>

  <!-- Buscador -->
  <div class="search-container">
    <input type="text" placeholder="Buscar Tutores" />
  </div>

  <!-- Tabla -->
  <div class="table-header">
    <span><strong>Nombre</strong></span>
    <span><strong>Materias</strong></span>
    <span><strong>Calificación</strong></span>
  </div>

  {#each tutores as tutor}
    <div class="tutor-card">
      <span>{tutor.nombre}</span>
      <span>{tutor.materias.join(', ')}</span>
      <span>
        {#each Array(tutor.calificacion) as _}
          ⭐
        {/each}
        {#each Array(5 - tutor.calificacion) as _}
          ☆
        {/each}
      </span>
    </div>
  {/each}
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #F2EEE6;
  }

  .dashboard {
    max-width: 1200px;
    margin: auto;
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
  }

  .nav-links a.active {
    font-weight: bold;
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
    padding: 2rem 2rem 1rem;
  }

  .imagenlogo {
    height: 50px;
  }

  .search-container {
    padding: 0 2rem 1.5rem;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .table-header,
  .tutor-card {
    display: grid;
    grid-template-columns: 1.5fr 3fr 1.5fr;
    padding: 1rem 2rem;
    background-color: white;
    border-bottom: 1px solid #ddd;
    align-items: center;
  }

  .table-header {
    background-color: transparent;
    font-weight: bold;
    margin-top: 1rem;
  }

  .tutor-card span {
    font-size: 15px;
    color: #1E1E2F;
  }
</style>
