<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { tokenExpirado } from '../utils/Auth';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	export let tipoEsperado = '';
	let autorizado = false;
	let unsubscribe;

	const validarAutenticacion = () => {
		const token = localStorage.getItem('token');
		const usuarioStr = localStorage.getItem('usuario');

		if (!token || !usuarioStr || tokenExpirado(token)) {
			localStorage.removeItem('token');
			localStorage.removeItem('usuario');
			goto('/login');
			return false;
		}

		const usuario = JSON.parse(usuarioStr);

		if (tipoEsperado && usuario.tipo_usuario !== tipoEsperado) {
			localStorage.removeItem('token');
			localStorage.removeItem('usuario');
			goto('/login');
			return false;
		}

		return true;
	};

	onMount(() => {
		// Validar al cargar
		autorizado = validarAutenticacion();

		// Validar en cada navegación
		unsubscribe = derived(page, $page => $page.url).subscribe(() => {
			autorizado = validarAutenticacion();
		});
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
</script>

{#if autorizado}
	<slot />
{/if}
