<template>
    <div class="container section">
        <div class="modal">
            <div :class="modalType" id="content-modal"></div>
        </div>
        <h3>Login</h3>
        <form class="input-field row" @submit.prevent="login">
            <input type="email" placeholder="Ingresa Email…"
                ref="autofocus" v-model="user.email" required>
            <div class="visibility">
                <input :type="type" placeholder="Ingresa Contraseña…" v-model="user.pass" required>
                <i class="material-icons" @click.prevent="showPassword">{{ btnText }}</i>
            </div>
            <div class="section">
                <button type="submit" @keyup.enter="submit" class="btn col s12">
                    Ingresar
                </button>
            </div>    
        </form>
    </div>
</template>

<style scoped>
    .content-error {
        border: 2px solid red;
        background-color: #ffcdd2;
    }
    .content-success {
        border: 2px solid #00695c;
        background-color: #b2dfdb;
    }
    .visibility {
        display: flex;
        align-items: center;
    }
    .visibility i {
        margin-left: 1rem;
        cursor: pointer;
    }
</style>

<script>
    import { mapActions } from "vuex";

    export default {
        data() {
            return {
                user: {
                    email: '',
                    pass: '',
                },
                type: 'password',
                btnText: 'visibility',
                success: false,
                message: null,
                modalInstance: null,
                modalType: '',
            }
        },
        mounted() {
            this.inputFocus();
        },
        methods: {
            ...mapActions(['saveUser']),
            showPassword() {
                if (this.type === 'password') {
                    this.type = 'text';
                    this.btnText = 'visibility_off';
                } else {
                    this.type = 'password';
                    this.btnText = 'visibility';
                }
            },
            createModalInstance() {
                const modal = document.querySelector('.modal');
                this.modalInstance = M.Modal
                    .init(modal, { dismissible: false, startingTop: '50%' });
            },
            login() {
                // console.log(this.user);
                this.axios.post('/login', this.user)
                    .then(res => {
                        // console.log(res.data);
                        const token = res.data.token;
                        this.saveUser(token);
                        this.$router.push({ name: 'Notes', query: { page: 1 } });
                    })
                    .catch(e => {
                        // console.log(e.response);
                        this.createModalInstance();
                        this.message = {};
                        this.message.title = '¡Ocurrió un error!';
                        this.message.response = e.response;
                        this.message.message = e.response.data.message;
                        this.modalType = 'modal-content content-error';
                        this.showModal();
                    });
            },
            showModal() {
                const { title, response, message } = this.message;
                const template = !response
                    ? `<h5>${title}</h5>`
                    :`<h5>${title}</h5>
                    <p><b>Error ${response.status}: ${response.statusText}</b></p>
                    <p>${message}</p>`;
                const contentModal = document.getElementById('content-modal');
                contentModal.innerHTML = template;
                this.modalInstance.open();
                setTimeout(() => {                    
                    this.modalInstance.close();
                    this.modalInstance.destroy();
                    this.modalInstance = null;
                    this.message = null;
                }, 3000);
            },
            inputFocus() {
                this.$refs.autofocus.focus();
            },
        },
    }
</script>