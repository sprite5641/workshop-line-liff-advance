import { createRouter, createWebHistory } from 'vue-router';
import Register from './components/Register.vue';
import Index from './components/Index.vue';

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
