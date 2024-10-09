<template>
  <div class="container">
    <h2>Asignacion de Articulos a Empleados</h2>

    <div class="form-container">

      <div class="form-group">
        <label for="empleado">Empleado</label>
        <select id="empleado" v-model="cargo.IdEmpleado">
          <option v-for="empleado in empleados" :key="empleado.IdEmpleado" :value="empleado.IdEmpleado">
            {{ empleado.Nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="articulo">Articulo</label>
        <select id="articulo" v-model="cargo.IdArticulo">
          <option v-for="articulo in articulos" :key="articulo.IdArticulo" :value="articulo.IdArticulo">
            {{ articulo.NombreA }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="fechaEntrega">Fecha de Entrega</label>
        <input type="date" id="fechaEntrega" v-model="cargo.fechaAsignacion">
      </div>

      <div class="form-group">
        <label for="descripcion">Descripcion</label>
        <input type="text" id="descripcion" v-model="cargo.descripcion">
      </div>
    </div>

    <div class="button-group">
      <button @click="asignarArticulo">Asignar Articulo</button>
    </div>

    <div class="table-container">
      <h3>Asignaciones Registradas</h3>
      <table>
        <thead>
          <tr>
            <th>Codigo Inventario</th>
            <th>Empleado</th>
            <th>Articulo</th>
            <th>Fecha de Entrega</th>
            <th>Descripcion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cargo in cargoActivos" :key="cargo.IdCargo">
            <td>{{ cargo.CodigoInventario }}</td>
            <td>{{ obtenerNombreEmpleado(cargo.IdEmpleado) }}</td>
            <td>{{ obtenerNombreArticulo(cargo.IdArticulo) }}</td>
            <td>{{ formatearFecha(cargo.FechaAsignacion) }}</td>
            <td>{{ cargo.Descripcion }}</td>
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
      articulos: [],
      cargoActivos: [],
      cargo: {
        CodigoInventario: '',
        IdEmpleado: '',
        IdArticulo: '',
        fechaAsignacion: '',
        descripcion: ''
      }
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
    async obtenerArticulos() {
      try {
        const response = await axios.get('http://localhost:5000/api/articulos');
        this.articulos = response.data;
        console.log(this.articulos);
      } catch (error) {
        console.error('Error al obtener los articulos:', error);
      }
    },
    async obtenerArticulosDisponibles() {
      try {
        const response = await axios.get('http://localhost:5000/api/articulosDisponibles');
        this.articulos = response.data;
        console.log(this.articulos);
      } catch (error) {
        console.error('Error al obtener los articulos disponibles:', error);
      }
    },
    async obtenerCargos() {
      try {
        const response = await axios.get('http://localhost:5000/api/cargoActivos');
        this.cargoActivos = response.data;
      } catch (error) {
        console.error('Error al obtener los cargos:', error);
      }
    },

    async asignarArticulo() {
      const articulo = this.articulos.find(a => a.IdArticulo === this.cargo.IdArticulo);
      if (articulo) {
        this.cargo.CodigoInventario = articulo.CodigoA;
      }

      console.log(this.cargo);
      try {
        await axios.post('http://localhost:5000/api/cargoActivos', this.cargo);
        alert('Articulo asignado exitosamente');

        this.obtenerCargos();
        this.obtenerArticulos();

        this.cargo = {
          codigoInventario: '',
          IdEmpleado: '',
          IdArticulo: '',
          fechaAsignacion: '',
          descripcion: ''
        };
      } catch (error) {
        console.error('Error al asignar el articulo:', error);
        alert('Ocurrio un error al asignar el articulo');
      }
    },
    obtenerNombreEmpleado(id) {
      const empleado = this.empleados.find(e => e.IdEmpleado === id);
      return empleado ? empleado.Nombre : 'Desconocido';
    },
    obtenerNombreArticulo(id) {
      const articulo = this.articulos.find(a => a.IdArticulo === id);
      return articulo ? articulo.NombreA : 'Desconocido';
    },
    formatearFecha(fecha) {
      if (!fecha) return 'Fecha no disponible';

      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      return new Date(fecha).toLocaleDateString('es-ES', options);
    }
  },
  mounted() {
    this.obtenerEmpleados();
    this.obtenerArticulos();
    this.obtenerArticulosDisponibles();
    this.obtenerCargos();
  }
}
</script>