<script>
  import { Router, Route } from 'svelte-navigator';
  import Login from './routes/Login.svelte';
  import EstudianteInicio from './routes/EstudianteInicio.svelte';
</script>

<Router>
  <Route path="/login" component={Login} />
  <Route path="/estudiante/inicio" component={EstudianteInicio} />
</Router>
