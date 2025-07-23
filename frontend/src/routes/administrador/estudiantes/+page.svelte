<script>
  let estudiantes = [
    { nombre: "Ana González", facultad: "FISC", correo: "ana.gonzalez@utp.ac.pa", horas: 6 },
    { nombre: "Carolina Gómez", facultad: "FII", correo: "carolina.gomez@utp.ac.pa", horas: 4 },
    { nombre: "Carlos Gómez", facultad: "FIM", correo: "carlos.gomez@utp.ac.pa", horas: 9 },
    { nombre: "Camila Mendez", facultad: "FISC", correo: "camila.mendez@utp.ac.pa", horas: 2 }
  ];
</script>

<div class="contenido">
  <div class="header">
    <h2>Estudiantes</h2>
    <div class="logo-container">
      <img src="/mentoro_logo.png" alt="logo de imagen" class="imagenlogo" />
    </div>
  </div>

  <input class="buscador" type="text" placeholder="Buscar Estudiantes" />

  <div class="tabla">
    <div class="fila encabezado">
      <div>Nombre</div>
      <div>Facultad</div>
      <div>Correo</div>
      <div>Tutoría Recibidas</div>
    </div>

    {#each estudiantes as estudiante}
      <div class="fila">
        <div>{estudiante.nombre}</div>
        <div>{estudiante.facultad}</div>
        <div>{estudiante.correo}</div>
        <div>{estudiante.horas}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #F2EEE6;
  }

  .contenido {
    padding: 2rem 4rem;
    max-width: 1400px;
    margin: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .imagenlogo {
    height: 50px;
  }

  .buscador {
    padding: 1rem;
    border-radius: 12px;
    border: none;
    width: 100%;
    max-width: 800px;
    box-shadow: 3px 3px 0 #e4c168;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .tabla {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .fila {
    display: grid;
    grid-template-columns: 2fr 1fr 3fr 1fr;
    background: white;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 5px 5px 0 #f2cd6d;
    align-items: center;
    font-size: 1.1rem;
  }

  .encabezado {
    background: transparent;
    box-shadow: none;
    font-weight: bold;
    color: #FBBF24;
  }
</style>