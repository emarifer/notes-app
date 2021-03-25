<template>
    <div>
        <div class="modal">
            <div :class="modalType" id="content-modal"></div>
        </div>

        <div id="modal-choose-option" class="modal">
            <div class="modal-content">
              <h5>¿Deseas realmente eliminar esta nota?</h5>
            </div>
            <div class="modal-footer">
              <a @click="deleteNote" class="modal-close btn blue lighten-1">Sí</a>
              <a class="modal-close btn-flat">NO</a>
            </div>
        </div>

        <div class="container section">
            <h3>Mis Notas</h3>
        </div>
        <div class="container input-field row">
            <form @submit.prevent="executeAction(note)">
                <h5>{{ editingNote.text }} Nota</h5>
                <input type="text" placeholder="Ingresa Nombre…" v-model="note.name"  ref="autofocus">
                <input type="text" placeholder="Ingresa Descripción…" v-model="note.description">
                <div class="section">
                    <button type="submit" @keyup.enter="submit" :class="editingNote.style">
                        {{ editingNote.text }}
                    </button>
                    <button @click="cancel" v-if="editingNote.cancel"
                        class="btn lime darken-4 waves-effect waves-light margin-button">
                        Cancelar
                    </button>
                </div>    
            </form>
        </div>
        <div class="container">
            <table class="responsive-table striped centered teal darken-3 white-text z-depth-5">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(item, index) in notes" :key="index">
                          <td>{{ formattedDate(item.date) }}</td>
                          <td>{{ item.name }}</td>
                          <td>{{ item.description }}</td>
                          <td>
                            <div class="actions">
                                <button @click="chooseWhetherToDelete(item._id)"
                                    class="btn-floating red waves-effect waves-light">
                                    <i class="material-icons white-text">delete</i>
                                </button>
                                <button @click="editNote(item)"
                                  class="btn-floating grey darken-2 waves-effect waves-light">
                                    <i class="material-icons white-text">edit</i>
                                </button>
                            </div>
                          </td>
                      </tr>
                  </tbody>
            </table>
            <ul class="pagination">
                <li class="waves-effect" :class="{ 'disabled': currentPage === 1 }">
                    <router-link :to="{ query: { page: currentPage > 1
                            ? currentPage - 1
                            : currentPage } }" >
                        <i class="material-icons">chevron_left</i>
                    </router-link>
                </li>
                <li class="waves-effect" :class="{ 'active': currentPage === index + 1 }"
                    v-for="(item, index) in numberOfPages" :key="index">
                        <router-link :to="{ query: { page: index + 1 } }">
                            {{ index + 1 }}
                        </router-link>
                </li>
                <li class="waves-effect"
                    :class="{ 'disabled': numberOfPages === currentPage || numberOfPages === 0 }">
                    <router-link
                        :to="{ query: { page: currentPage < numberOfPages 
                                ? currentPage + 1
                                : numberOfPages === 0
                                    ? numberOfPages + 1
                                    : numberOfPages } }">
                        <i class="material-icons">chevron_right</i>
                    </router-link>
                </li>
            </ul>            
        </div>
    </div>
</template>

<style scoped>
    .actions {
        display: flex;
    }
    .actions button {
        margin: 0 0.3rem;
    }
    .margin-button {
        margin-left: 1rem;
    }
    .content-error {
        border: 2px solid red;
        background-color: #ffcdd2;
    }
    .content-success {
        border: 2px solid #00695c;
        background-color: #b2dfdb;
    }
    table {
        margin-bottom: 5rem;
    }
</style>

