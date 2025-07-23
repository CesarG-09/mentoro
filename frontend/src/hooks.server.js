import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export async function handle({ event, resolve }) {
	const token = event.cookies.get('token');
	if (token) {
		try {
			const datos = jwt.verify(token, JWT_SECRET);
			event.locals.usuario = datos;
		} catch {
			event.locals.usuario = null;
		}
	} else {
		event.locals.usuario = null;
	}

	return await resolve(event);
}
