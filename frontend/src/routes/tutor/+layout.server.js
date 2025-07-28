import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals, fetch }) {

	// Proteccion de Ruta
	if (!locals.usuario || locals.usuario.tipo_usuario !== 'tutor') {
		throw redirect(303, '/login');
	}

	// Recupera el token desde locals (lo asignaste en hooks.js)
	const token = locals.usuario?.token;
	const id_usuario = locals.usuario.id_usuario

	// Crea los headers con Authorization
	const headers = {
		Authorization: `Bearer ${token}`
	};

    // Llamadas necesarias al cargar la página
    const [datosTutorRes] = await Promise.all([
        fetch(`http://localhost:3001/api/datos-tutor?id_usuario=${encodeURIComponent(id_usuario)}`, { headers })
    ]);

    const datosTutorData = await datosTutorRes.json();

    return {
		datosTutor: datosTutorData.datos || [],
		usuario: locals.usuario
	};
}