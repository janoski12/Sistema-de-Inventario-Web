import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import crypto from 'crypto-browserify';

createApp(App).use(router).mount('#app');
