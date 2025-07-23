export async function POST({ cookies }) {
	cookies.delete('auth', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax'
	});
	return new Response(null, { status: 200 });
}