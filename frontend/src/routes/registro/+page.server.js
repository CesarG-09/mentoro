import { redirect, fail } from '@sveltejs/kit';

export async function load({ fetch }) {
    // Llamadas necesarias al cargar la página
    const [facultadesRes, materiasRes] = await Promise.all([
        fetch('http://localhost:3001/api/facultades'),
        fetch('http://localhost:3001/api/materias')
    ]);

    const facultadesData = await facultadesRes.json();
    const materiasData = await materiasRes.json();

    return {
        facultades: facultadesData.facultades || [],
        materias: materiasData.materias || []
    };
}

export const actions = {
    registrarEstudiante: async ({ request, cookies, fetch }) => {
        const form = await request.formData();
        const body = {
            usuario: form.get('usuario'),
            clave: form.get('clave'),
            tipo_usuario: form.get('tipo_usuario'),
            nombre: form.get('nombre'),
            apellido: form.get('apellido'),
            correo_utp: form.get('correo_utp'),
            fe_nacimiento: form.get('fe_nacimiento'),
            id_carrera: form.get('id_carrera')
        };

        const res = await fetch('http://localhost:3001/api/registro-estudiante', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (res.ok) {
            cookies.set('token', data.token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24
            });
            
            console.log("Estudiante Registrado!");
            throw redirect(303, '/estudiante/inicio');
        } else {
            console.log(data.mensaje);
            return fail(res.status, {
                error: data?.mensaje || 'Registro fallido'
            });
        }
    },

    registrarTutor: async ({ request, cookies, fetch }) => {
        console.log('Implementar acción para registrar tutor cuando exista API');
        
        const form = await request.formData();
        const body = {
            usuario: form.get('usuario'),
            clave: form.get('clave'),
            tipo_usuario: form.get('tipo_usuario'),
            nombre: form.get('nombre'),
            apellido: form.get('apellido'),
            correo_utp: form.get('correo_utp'),
            fe_nacimiento: form.get('fe_nacimiento'),
            dias_disponibles: JSON.parse(form.get('disponibilidad') || '[]').map(item => item.dia),
            horas_inicio: JSON.parse(form.get('disponibilidad') || '[]').map(item => item.inicio),
            horas_fin: JSON.parse(form.get('disponibilidad') || '[]').map(item => item.fin),
            materias: JSON.parse(form.get('materias') || '[]').map(item => item.id_materia),
            precios_materias: JSON.parse(form.get('materias') || '[]').map(item => item.precio)
        };

        const res = await fetch('http://localhost:3001/api/registro-tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (res.ok) {
            cookies.set('token', data.token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24
            });
            
            console.log("Tutor Registrado!");
            throw redirect(303, '/tutor/dashboard');
        } else {
            console.log(data.mensaje);
            return fail(res.status, {
                error: data?.mensaje || 'Registro fallido'
            });
        }
    }
};