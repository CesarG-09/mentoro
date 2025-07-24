import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals, fetch }) {

	// Proteccion de Ruta
	if (!locals.usuario || locals.usuario.tipo_usuario !== 'administrador') {
		throw redirect(303, '/login');
	}

	// Recupera el token desde locals (lo asignaste en hooks.js)
	const token = locals.usuario?.token;

	// Crea los headers con Authorization
	const headers = {
		Authorization: `Bearer ${token}`
	};

	// Llamadas necesarias al cargar la página
    const [totalEstudRes, totalTutorRes, totalReservFinRes, listaTutores, graficaVs, graficaMaterias, listaEstudiantes] = await Promise.all([
        fetch('http://localhost:3001/api/total-estudiantes', { headers }),
		fetch('http://localhost:3001/api/total-tutores', { headers }),
		fetch('http://localhost:3001/api/total-reservas-finalizadas', { headers }),
		fetch('http://localhost:3001/api/lista-tutores', { headers }),
		fetch('http://localhost:3001/api/grafica-vs', { headers }),
		fetch('http://localhost:3001/api/grafica-materias', { headers }),
		fetch('http://localhost:3001/api/lista-estudiantes', { headers })
    ]);

    const totalEstudiantesData = await totalEstudRes.json();
    const totalTutoresData = await totalTutorRes.json();
	const totalReservasFinData = await totalReservFinRes.json();
	const listaTutoresData = await listaTutores.json();
	const graficaVsData = await graficaVs.json();
	const graficaMateriasData = await graficaMaterias.json();
	const listaEstudiantesData = await listaEstudiantes.json();

	return {
		totalEstudiantes: totalEstudiantesData.cantidad || [],
        totalTutores: totalTutoresData.cantidad || [],
		totalReservas: totalReservasFinData.cantidad || [],
		listaTutores: listaTutoresData.tutores || [],
		graficaVs: graficaVsData.grafica || [],
		graficaMaterias: graficaMateriasData.grafica || [],
		listaEstudiantes: listaEstudiantesData.estudiantes || [],
		usuario: locals.usuario
	};
}
