import { createRouter, createWebHistory } from 'vue-router'

// routes
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./components/Home.vue'),
    },
    {
        path: '/:model',
        name: 'Model',
        component: () => import('./components/Model.vue'),
    },
    {
        path: '/v/:model',
        name: 'ModelV',
        component: () => import('./components/ModelV.vue'),
    },
    {
        path: '/p/Geometry',
        name: 'Geometry',
        component: () => import('./components/ProceduralModels/Geometry.vue'),
    },
    {
        path: '/p/Particles',
        name: 'Particles',
        component: () => import('./components/ProceduralModels/Particles.vue'),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router