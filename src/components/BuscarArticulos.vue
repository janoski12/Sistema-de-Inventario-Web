<template>
  <div class="container" v-if="articulo">
    <h2>Registro y Busqueda de Articulos</h2>

    <div class="form-container">
      <div class="form-group">
        <label for="articulo">Articulo</label>
        <input type="text" id="nombreA" v-model="articulo.nombre" placeholder="Articulo">
      </div>
      <div class="form-group">
        <label for="codigoA">Codigo Interno</label>
        <input type="text" id="codigoA" v-model="articulo.codigoA" placeholder="Codigo Interno">
      </div>
      <div class="form-group">
        <label for="fechaCompra">Fecha de Compra</label>
        <input type="date" id="fechaCompra" v-model="articulo.fechaCompra">
      </div>
      <div class="form-group">
        <label for="numSerie">Numero de Serie</label>
        <input type="text" id="numSerie" v-model="articulo.numSerie" placeholder="Numero de Serie">
      </div>
      <div class="form-group">
        <label for="marca">Marca</label>
        <select id="marca" v-model="articulo.idMarca">
          <option v-for="marca in marcas" :key="marca.Id" :value="marca.IdMarca">
            {{ marca.NombreM }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="modelo">Modelo</label>
        <input type="text" id="modelo" v-model="articulo.modelo" placeholder="Modelo">
      </div>
      <div class="form-group">
        <label for="precioCompra">Precio Compra</label>
        <input type="text" id="precioCompra" v-model="articulo.precioCompra" placeholder="Precio Compra">
      </div>
      <div class="form-group">
        <label for="descripcion">Descripcion</label>
        <input type="text" id="descripcion" v-model="articulo.descripcion" placeholder="Descripcion del Articulo">
      </div>
    </div>

    <!-- Botones -->
    <div class="button-group">
      <button @click="nuevoArticulo">Nuevo</button>
      <button @click="guardarArticulo">Guardar</button>
      <button @click="cancelar">Cancelar</button>
    </div>


    <div class="table-container">
        <h3>Articulos Registrados:</h3>
        <table>
          <thead>
            <tr>
              <th>Articulo</th>
              <th>Numero de Serie</th>
              <th>Codigo Interno</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Precio de Compra</th>
              <th>Fecha de Compra</th>
              <th>Estado Articulo</th>
              <th>Descripcion</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="articulo in articulos" :key="articulo.IdArticulo">
              <td>{{ articulo.NombreA }}</td>
              <td>{{ articulo.NumeroSerie }}</td>
              <td>{{ articulo.CodigoA }}</td>
              <td>{{ articulo.NombreM }}</td>
              <td>{{ articulo.Modelo }}</td>
              <td>{{ articulo.PrecioCompra }}</td>
              <td>{{ formatearFecha(articulo.FechaCompra) }}</td>
              <td>{{ articulo.EstadoArticulo }}</td>
              <td>{{ articulo.DescripcionA }}</td>
              <td><button @click="seleccionarArticulo(articulo)">Editar</button></td>
              <td><button @click="eliminarArticulo(articulo.IdArticulo)">Eliminar</button></td>
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
      articulos: [], //Lista de Articulos registrados
      articulo: {
        nombre: '',
        codigoA: '',
        idMarca: '',
        modelo: '',
        precioCompra: '',
        fechaCompra: '',
        estadoArticulo: '',
        descripcion: '',
      },
      marcas: [] // Lista de marcas registradas
    };
  },

  methods: {
    // Obtener lista de Articulos
    async obtenerArticulos() {
      try {
        const response = await axios.get('http://localhost:5000/api/articulos');
        this.articulos = response.data;
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      }
    },

    //Obtener lista de Marcas
    async obtenerMarcas() {
      try {
        const response = await axios.get('http://localhost:5000/api/marcas');
        this.marcas = response.data;
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      }
    },

    // Limpiar formulario para nuevo Articulo
    nuevoArticulo() {
      this.articulo = {
        nombre: '',
        codigoA: '',
        idMarca: '',
        modelo: '',
        precioCompra: '',
        fechaCompra: '',
        estadoArticulo: '',
        descripcion: '',
      };
    },

    // Guardar Articulo en el servidor
    async guardarArticulo() {
      if (this.articulo.idArticulo) {
        this.editarArticulo()
      } else {
        if (this.articulo.nombre && this.articulo.codigoA) {
          try {
            await axios.post('http://localhost:5000/api/articulos', this.articulo);
            this.obtenerArticulos(); // Actualizar la lista de articulos
            this.nuevoArticulo(); // Limpiar Formulario
            alert('Articulo agregado exitosamente');
          } catch (error) {
            console.error('Error al guardar el empleado:', error);
            alert('Ocurrio un error al intentar agregar un articulo');
          }
        } else {
          alert('Por favor, completa todos los campos');
        }
      }
    },

    seleccionarArticulo(articulo) {
      this.articulo = {
        idArticulo: articulo.IdArticulo,
        nombre: articulo.NombreA,
        codigoA: articulo.CodigoA,
        idMarca: articulo.IdMarca,
        modelo: articulo.Modelo,
        precioCompra: articulo.PrecioCompra,
        fechaCompra: articulo.FechaCompra ? this.formatoFechaInput(articulo.FechaCompra) : '',
        numSerie: articulo.NumeroSerie,
        descripcion: articulo.DescripcionA
      };
    },

    async editarArticulo() {
      try {
        await axios.put(`http://localhost:5000/api/articulos/${this.articulo.idArticulo}`, this.articulo);
        this.obtenerArticulos();
        this.nuevoArticulo();
        alert('Articulo actualizado exitosamente');
      } catch (error) {
        console.error('Error al actualizar el articulo:', error);
        alert('Ocurrio un error al intentar actualizar el articulo');
      }
    },
    async eliminarArticulo(idArticulo) {
      const confirmar = confirm(`¿Estas seguro de que deseas eliminar el articulo con ID ${idArticulo}?`);

      if (confirmar) {
        try {
          await axios.delete(`http://localhost:5000/api/articulos/${idArticulo}`);
          alert('Articulo eliminado exitosamente');

          this.obtenerArticulos();
        } catch (error) {
          console.error('Error al eliminar el articulo:', error);
          alert('Ocurrio un error al intentar eliminar el articulo');
        }
      }
    },
    cancelar() {
      this.nuevoArticulo();
    },

    formatoFechaInput(fecha) {
      const date = new Date(fecha);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },


    formatearFecha(fecha) {
      if (!fecha) return 'Fecha no disponible';

      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      return new Date(fecha).toLocaleDateString('es-ES', options);
    }
  },
  mounted() {
    this.obtenerArticulos();
    this.obtenerMarcas();
  }
}
</script>