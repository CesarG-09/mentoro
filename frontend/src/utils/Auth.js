export function tokenExpirado(token) {
  if (!token) return true;

  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const ahora = Math.floor(Date.now() / 1000); // tiempo actual en segundos

    return payload.exp < ahora;
  } catch (e) {
    return true; // Token inválido o mal formado
  }
}
