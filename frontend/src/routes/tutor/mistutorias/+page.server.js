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

  const [datosTutoriasEnEsperaRes, datosTutoriasActivasRes] = await Promise.all([
		fetch(`http://localhost:3001/api/tutorias-en-espera?id_usuario=${encodeURIComponent(id_usuario)}`, { headers }),
		fetch(`http://localhost:3001/api/tutorias-activas?id_usuario=${encodeURIComponent(id_usuario)}`, { headers })
  ]);

	const datosTutoriasEnEsperaData = await datosTutoriasEnEsperaRes.json();
	const datosTutoriasActivasData = await datosTutoriasActivasRes.json();

  return {
		tutoriasEnEspera: datosTutoriasEnEsperaData.datos || [],
		tutoriasActivas: datosTutoriasActivasData.datos || []
	};
}

export const actions = {
  default: async ({ locals, params, request, fetch }) => {
    const form = await request.formData();

    let id_reserva = form.get('id_reserva');
    let estado_tutoria = form.get('estado');

    const token = locals.usuario?.token;

    const res = await fetch('http://localhost:3001/api/cambia-estado-reserva', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ estado_tutoria, id_reserva })
    });

    const data = await res.json();

    if (res.ok) {
        const id_usuario = locals.usuario.id_usuario
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const [datosTutoriasEnEsperaRes, datosTutoriasActivasRes] = await Promise.all([
            fetch(`http://localhost:3001/api/tutorias-en-espera?id_usuario=${encodeURIComponent(id_usuario)}`, { headers }),
            fetch(`http://localhost:3001/api/tutorias-activas?id_usuario=${encodeURIComponent(id_usuario)}`, { headers })
        ]);

        const datosTutoriasEnEsperaData = await datosTutoriasEnEsperaRes.json();
	    const datosTutoriasActivasData = await datosTutoriasActivasRes.json();

        return { 
            tutoriasEnEspera: datosTutoriasEnEsperaData.datos || [],
		    tutoriasActivas: datosTutoriasActivasData.datos || [] 
        };
    }else {
      return fail(res.status, {
        error: data?.error || 'Datos incorrectos'
      });
    }
  }
};
