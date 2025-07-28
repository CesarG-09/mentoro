export function transformarFecha(fecha) {

  const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const fechaObj = new Date(fecha);

  const year = fechaObj.getFullYear();
  const month = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
  const day = String(fechaObj.getDate()).padStart(2, '0'); // Día con dos dígitos

  return `${year}-${month}-${day}`;
}
