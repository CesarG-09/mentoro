<script>
  import { Router, Route } from 'svelte-navigator';
  import Login from './routes/Login.svelte';
  import Dashboard from './routes/Dashboard.svelte';
</script>

<Router>
  <Route path="/" component={Login} />
  <Route path="/dashboard" component={Dashboard} />
</Router>
