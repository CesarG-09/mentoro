<script>
  import { Router, Route } from 'svelte-navigator';
  import Login from './routes/Login.svelte';
</script>

<Router>
  <Route path="/" component={Login} />
</Router>
