/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params, fetch }) {
    const id = params.id;
    const match = id.match(/\d+$/);

    // Recupera el token desde locals (lo asignaste en hooks.js)
    const token = locals.usuario?.token;

    // Crea los headers con Authorization
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const [estudianteRes] = await Promise.all([
        fetch(`http://localhost:3001/api/ver-estudiante?id_estudiante=${encodeURIComponent(match[0])}`, { headers })
    ]);

    const estudianteData = await estudianteRes.json();
    
    return {
        estudiante: estudianteData.estudiante || []
    };
}