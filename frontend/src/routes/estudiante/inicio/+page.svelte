
<script>
    import { transformarTexto } from '../../../utils/transformarTexto';
    export let data;
    let materias = data.topMaterias.map(m => ({ ...m, materia: transformarTexto(m.materia) }));

    let tutores = data.topTutores.map(m => ({ ...m, materias: transformarTexto(m.materias) }));

    let tutorias = data.tutoriasReservadas.map(m => ({ ...m, materia: transformarTexto(m.materia) }));
</script>

<!-- Materias en tendencia -->
<section class="contenido-limitado">
    <h2>Materias en tendencia</h2>
    <div class="card-container">
        {#if materias.length > 0}
            {#each materias as materia}
                <div class="card">
                    <h2>{materia.materia}</h2>
                    <img src="https://cdn-icons-png.flaticon.com/512/10782/10782050.png" alt="Imagen Materia" class="card-image">
                    <p>{materia.descripcion}</p>
                    <button>Buscar esta materia</button>
                </div>
            {/each}
        {/if}
        {#if materias.length <= 0}
            <p>No hay materias</p>
        {/if}
    </div>
</section>

<!-- tutores destacados -->
<section class="contenido-limitado">
    <h2>Tutores en tendencia</h2>
    <div class="professor-container">
        {#if tutores.length > 0}
            {#each tutores as tutor}
                <div class="professor-card">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZyb-RdYPVFoVdjepEY1kB1TvUm-LKq9gokA&s" alt="Imagen tutor">
                    <div>
                        <h3>{tutor.nombre}</h3>
                        <p>{tutor.materias}</p>
                        <p>{#each Array(tutor.calificacion) as _}⭐{/each}</p>
                        <button>Reservar</button>
                    </div>
                </div>
            {/each}
        {/if}
        {#if tutores.length <= 0}
            <p>No hay tutores</p>
        {/if}
    </div>
</section>

<!-- Tutorías reservadas -->
<section class="reserved-tutoring">
    <h2>Tutorías reservadas</h2>
    {#if tutorias.length > 0}
        {#each tutorias as tutoria}
            <div class="fila">
                <div>{tutoria.materia}</div>
                <div>{tutoria.tutor}</div>
                <div>{tutoria.fecha}</div>
                <div>{tutoria.estado_reserva}</div>
                <div>
                    <button>Ver detalles</button>
                </div>
            </div>
        {/each}
    {/if}
    {#if tutorias.length <= 0}
        <p>No hay tutorias pendientes</p>
    {/if}
</section>

<!-- Footer -->
<footer>
    <p>&copy; 2024 Mentoro. Todos los derechos reservados.</p>
</footer>
    
<style>
    :global(body) {
        margin: 0;
        font-family: 'Segoe UI', sans-serif;
        background-color: #F2EEE6;
    }

    h2 {
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
        padding:20px 20px 20px 20px;
        background-color: #FFFFFF;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
        border-radius: 10px;
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
        margin-top: 0.05rem;
    }

    .card button {
        background-color: #FFBF00;
        color: black;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    .card button:hover {
        background-color: #FFA500;
    }

    /* tutor container */
    .professor-container {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 20px;
        padding: 0 1rem 0rem;
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
        color: black;
        padding: 8px 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .professor-card button:hover {
        background-color: #FFA500;
    }
    
    .reserved-tutoring {
        padding: 0px 20px 20px 20px;
        margin-left: auto;
        margin-right: auto;
        max-width: 1200px; 
        width: 90%; 
    }

    .reserved-tutoring p{
        text-align: center;
    }

    .fila {
        display: grid;
        grid-template-columns: 3fr 2fr 2fr 1fr 1.15fr; 
        background: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 5px 5px 0 #f2cd6d;
        align-items: center;
        font-size: 1.1rem;
        margin-bottom: 10px; 
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

    .contenido-limitado {
        max-width: 1200px;
        width: 90%;
        margin: 0 auto;
        padding: 20px 0;
    }
</style>
