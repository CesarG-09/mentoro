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

    const [tutorRes] = await Promise.all([
        fetch(`http://localhost:3001/api/ver-tutor?id_tutor=${encodeURIComponent(match[0])}`, { headers })
    ]);

    const tutorData = await tutorRes.json();
    
    return {
		tutor: tutorData.tutor || []
	};
}