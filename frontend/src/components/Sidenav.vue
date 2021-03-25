<template>
    <div class="row">
        <div class="custom-nav teal darken-1 col s12">
            <div class="left-bar">
                <img src="../assets/img/GitHub-Mark.png" alt="Logo">
                <a href="https://emarifer.github.io/curriculum/" target="_blank" class="white-text">
                    Mi Landing Page
                </a>
            </div>

            <button class="btn-flat" :class="{ 'open': active }" data-target="menu-side" @click="navigate">
                <!-- <i class="material-icons white-text">menu</i> -->
                <span class="top-line"></span>
                <span class="middle-line"></span>
                <span class="bottom-line"></span>
            </button>
        </div>
    
        <ul class="sidenav sidenav-close grey darken-4" id="menu-side">
            <li>
                <div class="user-view">
                    <div class="background">
                        <img src="../assets/img/s3.jpg" alt="">
                    </div>
                    <img v-if="!this.userDB" src="https://img.icons8.com/officel/2x/person-male.png" class="circle" alt="Mi Avatar">
                    <img v-else :src="this.userDB.data.avatar" class="circle" alt="Mi Avatar">
                    <span v-if="this.userDB" class="name white-text"><b>{{ userDB.data.name }}</b></span>
                    <span v-if="this.userDB" class="email white-text"><b>{{ userDB.data.email }}</b></span>
                    <span v-else class="white-text"><b>NO HAY USUARIO LOGEADO</b></span>
                </div>
            </li>
            <li v-if="!isActive">
                <router-link to="/">
                    <i class="material-icons white-text">login</i>
                    Login
                </router-link>
                <div class="divider"></div>
            </li>
            <li v-if="!isActive">
                <router-link to="/register">
                    <i class="material-icons white-text">app_registration</i>
                    Registrar Usuarios
                </router-link>
                <div class="divider"></div>
            </li>
            <li v-if="isActive">
                <router-link to="/notes">
                    <i class="material-icons white-text">notes</i>
                    Notas
                </router-link>
                <div class="divider"></div>
            </li>
            <li v-if="isActive" class="sidenav-close">
                <a href="" @click.prevent="signOff">
                    <i class="material-icons white-text">logout</i>
                    Cerrar Sesión
                </a>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .row {
        margin-bottom: 5rem;
    }

    .left-bar {
        display: flex;
        align-items: center;
    }

    .left-bar img {
        width: 3rem;
        height: 3rem;
        margin-right: 1rem;
    }

    .custom-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 5rem;
        position: fixed;
    }

    .sidenav {
        text-align: left;
    }

    .sidenav a.router-link-exact-active {
        color: #42b983;
        font-size: medium;
        font-weight: bolder;
    }

    .sidenav a {
        color: white;
    }

    button span {
        background: white;
        display: block;
        width: 1.5rem;
        margin: 3px auto;
        height: 2px;
        animation-duration: 1s;
        animation-fill-mode: forwards;
    }

    button.open .top-line {
        animation-name: top-line-animation;
    }
    
    button.open .middle-line {
        animation-name: middle-line-animation;
    }
    
    button.open .bottom-line {
        animation-name: bottom-line-animation;
    }

    button .top-line {
        animation-name: top-line-animation-close;
    }

    button .middle-line {
        animation-name: middle-line-animation-close;
    }

    button .bottom-line {
        animation-name: bottom-line-animation-close;
    }

    @keyframes top-line-animation {
        50%, 100%{
            margin: 0 auto;
            transform: translateY(2px) rotate(-45deg);
        }
    }

    @keyframes bottom-line-animation {
        50%, 100%{
            margin: 0 auto;
            transform: translateY(-2px) rotate(45deg);
        }
    }

    @keyframes middle-line-animation {
        20%, 100%{
            margin: 0 auto;
            width: 0;
        }
    }

    @keyframes top-line-animation-close {
        0%{
            margin: 0 auto;
            transform: translateY(2px) rotate(-45deg);
        }

        50%, 100%{
            margin: 3px auto;
            transform: translateY(0px) rotate(0deg);
        }
    }

    @keyframes bottom-line-animation-close {
        0%{
            margin: 0 auto;
            transform: translateY(-2px) rotate(45deg);
        }

        50%, 100%{
            margin: 3px auto;
            transform: translateY(0px) rotate(0deg);
        }
    }

    @keyframes middle-line-animation-close {
        0%{
            margin: 0 auto;
            width: 0;
        }

        20%, 100%{
            margin: 3px auto;
            width: 1.5rem;
        }
    }
</style>

<script>
    import { mapState, mapActions, mapGetters } from "vuex";

    export default {
        name: 'Sidenav',
        data() {
            return {
                active: false,
            }
        },
        mounted() {
            this.checkToken()
                ? this.$router.push({ name: 'Notes', query: { page: this.page } })
                : this.$router.push({ name: 'Login' });
        },
        methods: {
            ...mapActions(['signOut', 'checkToken']),
            signOff() {
                this.signOut();
                this.$router.push({ name: 'Login' });
            },
            navigate() {
                const element = document.querySelector('.sidenav');
                const instance = M.Sidenav.init(element, { 
                    onOpenStart: () => this.active = true,
                    onCloseEnd: () => this.active = false,
                });
                instance.open();
            },
        },
        computed: {
            ...mapState(['userDB', 'page']),
            ...mapGetters(['isActive']),
        },
    }
</script>

<!-- COLAPSAR EL MENU TRAS HACER CLICK EN UN ITEM:
https://stackoverflow.com/questions/50295140/how-to-hide-sidenav-in-materialize-css-when-link-is-clicked#58098811 -->