<script>
  import { Router, Route } from 'svelte-navigator';
  import Login from './routes/Login.svelte';
  import EstudianteInicio from './routes/EstudianteInicio.svelte';
  import Registro from './routes/Registro.svelte';
</script>

<Router>
  <Route path="/login" component={Login} />
  <Route path="/registro" component={Registro} />
  <Route path="/estudiante/inicio" component={EstudianteInicio} />
</Router>
