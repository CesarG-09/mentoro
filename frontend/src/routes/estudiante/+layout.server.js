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

    // Llamadas necesarias al cargar la página
    const [topMateriasRes, topTutoresRes, tutoriasReservadasRes] = await Promise.all([
        fetch('http://localhost:3001/api/top-materias', { headers }),
		fetch('http://localhost:3001/api/top-tutores', { headers }),
		fetch(`http://localhost:3001/api/lista-tutorias?usuario=${encodeURIComponent(locals.usuario.usuario)}`, { headers })
    ]);

    const topMateriasData = await topMateriasRes.json();
	const topTutoresData = await topTutoresRes.json();
	const tutoriasReservadasData = await tutoriasReservadasRes.json();

    return {
		topMaterias: topMateriasData.materias || [],
		topTutores: topTutoresData.tutores || [],
		tutoriasReservadas: tutoriasReservadasData.tutorias || [],
		usuario: locals.usuario
	};
}