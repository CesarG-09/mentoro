import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {

	if (!locals.usuario || locals.usuario.tipo_usuario !== 'administrador') {
		throw redirect(303, '/login');
	}

	return {
		usuario: locals.usuario
	};
}
