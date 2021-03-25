import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import Login from '../views/Login.vue';

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import(/* webpackChunkName: "notes" */ '../views/Notes.vue'),
    meta: { requireAuth: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const protectedRoute = to.matched.some(record => record.meta.requireAuth);

  protectedRoute && store.state.token === ''
    ? next({ name: 'Login' })
    : next();
});

/* const patchRouterMethod = (router, methodName) => { // Solucion equivalente a la de arriba
    router['old' + methodName] = router[methodName]
    router[methodName] = async function (location) {
        return router['old' + methodName](location).catch((error) => {
            if (error.name === 'NavigationDuplicated') return this.currentRoute;
            throw error;
        });
    };
};

patchRouterMethod(router, 'push');
patchRouterMethod(router, 'replace'); */

export default router;

// PARA EVITAR EL ERROR «NavigationDuplicated: Avoided redundant navigation to current location: "/notes".» HAY DOS SOLUCIONES:
// (1) https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
// (1) https://www.programmersought.com/article/53746573777/

// (2) https://stackoverflow.com/questions/57837758/navigationduplicated-navigating-to-current-location-search-is-not-allowed#63263736

// HE OPTADO POR LA PRIMERA, AUNQUE AMBAS SON VALIDAS
