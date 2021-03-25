import express from 'express';
import cors from 'cors';
import path from 'path';
import history from 'connect-history-api-fallback';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

// Conexion a DB
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.4temp.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
)
    .then(() => console.log('Connected database')) 
    .catch(e => console.error('Error DB', e));

// Set listening port
app.set('port', process.env.PORT || 3000);
const PORT = app.get('port');

// Middlewares (morgan, cors, parseador del req.body)
app.use(morgan('dev')); // Se tiene que llamar antes que entre en una ruta
app.use(cors()); // Admite configuraciones con un objeto de options
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded. VER NOTA-1

// Routes (aqui iran las rutas de la API)
// app.get('/', (req, res) => {
//    res.send({
//        status: true,
//        message: 'It works!'
//    });
// });

 // Middlewares que indican las rutas que se usaran para la REST API
app.use('/api', require('./routes/routes_notes'));
app.use('/api', require('./routes/routes_users'));
app.use('/api', require('./routes/route_login'));

// Middleware for Vue.js router history mode
app.use(history()); // Tiene que estar antes de la config. como static de public. VER NOTA-2
app.use(express.static(path.join(__dirname, 'public'))); // Set static files folder

// Start server
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});

// NOTA-1:
// https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded/51844327#51844327
// NOTA-2:
// https://www.npmjs.com/package/connect-history-api-fallback#introduction
// https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
