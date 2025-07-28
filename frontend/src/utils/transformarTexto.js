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
    const partes = texto.split(',').map(p => p.trim());

    const resultado = partes
        .map(p => {
            return p
                .replace(/\(([^)]+)\)/g, (match, p1) => `(${p1.split(' ').map((word, index) => capitalizar(word, index === 0)).join(' ')})`)  // Capitaliza dentro de paréntesis
                .split(' ')
                .map((palabra, index) => {
                    if (esNumeroRomano(palabra)) {
                        return palabra;
                    }
                    return capitalizar(palabra, index === 0);
                })
                .join(' ');
        })
        .join(', ');

    return resultado;
}
