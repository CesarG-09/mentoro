import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params, fetch }) {
    const id = params.id;
    const id_usuario = id.match(/\d+$/)[0];
    const id_estudiante = id.match(/(\d+)-\d+$/)[1];

    // Recupera el token desde locals (lo asignaste en hooks.js)
    const token = locals.usuario?.token;

    // Crea los headers con Authorization
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const [estudianteRes, usuarioRes] = await Promise.all([
        fetch(`http://localhost:3001/api/ver-estudiante?id_estudiante=${encodeURIComponent(id_estudiante)}`, { headers }),
        fetch(`http://localhost:3001/api/estado-usuario?id_usuario=${encodeURIComponent(id_usuario)}`, { headers })
    ]);

    const estudianteData = await estudianteRes.json();
    const usuarioData = await usuarioRes.json();
    
    return {
        estudiante: estudianteData.estudiante || [],
        usuario: usuarioData.usuario || []
    };
}

export const actions = {
  default: async ({ locals, params, request, fetch }) => {
    const id = params.id;
    const id_usuario = id.match(/\d+$/)[0];

    const form = await request.formData();
    let estado = form.get('estado'); // ✅ aquí está tu parámetro
    estado = estado === 'activo' ? 'eliminado' : 'activo';

    const token = locals.usuario?.token;

    const res = await fetch('http://localhost:3001/api/cambia-estado', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ estado, id_usuario })
    });

    const data = await res.json();

    if (res.ok) {
        return { estado: estado };
    }else {
      return fail(res.status, {
        error: data?.error || 'Datos incorrectos'
      });
    }
  }
};