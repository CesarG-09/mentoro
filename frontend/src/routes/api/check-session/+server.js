import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	const token = cookies.get('token');
    
	if (!token) {
		return new Response('No autorizado', { status: 401 });
	}

	try {
		jwt.verify(token, JWT_SECRET);
		return json({ ok: true });
	} catch (err) {
		return new Response('Token inválido o expirado', { status: 401 });
	}
}
