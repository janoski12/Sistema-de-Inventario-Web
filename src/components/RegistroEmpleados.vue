<template>
  <div class="container" v-if="empleado">
    <h2>Registro de Empleados</h2>
    <!-- Aquí va el formulario de búsqueda de artículos -->


    <div class="form-container">
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" v-model="empleado.nombre" placeholder="Nombre">
      </div>
      <div class="form-group">
        <label for="identidad">RUT</label>
        <input type="text" id="identidad" v-model="empleado.identidad" placeholder="Identidad">
      </div>
      <div class="form-group">
        <label for="genero">Género</label>
        <select id="genero" v-model="empleado.genero">
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
      </div>
      <div class="form-group">
        <label for="telefono">Teléfono</label>
        <input type="text" id="telefono" v-model="empleado.telefono" placeholder="Teléfono">
      </div>
      <div class="form-group">
        <label for="correo">Correo</label>
        <input type="email" id="correo" v-model="empleado.correo" placeholder="Correo">
      </div>
      <div class="form-group">
        <label for="direccion">Dirección</label>
        <input type="text" id="direccion" v-model="empleado.direccion" placeholder="Direccion">
      </div>
      <div class="form-group">
        <label for="departamento">Departamento</label>
        <select id="departamento" v-model="empleado.idDepartamento">
          <option v-for="departamento in departamentos" :key="departamento.IdDepartamento" :value="departamento.IdDepartamento">
            {{ departamento.NombreD }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="puesto">Puesto</label>
        <select id="puesto" v-model="empleado.idPuesto">
          <option v-for="puesto in puestos" :key="puesto.IdPuesto" :value="puesto.IdPuesto">
            {{ puesto.NombreP }}
          </option>
        </select>
      </div>
    </div>

    <!-- Botones -->
    <div class="button-group">
      <button @click="nuevoEmpleado">Nuevo</button>
      <button @click="guardarEmpleado">Guardar</button>
      <button @click="cancelar">Cancelar</button>
    </div>

    <!-- Tabla de Empleados Registrados-->
    <div class="table-container">
      <h3>Empleados Registrados:</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Identidad</th>
            <th>Genero</th>
            <th>Telefono</th>
            <th>Correo</th>
            <th>Direccion</th>
            <th>Departamento</th>
            <th>Puesto de Trabajo</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empleado in empleados" :key="empleado.IdEmpleado">
            <td>{{ empleado.Nombre }}</td>
            <td>{{ empleado.Identidad }}</td>
            <td>{{ empleado.Genero }}</td>
            <td>{{ empleado.Telefono }}</td>
            <td>{{ empleado.Correo }}</td>
            <td>{{ empleado.Direccion }}</td>
            <td>{{ empleado.NombreD }}</td>
            <td>{{ empleado.NombreP }}</td>
            <td><button @click="seleccionarEmpleado(empleado)">Editar</button></td>
            <td><button @click="eliminarEmpleado(empleado.IdEmpleado)">Eliminar</button></td>
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
      empleados: [],
      empleado: {
        nombre: '',
        identidad: '',
        genero: '',
        telefono: '',
        correo: '',
        direccion: '',
        idDepartamento: '',
        idPuesto: '',
      },
      departamentos: [],
      puestos: []
    };
  },
  methods: {
    async obtenerEmpleados() {
      try {
        const response = await axios.get('http://localhost:5000/api/empleados');
        this.empleados = response.data;
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      }
    },

    async obtenerDepartamentos() {
      try {
        const response = await axios.get('http://localhost:5000/api/departamentos');
        this.departamentos = response.data;
      } catch (error) {
        console.error('Error al obtener los departamentos:', error);
      }
    },
    async obtenerPuestos() {
      try {
        const response = await axios.get('http://localhost:5000/api/puestos');
        this.puestos = response.data;
      } catch (error) {
        console.error('Error al obtener los puestos:', error);
      }
    },
    nuevoEmpleado() {
      this.empleado = {
        nombre: '',
        identidad: '',
        genero: '',
        telefono: '',
        correo: '',
        direccion: '',
        idDepartamento: '',
        idPuesto: '',
      };
    },
    async guardarEmpleado() {
      if (this.empleado.idEmpleado) {
        this.editarEmpleado()
      } else {
        if (this.empleado.nombre && this.empleado.identidad) {
          try {
            await axios.post('http://localhost:5000/api/empleados', {
              nombre: this.empleado.nombre,
              identidad: this.empleado.identidad,
              genero: this.empleado.genero,
              telefono: this.empleado.telefono,
              correo: this.empleado.correo,
              direccion: this.empleado.direccion,
              idDepartamento: this.empleado.idDepartamento,
              idPuesto: this.empleado.idPuesto
            });
            this.obtenerEmpleados();
            this.nuevoEmpleado();
            alert('Empleado agregado exitosamente');
          } catch (error) {
            console.error('Error al guardar el empleado:', error);
            alert('Ocurrio un error al intentar agregar un articulo');
          }
        } else {
          alert('Por favor, completa todos los campos');
        }
      }
    },
    seleccionarEmpleado(empleado) {
      this.empleado = {
        idEmpleado: empleado.IdEmpleado,
        nombre: empleado.Nombre,
        identidad: empleado.Identidad,
        genero: empleado.Genero,
        telefono: empleado.Telefono,
        correo: empleado.Correo,
        direccion: empleado.Direccion,
        idDepartamento: empleado.IdDepartamento,
        idPuesto: empleado.IdPuesto,
      };
    },

    async editarEmpleado() {
      try {
        await axios.put(`http://localhost:5000/api/empleados/${this.empleado.idEmpleado}`, this.empleado);
        this.obtenerEmpleados();
        this.nuevoEmpleado();
        alert('Articulo actualizado exitosamente');
      } catch (error) {
        console.error('Error al actualizar el articulo:', error);
        alert('Ocurrio un error al intentar actualizar el articulo');
      }
    },
    async eliminarEmpleado(idEmpleado) {
      const confirmar =confirm(`¿Estas seguro de que deseas eliminar el empleado con ID ${idEmpleado}?`);

      if (confirmar) {
        try {
          await axios.delete(`http://localhost:5000/api/empleados/${idEmpleado}`);
          alert('Articulo eliminado exitosamente');

          this.obtenerEmpleados();
        } catch (error) {
          console.error('Error al eliminar el artiuclo:', error);
          alert('Ocurrio un error al intentar eliminar el articulo');
        }
      }
    },
    cancelar() {
      this.nuevoEmpleado();
    }
  },
  mounted() {
    this.obtenerEmpleados();
    this.obtenerDepartamentos();
    this.obtenerPuestos();
  }
};
</script>

<style>
@import '../assets/css/registroEmpleados.css';
</style>