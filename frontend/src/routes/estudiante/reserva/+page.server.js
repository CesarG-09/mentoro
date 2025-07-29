import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals, url, fetch }) {
    const id_tutor = url.searchParams.get('id_tutor');
    const nombre = url.searchParams.get('nombre');

	// Proteccion de Ruta
	if (!locals.usuario || locals.usuario.tipo_usuario !== 'estudiante') {
		throw redirect(303, '/login');
	}

	const token = locals.usuario?.token;

	const headers = {
		Authorization: `Bearer ${token}`
	};

    const [datosMateriasRes] = await Promise.all([
		fetch(`http://localhost:3001/api/ver-materias-tutor?id_tutor=${encodeURIComponent(id_tutor)}`, { headers })
    ]);

	const datosMateriasData = await datosMateriasRes.json();

    return {
		id_tutor: id_tutor,
        nombre: nombre,
        datosMaterias: datosMateriasData.tutor || [],
        id_usuario: locals.usuario.id_usuario
	};
}

export const actions = {
  consultarFechas: async ({ locals, params, request, fetch }) => {
    const form = await request.formData();
    let id_tutor = form.get('id_tutor');
    let id_materia = form.get('id_materia');
    let hora_inicio = form.get('hora_inicio');
    let horasSeleccionadas = form.get('horasSeleccionadas');

    const [horas, minutos] = hora_inicio.split(':').map(Number);
    let totalMinutos = horas * 60 + minutos;
    totalMinutos += horasSeleccionadas * 60;
    const horasFinal = Math.floor(totalMinutos / 60) % 24;
    const minutosFinal = totalMinutos % 60;
    const hora_fin = `${String(horasFinal).padStart(2, '0')}:${String(minutosFinal).padStart(2, '0')}`;

    const token = locals.usuario?.token;
    const headers = {
		Authorization: `Bearer ${token}`
	};

    const [datosFechasRes] = await Promise.all([
        fetch(`http://localhost:3001/api/evaluar-fechas?id_tutor=${encodeURIComponent(id_tutor)}&id_materia=${encodeURIComponent(id_materia)}&hora_inicio=${encodeURIComponent(hora_inicio)}&hora_fin=${encodeURIComponent(hora_fin)}`, { headers })
    ]);

    const datosFechasData = await datosFechasRes.json();

    return {
        datosFechas: datosFechasData.fechas_ocupadas[0].resultado.fechas_ocupadas || [],
        datosDias: datosFechasData.fechas_ocupadas[0].resultado.dias_no_disponibles || [],
        id_materia: id_materia,
        hora_fin: hora_fin
    };
  },
  reservarTutoria: async ({ locals, params, request, fetch }) => {
    const form = await request.formData();
    let id_usuario = form.get('id_usuario');
    let id_tutor = form.get('id_tutor');
    let id_materia = form.get('id_materia');
    let fe_reserva = form.get('fe_reserva');
    let hora_inicio = form.get('hora_inicio');
    let hora_fin = form.get('hora_fin');

    console.log(id_usuario, id_tutor, id_materia, fe_reserva, hora_inicio, hora_fin)

    const token = locals.usuario?.token;

    const res = await fetch('http://localhost:3001/api/realizar-reserva', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id_usuario, id_tutor, id_materia, fe_reserva, hora_inicio, hora_fin })
    });

    const data = await res.json();

    if (res.ok) {
        console.log("Reserva realizada correctamente!")
        throw redirect(303, '/estudiante/inicio');
    } else {
      return fail(res.status, {
        error: data?.mensaje || 'Datos incorrectos'
      });
    }
  }
};