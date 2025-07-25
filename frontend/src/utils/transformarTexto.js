// transformarTexto.js

const palabrasNoCapitalizadas = [
    "de", "y", "en", "a", "para", "con", "o", "la", "el", "los", "las", "una", "unas", "un", "unos"
];

const capitalizar = (palabra, esInicio = false) => {
    if (esInicio || !palabrasNoCapitalizadas.includes(palabra.toLowerCase())) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    }
    return palabra.toLowerCase();
};

const esNumeroRomano = (palabra) => /^[IVXLCDM]+$/.test(palabra);

export function transformarTexto(texto) {
    // Primero, separamos el texto por las comas
    const partes = texto.split(',').map(p => p.trim());

    // Ahora, transformamos cada parte
    const resultado = partes
        .map(p => {
            return p
                .replace(/\(([^)]+)\)/g, (match, p1) => `(${p1.split(' ').map((word, index) => capitalizar(word, index === 0)).join(' ')})`)  // Capitaliza dentro de paréntesis
                .split(' ')  // Divide el texto por espacio
                .map((palabra, index) => {
                    // Si la palabra es un número romano o está en paréntesis, no se transforma
                    if (esNumeroRomano(palabra)) {
                        return palabra;
                    }
                    return capitalizar(palabra, index === 0); // Capitaliza la primera palabra
                })
                .join(' ');  // Vuelve a unir las palabras
        })
        .join(', ');  // Une las partes transformadas de nuevo con comas

    return resultado;
}
