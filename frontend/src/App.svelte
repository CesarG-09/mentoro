<script>
  import { Router, Route } from 'svelte-navigator';
  import Login from './routes/Login.svelte';
  import registro from './routes/registro.svelte'
</script>

<Router>
  <!-- Ruta para la pantalla de Login -->
  <Route path="/login" component={Login}></Route>

  <!-- Ruta para la pantalla de Registro -->
  <Route path="/registro" component={registro}></Route>
</Router>
