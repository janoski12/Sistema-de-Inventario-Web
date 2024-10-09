<template>
  <div class="container" v-if="usuario">
    <h2>Registro de Usuarios</h2>

    <div class="form-container">
      <div class="form-group">
        <label for="nombre">Nombre Completo</label>
        <input type="text" id="nombre" v-model="usuario.NombreCompleto" placeholder="Nombre Completo" required>
      </div>
      <div class="form-group">
        <label for="usuario">Usuario</label>
        <input type="text" id="usuario" v-model="usuario.Usuario" placeholder="Usuario" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="usuario.Password" placeholder="Contraseña" :required="!enEdicion" :disabled="enEdicion">
      </div>
      <div class="form-group">
        <label for="tipousuario">Tipo de Usuario</label>
        <select id="tipousuario" v-model="usuario.TipoUsuario">
          <option value="Administrador">Administrador</option>
          <option value="Invitado">Invitado</option>
        </select>
      </div>
      <div class="form-group">
        <label for="estado">Estado</label>
        <select id="estado" v-model="usuario.Estado">
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
    </div>

    <!-- Botones -->
    <div class="button-group">
      <button @click="nuevoUsuario">Nuevo</button>
      <button @click="guardarUsuario">Guardar</button>
      <button @click="cancelar">Cancelar</button>
    </div>

    <div class="table-container">
      <h3>Usuarios Registrados</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Usuario</th>
            <th>Tipo de Usuario</th>
            <th>Estado</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.IdUsuarios">
            <td>{{ usuario.NombreCompleto }}</td>
            <td>{{ usuario.Usuario }}</td>
            <td>{{ usuario.TipoUsuario }}</td>
            <td>{{ usuario.Estado }}</td>
            <td><button @click="editarUsuario(usuario)">Editar</button></td>
            <td><button @click="eliminarUsuario(usuario.IdUsuarios)">Eliminar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      usuarios: [],
      usuario: {
        IdUsuarios: '',
        NombreCompleto: '',
        Usuario: '',
        Password: '',
        TipoUsuario: '',
        Estado: ''
      },
      enEdicion: false
    };
  },
  methods: {
    async obtenerUsuarios() {
      try {
        const response = await axios.get('http://localhost:5000/api/usuarios');
        this.usuarios = response.data;
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      }
    },
    nuevoUsuario() {
      this.usuario = {
        NombreCompleto: '',
        Usuario: '',
        Password: '',
        TipoUsuario: '',
        Estado: '',
      };
      this.enEdicion = false;
    },
    async guardarUsuario() {
      if (this.usuario.Usuario) {
        if (this.usuario.IdUsuarios) {

          let usuarioActualizado = {
            NombreCompleto: this.usuario.NombreCompleto,
            Usuario: this.usuario.Usuario,
            TipoUsuario: this.usuario.TipoUsuario,
            Estado: this.usuario.Estado
          };

          if (this.usuario.Password) {
            usuarioActualizado.Password = this.usuario.Password;
          }

          try {
            await axios.put(`http://localhost:5000/api/usuarios/${this.usuario.IdUsuarios}`, usuarioActualizado);
            this.obtenerUsuarios();
            this.nuevoUsuario();
            alert('Usuario Actualizado exitosamente');
          } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            alert('Ocurrio un error al actualizar el usuario');
          }
        } else {
          try {
            await axios.post('http://localhost:5000/api/usuarios', {
              NombreCompleto: this.usuario.NombreCompleto,
              Usuario: this.usuario.Usuario,
              Password: this.usuario.Password,
              TipoUsuario: this.usuario.TipoUsuario,
              Estado: this.usuario.Estado
            });

            this.obtenerUsuarios();
            this.nuevoUsuario();
            alert('Usuario creado exitosamente');
          } catch (error) {
            console.error('Error al guardar el usuario', error);
            alert('Ocurrio un error al agregar el usuario');
          }
        }
      } else {
        alert('Por favor, completa todos los campos');
      }
    },
    editarUsuario(usuario) {
      this.usuario = {
        IdUsuarios: usuario.IdUsuarios,
        NombreCompleto: usuario.NombreCompleto,
        Usuario: usuario.Usuario,
        Password: '', 
        TipoUsuario: usuario.TipoUsuario,
        Estado: usuario.Estado
      };
      this.enEdicion = true;
    },
    async eliminarUsuario(id) {
      const confirmacion = confirm('¿Estas seguro de que deseas eliminar este usuario?');
      if (confirmacion) {
        try {
          await axios.delete(`http://localhost:5000/api/usuarios/${id}`);
          this.obtenerUsuarios();
          alert('Usuario eliminado exitosamente');
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          alert('Ocurrio un error al eliminar el usuario');
        }
      }
    },
    cancelar() {
      this.nuevoUsuario();
    }
  },
  mounted() {
    this.obtenerUsuarios();
  }
}
</script>