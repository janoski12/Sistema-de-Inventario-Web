<template>
    <div class="container" v-if="puesto">
        <h2>Registro de Puestos</h2>

        <div class="form container">
            <div class="form-group">
                <label for="puesto">Puesto</label>
                <input type="text" id="puesto" v-model="puesto.NombreP" placeholder="Puesto" required>
            </div>
            <div class="form-group">
                <label for="descripcion">Descripcion</label>
                <input type="text" id="descripcion" v-model="puesto.DescripcionP" placeholder="Descripcion" required>
            </div>
        </div>

        <div class="button-group">
            <button @click="nuevoPuesto">Nuevo</button>
            <button @click="guardarPuesto">Guardar</button>
            <button @click="cancelar">Cancelar</button>
        </div>

        <div class="table-container">
            <h3>Puestos Registrados:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre Puesto</th>
                        <th>Descripcion</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="puesto in puestos" :key="puesto.Id">
                        <td>{{ puesto.NombreP }}</td>
                        <td>{{ puesto.DescripcionP }}</td>
                        <td><button @click="editarPuesto(puesto)">Editar</button></td>
                        <td><button @click="eliminarPuesto(puesto.IdPuesto)">Eliminar</button></td>
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
            puestos: [],
            puesto: {
                IdPuesto: '',
                NombreP: '',
                DescripcionP: '',
            },
            enEdicion: false
        }
    },
    methods: {
        async obtenerPuestos() {
            try {
                const response = await axios.get('http://localhost:5000/api/puestos');
                this.puestos = response.data;
            } catch (error) {
                console.error('Error al obtener los puestos:', error);
            }
        },
        nuevoPuesto() {
            this.puesto = {
                nombre: '',
                descripcion: ''
            };
        },
        async guardarPuesto() {
            if (this.puesto.NombreP && this.puesto.DescripcionP) {
                if (this.enEdicion) {
                    try {
                        await axios.put(`http://localhost:5000/api/puestos/${this.puesto.IdPuesto}`, this.puesto);
                        alert('Departamento actualizado exitosamente');
                        this.obtenerPuestos();
                    } catch (error) {
                        console.error('Error al actualizar el puesto:', error);
                        alert('Ocurrio un error al actualizar el puesto');
                    }
                } else {
                    try {
                        await axios.post('http://localhost:5000/api/puestos', this.puesto);
                        alert('Puesto creado exitosamente');
                        this.obtenerPuestos();
                    } catch (error) {
                        console.error('Error al crear el puesto:', error);
                        alert('Ocurrio un error al crear el puesto');
                    }
                }
            } else {
                alert('Por favor, completa todos los campos');
            }
        },
        editarPuesto(puesto) {
            this.puesto = {
                IdPuesto: puesto.IdPuesto,
                NombreP: puesto.NombreP,
                DescripcionP: puesto.DescripcionP
            };
            this.enEdicion = true;
        },
        async eliminarPuesto(id) {
            const confirmacion = confirm('¿Estas segurp de qie deseas eliminar este puesto?');
            if (confirmacion) {
                try {
                    await axios.delete(`http://localhost:5000/api/puestos/${id}`);
                    this.obtenerPuestos();
                    alert('Puesto eliminado exitosamente');
                } catch (error) {
                    console.error('Error al eliminar el puesto:'. error);
                    alert('Ocurrio un error al eliminar el departamento');
                }
            }
        },
        cancelar() {
            this.nuevoPuesto();
        }
    },
    mounted() {
        this.obtenerPuestos();
    }
}
</script>