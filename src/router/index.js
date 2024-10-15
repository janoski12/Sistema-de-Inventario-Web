import { createRouter, createWebHistory } from 'vue-router';
import MenuPrincipal from '../views/MenuPrincipal.vue';
import BuscarArticulos from '../components/BuscarArticulos.vue';
import EntregaActivos from '../components/EntregaActivos.vue';
import DescargoActivos from '../components/DescargoActivos.vue';
import RegistroEmpleados from '../components/RegistroEmpleados.vue';
import AdministracionUsuarios from '../components/AdministracionUsuarios.vue';
import ListaDepartamentos from '../components/ListaDepartamentos.vue';
import ListaPuestos from '../components/ListaPuestos.vue';
import auth from '@/middleware/auth';



const routes = [
    { 
        path: '/',
        name: 'home', 
        component: MenuPrincipal,
        beforeEnter: auth
    },
    { 
        path: '/buscar-articulos', 
        name: 'buscar-artículos',
        component: BuscarArticulos,
        beforeEnter: auth
    },
    { 
        path: '/entrega-activos',
        name: 'entrega-activos', 
        component: EntregaActivos,
        beforeEnter: auth
    },
    { 
        path: '/descargo-activos',
        name: 'descargo-activos', 
        component: DescargoActivos ,
        beforeEnter: auth
    },
    { 
        path: '/registro-empleados', 
        name: 'registro-empleados',
        component: RegistroEmpleados,
        beforeEnter: auth
    },
    { 
        path: '/administracion-usuarios',
        name: 'administracion-usuarios', 
        component: AdministracionUsuarios,
        beforeEnter: auth
    },
    { 
        path: '/lista-departamentos', 
        name: 'lista-departamentos',
        component: ListaDepartamentos,
        beforeEnter: auth
    },
    { 
        path: '/lista-puestos',
        name: 'lista-puestos',
        component: ListaPuestos,
        beforeEnter: auth
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/LoginForm.vue')
    }
];

const router = new createRouter({
    history: createWebHistory(),
    routes
});


export default router;