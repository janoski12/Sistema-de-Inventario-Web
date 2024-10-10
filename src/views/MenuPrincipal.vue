<template>
    <div>
        <h1>Bienvenido al Sistema de Inventario de Activos</h1>
        <p>Seleccione una opcion del Menu</p>
        <button @click="logout">Cerrar sesión</button>
    </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
};
</script>

