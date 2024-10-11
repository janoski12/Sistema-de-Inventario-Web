<template>
    <div>
        <h1>Iniciar Sesión</h1>
        <form @submit.prevent="login">
            <label for="username">Usuario:</label>
            <input type="text" id="username" v-model="Usuario">
            <br />
            <label for="password">Contraseña:</label>
            <input type="password" id="password" v-model="Password">
            <br />
            <button type="submit">Iniciar Sesión</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            Usuario: '',
            Password: ''
        }
    },
    methods: {
        async login() {
            try {
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Usuario: this.Usuario, Password: this.Password.trim() })
                })
                const data = await response.json()
                if (data.token) {
                    localStorage.setItem('token', data.token)
                    this.$router.push('/')
                } else {
                    alert('Credenciales incorrectas')
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
}
</script>