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

    const [datosTutoriasFinalizadasRes] = await Promise.all([
		fetch(`http://localhost:3001/api/tutorias-finalizadas?id_usuario=${encodeURIComponent(id_usuario)}`, { headers })
    ]);

	const datosTutoriasFinalizadasData = await datosTutoriasFinalizadasRes.json();

    return {
		tutoriasFinalizadas: datosTutoriasFinalizadasData.datos || []
	};
}

export const actions = {
  default: async ({ locals, params, request, fetch }) => {
    const form = await request.formData();

    let id_reserva = form.get('id_reserva');
    let comentario = form.get('comentario');
    let calificacion = form.get('calificacion');
    
    const token = locals.usuario?.token;

    const res = await fetch('http://localhost:3001/api/calificar-estudiante', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id_reserva, calificacion, comentario })
    });

    const data = await res.json();

    if (res.ok) {
        const id_usuario = locals.usuario.id_usuario
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const [datosTutoriasFinalizadasRes] = await Promise.all([
            fetch(`http://localhost:3001/api/tutorias-finalizadas?id_usuario=${encodeURIComponent(id_usuario)}`, { headers })
        ]);

        const datosTutoriasFinalizadasData = await datosTutoriasFinalizadasRes.json();

        return {
            tutoriasFinalizadas: datosTutoriasFinalizadasData.datos || []
        };
    }else {
      return fail(res.status, {
        error: data?.error || 'Datos incorrectos'
      });
    }
  }
};