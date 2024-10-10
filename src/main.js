import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if(!token && to.path !== '/login') {
        next('/login')
    } else {
        next()
    }
})