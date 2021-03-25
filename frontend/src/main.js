import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
// materializeCss
import store from './store';
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/dist/js/materialize.js';

Vue.use(VueAxios, axios);

// We add the base URL of our API
// axios.defaults.baseURL = 'http://localhost:3500/api';
// axios.defaults.baseURL = 'https://emarinfer-notes.herokuapp.com/api';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/* 
INTEGRACION DE MATERIALIZE CSS CON VUEJS:
https://gist.github.com/josepereza/1dcf75263c1f8f08827992778d3046a0

DOCUMENTACION DE MATERIALIZE CSS:
https://materializecss.com/

DEPLOY DE UNA SPA DE VUEJS EN GITHUB PAGES:
https://platzi.com/tutoriales/1111-vuejs/3441-como-hacer-deploy-de-una-aplicacion-de-vuejs-hacia-github-pages-usando-vue-cli-3/

https://stackoverflow.com/questions/48521177/404-when-reloading-a-vue-website-published-to-github-pages#62188491

- RENOMBRAR CARPETA DIST CON EL NOMBRE DEL REPOSITORIO DE GITHUB
- DENTRO DE DICHA CARPETA:
- DUPLICAR EL index.html Y RENOMBRARLO A 404.html
- Y AHORA EN LA TERMINAL:
git init
git add -A
git commit -m "Deploy"
git checkout -b gh-pages
git remote add origin https://github.com/emarifer/materialize.git (EN ESTE CASO, ES EL NOMBRE DEL REPOSITORIO)
git push -u origin gh-pages (INGRESAR CREDENCIALES)
- IR AL REPOSITORIO DE GITHUB > Settings > GitHub Pages Y CLICKAR EL ENLACE
*/
