<script>
  import { Router, Route } from 'svelte-navigator';
  import Login from './routes/Login.svelte';
  import EstudianteInicio from './routes/EstudianteInicio.svelte';
  import registro from './routes/registro.svelte';

  import admin_dash from './routes/admin_dash.svelte';
  //import admin_estud1 from './routes/admin_estud1.svelte';
  import admin_estud2 from './routes/admin_estud2.svelte';
</script>

<Router>
  <Route path="/login" component={Login} />
  <Route path="/registro" component={registro} />
  <Route path="/estudiante/inicio" component={EstudianteInicio} />

  <Route path="/admin_dash" component={admin_dash} />
  <Route path="/admin_estud2" component={admin_estud2} />
</Router>
