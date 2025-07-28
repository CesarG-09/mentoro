import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals, fetch }) {

	// Proteccion de Ruta
	if (!locals.usuario || locals.usuario.tipo_usuario !== 'tutor') {
		throw redirect(303, '/login');
	}

	const token = locals.usuario?.token;
	const id_usuario = locals.usuario.id_usuario

	const headers = {
		Authorization: `Bearer ${token}`
	};

  const [datosTutoriasActivasRes] = await Promise.all([
		fetch(`http://localhost:3001/api/tutorias-activas?id_usuario=${encodeURIComponent(id_usuario)}`, { headers })
  ]);

	const datosTutoriasActivasData = await datosTutoriasActivasRes.json();

  return {
		tutoriasActivas: datosTutoriasActivasData.datos || []
	};
}