<template>
    <div class="container" v-if="departamento">
        <h2>Registro de Departamentos</h2>


        <div class="form container">
            <div class="form-group">
                <label for="departamento">Departamento</label>
                <input type="text" id="departamento" v-model="departamento.NombreD" placeholder="Departamento" required>
            </div>
            <div class="form-group">
                <label for="descripcion">Descripcion</label>
                <input type="text" id="descripcion" v-model="departamento.DescripcionD" placeholder="Descripcion"
                    required>
            </div>
        </div>

        <!-- Botones -->
        <div class="button-group">
            <button @click="nuevoDepartamento">Nuevo</button>
            <button @click="guardarDepartamento">Guardar</button>
            <button @click="cancelar">Cancelar</button>
        </div>

        <div class="table-container">
            <h3>Departamentos Registrados:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre Departamento</th>
                        <th>Descripcion</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="departamento in departamentos" :key="departamento.Id">
                        <td>{{ departamento.NombreD }}</td>
                        <td>{{ departamento.DescripcionD }}</td>
                        <td><button @click="editarDepartamento(departamento)">Editar</button></td>
                        <td><button @click="eliminarDepartamento(departamento.IdDepartamento)">Eliminar</button></td>
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
            departamentos: [],
            departamento: {
                IdDepartamento: '',
                NombreD: '',
                DescripcionD: '',
            },
            enEdicion: false
        };
    },
    methods: {
        async obtenerDepartamentos() {
            try {
                const response = await axios.get('http://localhost:5000/api/departamentos');
                this.departamentos = response.data;
            } catch (error) {
                console.error('Error al obtener los departamentos:', error);
            }
        },
        nuevoDepartamento() {
            this.departamento = {
                nombre: '',
                descripcion: ''
            };
        },
        async guardarDepartamento() {
            if (this.departamento.NombreD && this.departamento.DescripcionD) {
                if (this.enEdicion) {
                    try {
                        await axios.put(`http://localhost:5000/api/departamentos/${this.departamento.IdDepartamento}`, this.departamento);
                        alert('Departamento actualizado exitosamente');
                        this.obtenerDepartamentos();
                    } catch (error) {
                        console.error('Error al actualizar el departamento:', error);
                        alert('Ocurrio un error al actualizar el departamento');
                    }
                } else {
                    try {
                        await axios.post('http://localhost:5000/api/departamentos', this.departamento);
                        alert('Departamento creado exitosamente');
                        this.obtenerDepartamentos();
                    } catch (error) {
                        console.error('Error al crear el departamento:', error);
                        alert('Ocurrio un error al crear el departamento');
                    }
                }
            } else {
                alert('Por favor, completa todos los campos');
            }
        },
        editarDepartamento(departamento) {
            this.departamento = {
                IdDepartamento: departamento.IdDepartamento,
                NombreD: departamento.NombreD,
                DescripcionD: departamento.DescripcionD
            };
            this.enEdicion = true;
        },
        async eliminarDepartamento(id) {
            const confirmacion = confirm('¿Estas seguro de que deseas eliminar este departamento?');
            if (confirmacion) {
                try {
                    await axios.delete(`http://localhost:5000/api/departamentos/${id}`);
                    this.obtenerDepartamentos();
                    alert('Departamento eliminiado exitosamente');
                } catch (error) {
                    console.error('Error al eliminar el departamento:', error);
                    alert('Ocurrio un error al eliminar el departamento');
                }
            }
        },
        cancelar() {
            this.nuevoDepartamento();
        }
    },
    mounted() {
        this.obtenerDepartamentos();
    }
};
</script>