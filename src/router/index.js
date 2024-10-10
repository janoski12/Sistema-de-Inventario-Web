import { createRouter, createWebHistory } from 'vue-router';
import MenuPrincipal from '../views/MenuPrincipal.vue';
import BuscarArticulos from '../components/BuscarArticulos.vue';
import EntregaActivos from '../components/EntregaActivos.vue';
import DescargoActivos from '../components/DescargoActivos.vue';
import RegistroEmpleados from '../components/RegistroEmpleados.vue';
import AdministracionUsuarios from '../components/AdministracionUsuarios.vue';
import ListaDepartamentos from '../components/ListaDepartamentos.vue';
import ListaPuestos from '../components/ListaPuestos.vue';


const routes = [
    { 
        path: '/', 
        component: MenuPrincipal,
    },
    { 
        path: '/buscar-articulos', 
        component: BuscarArticulos
    },
    { 
        path: '/entrega-activos', 
        component: EntregaActivos
    },
    { 
        path: '/descargo-activos', 
        component: DescargoActivos 
    },
    { 
        path: '/registro-empleados', 
        component: RegistroEmpleados 
    },
    { 
        path: '/administracion-usuarios', 
        component: AdministracionUsuarios 
    },
    { 
        path: '/lista-departamentos', 
        component: ListaDepartamentos 
    },
    { 
        path: '/lista-puestos', 
        component: ListaPuestos
    },
];

const router = new createRouter({
    history: createWebHistory(),
    routes
});

export default router;