<template>
    <div class="container">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="login">
            
            <div class="form-group">
                <label for="username">Usuario</label>
                <input type="text" id="username" v-model="username" placeholder="Ingrese su usuario">
            </div>
            
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña">
            </div>

            <button type="submit">Iniciar Sesión</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods:{
        login(){
            try {
                const response = await.post('http://localhost:5000/api/login', {
                    username: this.username,
                    password: this.password
                });
                const token = response.data.token;
                localStorage.setItem('token', token);
                this.$router.push('/menu-principal');
            } catch (error) {
                console.error('Error al iniciar sesion:', error);
                alert('Error al iniciar sesion');
            }
        }
    }
}
</script>