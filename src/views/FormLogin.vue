<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" />
            <br />
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" />
            <br />
            <button type="submit">Login</button>
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
    methods: {
        async login() {
            try {
                const response = await axios.post('/api/login', {
                    username: this.username,
                    password: this.password
                })
                const token = response.data.token
                localStorage.setItem('token', token)
                this.$router.push('/')
            } catch (error) {
                console.error(error)
                alert('Error al iniciar sesion')
            }
        }
    }
}
</script>