<script>
    import { mapState, mapActions } from "vuex";
    // Decodificador de JWT
    import decode from 'jwt-decode';

    export default {
        name: 'Notes',
        data() {
            return {
                limit: 5,
                totalNotes: 0,
                currentPage: 1,
                notes: [],
                note: { name: '', description: '' },
                success: false,
                message: null,
                editingNote: {
                    text: 'Agregar',
                    style: 'btn teal darken-3 col s12 waves-effect waves-light', //btn grey darken-2 waves-effect waves-light
                    id: '', 
                    cancel: false,
                },
                modalInstance: null,
                modalType: '',
                config: null,
                idToDelete: '',
            }
        },
        computed: {
            ...mapState(['token']),
            numberOfPages() {
                return Math.ceil(this.totalNotes / this.limit);
            },
        },
        mounted() {
            this.inputFocus();
        },
        watch: {
            "$route.query.page": {
                immediate: true,
                handler(page) {
                    page = parseInt(page);
                    this.pagination(page);
                    this.currentPage = page;
                    this.setPage(page);
                }
            }
        },
        methods: {
            ...mapActions(['setPage', 'checkToken']),
            formattedDate(date) {
                const d = new Date(date);
                return `${d.getHours()}:${d.getMinutes()} -- ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            },
            pagination(page) {
                this.checkToken();
                if (this.token) {
                    this.config = {
                        headers: {
                            token: this.token
                        },
                    };

                    let skip = (page - 1) * this.limit;
                    // console.log(`/notes?limit=${this.limit}&skip=${skip}`);
                    this.axios.get(`/notes?limit=${this.limit}&skip=${skip}`, this.config)
                        .then(res => {
                            // console.log(res.data);
                            this.notes = res.data.notesDB;
                            this.totalNotes = res.data.totalNotes;
                        })
                        .catch(e => {
                            // console.log(e.response);
                            this.createModalInstance();
                            this.message = {};
                            this.message.title = '¡Ocurrió un error!';
                            this.message.response = e.response;
                            this.message.message = '';
                            this.modalType = 'modal-content content-error';
                            this.showModal();
                        });
                } else {
                    this.$router.push({ name: 'Login' });
                }               
            },
            createModalInstance() {
                const modal = document.querySelector('.modal');
                this.modalInstance = M.Modal
                    .init(modal, { dismissible: false, startingTop: '50%' });
            },
            executeAction(note) {
                this.editingNote.text === 'Agregar'
                    ? this.addNote(note)
                    : this.updateNote(note);
            },
            addNote(note) {
                this.checkToken()
                if (this.token) {
                    const pages = this.numberOfPages;
                    if (this.totalNotes)
                        this.$router.push({ query: { page: this.numberOfPages } });
                    this.createModalInstance();
                    this.message = {};
                    this.axios.post('/new-note', note, this.config)
                        .then(res => {
                            this.notes.push(res.data.noteDB);
                            this.totalNotes = res.data.totalNotes; // Actualiza el numero de paginas
                            if (pages !== this.numberOfPages && this.totalNotes) {
                                this.$router.push({ query: { page: this.numberOfPages } });
                            }
                            this.message.title = '¡Nota agregada a la Base de Datos!';
                            this.modalType = 'modal-content content-success';
                            this.showModal();
                        })
                        .catch(e => {
                            // console.log(e.response);
                            this.message.title = '¡Ocurrió un error!';
                            this.message.response = e.response;
                            this.message.message = '';
                            // Esta validacion se configuro en en Schema del backend
                            if (e.response.data.error) this.message.message = e.response.data.error.errors.name.message;
                            this.modalType = 'modal-content content-error';
                            this.showModal();
                        });
                } else {
                    this.$router.push({ name: 'Login' });
                }                
            },
            deleteNote() {
                this.checkToken()
                if (this.token) {
                    this.createModalInstance();
                    this.message = {};
                    this.axios.delete(`/note/${this.idToDelete}`, this.config)
                        .then(res => {
                            const index = this.notes
                                .findIndex(item => item._id === res.data.noteDB._id);
                            this.notes.splice(index, 1);
                            this.totalNotes = res.data.totalNotes; // Actualiza el numero de paginas
                            this.currentPage === 1 && this.totalNotes !== 0
                                ? this.$router.push({ query: { page: this.numberOfPages } })
                                : this.$router.push({ query: { page: 1 } });
                            this.message.title = '¡Nota eliminada de la Base de Datos!';
                            this.modalType = 'modal-content content-success';
                            this.showModal();
                            this.idToDelete = '';
                        })
                        .catch(e => {                        
                            this.message.title = '¡Ocurrió un error!';
                            this.message.response = e.response;
                            this.message.message = '';
                            this.modalType = 'modal-content content-error';
                            this.showModal();
                        });
                        // this.cancel(); // Por si se pulso primero el boton "Editar"
                } else {
                    this.$router.push({ name: 'Login' });
                }
            },
            editNote(item) {
                this.editingNote = {
                    text: 'Editar',
                    style: 'btn grey darken-2 waves-effect waves-light',
                    id: item._id,
                    cancel: true
                };
                this.note.name = item.name;
                this.note.description = item.description;
                this.inputFocus();
            },
            updateNote(note) {
                this.checkToken()
                if (this.token) {                    
                    this.createModalInstance();
                    this.message = {};
                    this.axios.put(`/note/${this.editingNote.id}`, note)
                        .then(res => {
                            const index = this.notes.findIndex(item => item._id === res.data._id);
                            this.notes[index].name = note.name;
                            this.notes[index].description = note.description;
                            this.message.title = '¡Nota actualizada en la Base de Datos!';
                            this.modalType = 'modal-content content-success';
                            this.showModal();
                        })
                        .catch(e => {
                            // console.log(e.response);
                            this.message.title = '¡Ocurrió un error!';
                            this.message.response = e.response;
                            this.message.message = '';
                            // Esta validacion se configuro en en Schema del backend
                            if (e.response.data.error) this.message.message = e.response.data.error.errors.name.message;
                            this.modalType = 'modal-content content-error';
                            this.showModal();
                        });
                } else {
                    this.$router.push({ name: 'Login' });
                }
            },
            cancel() {
                this.editingNote = {
                    text: 'Agregar',
                    style: 'btn teal darken-3 col s12 waves-effect waves-light',
                    id: '',
                    cancel: false
                };
                this.note.name = '';
                this.note.description = '';
                this.inputFocus();
            },           
            inputFocus() {
                this.$refs.autofocus.focus();
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
                    this.cancel();
                }, 3000);
            },
            chooseWhetherToDelete(id) {
                this.idToDelete = id;
                const element = document.getElementById('modal-choose-option');
                const instance = M.Modal.init(element);
                instance.open();
            },
        },
    }
</script>

<!-- Vue-router - programmatically append to querystring:
https://forum.vuejs.org/t/vue-router-programmatically-append-to-querystring/3655 -->