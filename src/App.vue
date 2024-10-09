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
export default {
  name: 'App', 
};
</script>

<style>
@import './assets/css/navbar.css';
</style>
