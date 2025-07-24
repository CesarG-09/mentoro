import { redirect, fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, cookies, fetch }) => {
    const form = await request.formData();
    const usuario = form.get('usuario');
    const clave = form.get('clave');

    const res = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave })
    });

    const data = await res.json();

    if (res.ok) {
      cookies.set('token', data.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24
      });

      const tipo = data.usuario.tipo_usuario;
      if (tipo === 'administrador') {
        throw redirect(303, '/administrador/dashboard');
      } else if (tipo === 'estudiante') {
        throw redirect(303, '/estudiante/inicio');
      } else if (tipo === 'tutor') {
        throw redirect(303, '/tutor/dashboard');
      } else {
        return fail(400, { error: 'Tipo de usuario desconocido' });
      }
    } else {
      return fail(res.status, {
        error: data?.error || 'Credenciales incorrectas'
      });
    }
  }
};
