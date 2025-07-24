
<script>
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

<!-- Navbar -->
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

<!-- Materias en tendencia -->
<section>
    <h2>Materias en tendencia</h2>
    <div class="card-container">
        <div class="card">
            <h2>Matemáticas</h2>
            <img src="https://cdn-icons-png.flaticon.com/512/10782/10782050.png" alt="Imagen de Matemáticas" class="card-image">
            <p>Introducción al álgebra, cálculo diferencial e integral.</p>
            <button>Buscar esta materia</button>
        </div>
        <div class="card">
            <h2>Física</h2>
            <img src="https://cdn-icons-png.flaticon.com/512/10782/10782050.png" alt="Imagen de Matemáticas" class="card-image">
            <p>Conceptos fundamentales de mecánica y termodinámica.</p>
            <button>Buscar esta materia</button>
        </div>
        <div class="card">
            <h2>Programación</h2>
            <img src="https://cdn-icons-png.flaticon.com/512/10782/10782050.png" alt="Imagen de Matemáticas" class="card-image">
            <p>Fundamentos de programación y estructuras de datos.</p>
            <button>Buscar esta materia</button>
        </div>
    </div>
</section>

<!-- Profesores destacados -->
<section>
    <h2>Profesores en tendencia</h2>
    <div class="professor-container">
        <div class="professor-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZyb-RdYPVFoVdjepEY1kB1TvUm-LKq9gokA&s" alt="Profesor Alberto Pérez">
            <div>
                <h3>Alberto Pérez</h3>
                <p>Matemáticas</p>
                <p>⭐⭐⭐⭐⭐</p>
                <button>Reservar</button>
            </div>
        </div>
        <div class="professor-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZyb-RdYPVFoVdjepEY1kB1TvUm-LKq9gokA&s" alt="Profesor Laura Gómez">
            <div>
                <h3>Laura Gómez</h3>
                <p>Química, Biología</p>
                <p>⭐⭐⭐⭐</p>
                <button>Reservar</button>
            </div>
        </div>
    </div>
</section>

<!-- Tutorías reservadas -->
<section class="reserved-tutoring">
    <h2>Tutorías reservadas</h2>
    <div class="fila">
        <div>Matemáticas</div>
        <div>Alberto Pérez</div>
        <div>10 abril 2024</div>
        <div>
            <button>Ver detalles</button>
        </div>
    </div>
    <div class="fila">
        <div>Programación</div>
        <div>Carlos Ruiz</div>
        <div>9 abril 2024</div>
        <div>
            <button>Ver detalles</button>
        </div>
    </div>
    <div class="fila">
        <div>Química</div>
        <div>Laura Gómez</div>
        <div>8 abril 2024</div>
        <div>
            <button>Ver detalles</button>
        </div>
    </div>
</section>

<!-- Footer -->
<footer>
    <p>&copy; 2024 Mentoro. Todos los derechos reservados.</p>
</footer>
    


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

    body {
        background-color: #F5F5F5;
        font-family: 'Arial', sans-serif;
        color:#1E1E2F;
        margin: 0;
        padding: 0;
    }

    h1, h2 {
        color: #1E1E2F;
        padding: 1rem;
    }

    /* Card container */
    .card-container {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 20px;
        padding: 0 1rem;
    }

    .card {
        background-color: #FFFFFF;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        flex: 1 1 30%;
        min-width: 280px;
        max-width: 320px;
        box-sizing: border-box;
    }

    .card-image {
        width: 100px; /* Ajusta el tamaño de la imagen */
        height: 100px; /* Ajusta el tamaño de la imagen */
        margin-bottom: 5px; /* Espacio entre la imagen y el contenido */
        object-fit: contain; /* Mantiene la proporción de la imagen */
        border-radius: 5px; /* Bordes redondeados en la imagen */
    }

    .card h2 {
        color:#1E1E2F;
    }

    .card button {
        background-color: #FFBF00;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    .card button:hover {
        background-color: #FFA500;
    }

    /* Profesor container */
    .professor-container {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 20px;
        padding: 0 1rem 2rem;
    }

    .professor-card {
        background-color: #FFFFFF;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        padding: 20px;
        display: flex;
        align-items: center;
        flex: 1 1 45%;
        min-width: 280px;
        max-width: 400px;
    }

    .professor-card img {
        border-radius: 50%;
        width: 120px;
        height: 120px;
        margin-right: 20px;
    }

    .professor-card h3 {
        margin: 0 0 5px;
        color: #1E1E2F;
    }

    .professor-card button {
        background-color: #FFBF00;
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .professor-card button:hover {
        background-color: #FFA500;
    }
    
    .reserved-tutoring {
        padding: 20px;
        margin-top: 40px;
        margin-left: auto;
        margin-right: auto;
        max-width: 1200px; /* Máximo ancho para la sección */
        width: 90%; /* Ajusta el ancho según sea necesario */
    }


    .fila {
        display: grid;
        grid-template-columns: 2fr 1fr 3fr 1fr; /* Define el ancho de cada columna */
        background: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 5px 5px 0 #f2cd6d;
        align-items: center;
        font-size: 1.1rem;
        margin-bottom: 10px; /* Espacio entre filas */
    }

    .fila div {
        padding: 10px;
    }

    .fila button {
        background-color: #FFBF00;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    .fila button:hover {
        background-color: #FFA500;
    }


    footer {
        text-align: center;
        background-color: #1E1E2F;
        color: white;
        padding: 15px;
    }
</style>
