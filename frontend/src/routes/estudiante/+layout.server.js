import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals, fetch }) {

	// Proteccion de Ruta
	if (!locals.usuario || locals.usuario.tipo_usuario !== 'estudiante') {
		throw redirect(303, '/login');
	}

	// Recupera el token desde locals (lo asignaste en hooks.js)
	const token = locals.usuario?.token;

	// Crea los headers con Authorization
	const headers = {
		Authorization: `Bearer ${token}`
	};

    /*

    // Llamadas necesarias al cargar la página
    const [totalEstudRes] = await Promise.all([
        fetch('http://localhost:3001/api/total-estudiantes', { headers })
    ]);

    const totalEstudiantesData = await totalEstudRes.json();

    */

    return {
		usuario: locals.usuario
	};
}