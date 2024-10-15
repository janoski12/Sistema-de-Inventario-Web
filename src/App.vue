<template>
  <div id="app">
    <nav class="navbar">
      <div class="logo">
        Sistema de Inventario
      </div>
      <ul class="nav-links">
            <li><router-link to="/buscar-articulos">Busqueda de Articulos</router-link></li>
            <li><router-link to="/entrega-activos">Entrega de Activos</router-link></li>
            <li><router-link to="/descargo-activos">Descargo de Activos</router-link></li>
            <li><router-link to="/registro-empleados">Registro de Empleados</router-link></li>
            <li><router-link to="/administracion-usuarios">Administracion de Usuarios</router-link></li>
            <li><router-link to="/lista-departamentos">Departamentos</router-link></li>
            <li><router-link to="/lista-puestos">Puestos</router-link></li>
        </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  async created() {
    await this.checkAuth();
  },
  mounted() {
    window.addEventListener('beforeunload', this.logout);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.logout);
  },
  methods: {
    async checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      try {
        await axios.get('http://localhost:5000/api/verfy-token', {
          headers: { Authorization:  `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error de autenticacion:', error)
        localStorage.removeItem('token');
        this.$router.push('/login');
      }
    },
    async  logout() {
      try {
        await axios.post('http://localhost:5000/api/logout');
        localStorage.removeItem('token');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error de logout:', error);
      }
    }
  }
};
</script>

<style>
@import './assets/css/navbar.css';
</style>
