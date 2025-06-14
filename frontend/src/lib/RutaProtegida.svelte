<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-navigator';
    import { tokenExpirado } from '../utils/Auth';

    export let tipoEsperado = ''; // "estudiante", "profesor", etc.
    let autorizado = false;

    onMount(() => {
        const token = localStorage.getItem('token');
        const usuarioStr = localStorage.getItem('usuario');

        if (!token || !usuarioStr || tokenExpirado(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            navigate('/login');
            return;
        }

        const usuario = JSON.parse(usuarioStr);

        // Verificamos tipo de usuario, si aplica
        if (tipoEsperado && usuario.tipo_usuario !== tipoEsperado) {
            navigate('/login');
            return;
        }

        autorizado = true;
    });
</script>

{#if autorizado}
    <slot /> <!-- Renderiza el contenido protegido -->
{/if}
