<template>
  <div class="container mt-3">
      <header>
          <h1>Ingresá tus credenciales</h1>
      </header>
      <main>
          <Login/>
      </main>
  </div>
</template>

<script>
import Login from '@/components/auth/Login'
export default {
    name: 'AdminLogin',
    components: {Login}
}
</script>

<style>

</style>