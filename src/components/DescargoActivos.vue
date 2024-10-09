<template>
  <div class="container">
    <h2>Descargo de Articulos Asignados a Empleados</h2>

    <div class="form-container">
      <div class="form-group">
        <label for="empleado">Empleado</label>
        <select id="empleado" v-model="descargo.IdEmpleado" @change="obtenerArticulosAsignados(descargo.IdEmpleado)">
          <option v-for="empleado in empleados" :key="empleado.IdEmpleado" :value="empleado.IdEmpleado">
            {{ empleado.Nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="articulo">Articulo Asignado</label>
        <select id="articulo" v-model="descargo.IdArticulo">
          <option v-for="articulo in articulosAsignados" :key="articulo.IdArticulo" :value="articulo.IdArticulo">
            {{ articulo.NombreA }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="motivo">Motivo Descargo</label>
        <input type="text" id="motivo" v-model="descargo.MotivoDescargo">
      </div>

      <div class="form-group">
        <label for="descripcion">Descripcion</label>
        <input type="text" id="descripcion" v-model="descargo.Descripcion">
      </div>

      <div class="button-group">
        <button @click="desasignarArticulo">Descargo de Activos</button>
      </div>
    </div>

    <div class="table-container">
      <h3>Descargos Realizados</h3>
      <table>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Articulo</th>
            <th>Fecha de Descargo</th>
            <th>Motivo Descargo</th>
            <th>Descripcion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="descargo in descargoActivos" :key="descargo.IdDescargo">
            <td>{{ obtenerNombreEmpleado(descargo.IdEmpleado) }}</td>
            <td>{{ obtenerNombreArticulo(descargo.IdArticulo) }}</td>
            <td>{{ formatearFecha(descargo.FechaDescargo) }}</td>
            <td>{{ descargo.MotivoDescargo }}</td>
            <td>{{ descargo.Descripcion }}</td>
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
      articulosAsignados: [],
      descargoActivos: [],
      descargo: {
        IdEmpleado: null,
        IdArticulo: '',
        MotivoDescargo: '',
        Descripcion: '',
        FechaDescargo: new Date().toISOString().substr(0, 10),
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
    async obtenerArticulosAsignados(idEmpleado) {
      
      if (!idEmpleado) {
        console.error('IdEmpleado no esa definido o es nulo');
        this.articulosAsignados = [];
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/cargoActivos/${idEmpleado}`);
        this.articulosAsignados = response.data.filter(articulo => articulo.EstadoArticulo === 'Asignado');
      } catch (error) {
        console.error('Error al obtener los artículos asignados:', error);
      }
    },

    async obtenerDescargosActivos() {
      try {
        const response = await axios.get('http://localhost:5000/api/descargos');
        this.descargoActivos = response.data;
      } catch (error) {
        console.error('Error al obtener los descargos:', error);
      }
    },
    async desasignarArticulo() {
      if (this.descargo.IdEmpleado && this.descargo.IdArticulo) {
        // Encuentra el artículo seleccionado y toma su idCargoActivo
        const articuloSeleccionado = this.articulosAsignados.find(a => a.IdArticulo === this.descargo.IdArticulo);

        if (!articuloSeleccionado) {
          alert('El artículo seleccionado no tiene un idCargoActivo válido');
          return;
        }

        this.descargo.idCargoActivo = articuloSeleccionado.IdCargo; // Incluye el idCargoActivo

        console.log('Datos enviados:', this.descargo);

        try {
          await axios.post('http://localhost:5000/api/descargos', this.descargo);
          alert('Artículo desasignado exitosamente');
          this.obtenerDescargosActivos();
          const idEmpleadoActual = this.descargo.IdEmpleado;
          this.descargo = { IdEmpleado: idEmpleadoActual, IdArticulo: '', FechaDescargo: new Date().toISOString().substr(0, 10), MotivoDescargo: '', Descripcion: '', idCargoActivo: '' };
        } catch (error) {
          console.error('Error al desasignar el artículo:', error);
          alert('Ocurrió un error al desasignar el artículo');
        }
      } else {
        alert('Por favor, selecciona un empleado y un artículo');
      }
    },

    obtenerNombreEmpleado(id) {
      const empleado = this.empleados.find(e => e.IdEmpleado === id);
      return empleado ? empleado.Nombre : 'Desconocido';
    },
    obtenerNombreArticulo(id) {
      const articulo = this.descargoActivos.find(a => a.IdArticulo === id);
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
    this.obtenerDescargosActivos();

  }
};
</script>