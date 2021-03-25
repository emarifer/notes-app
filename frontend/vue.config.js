module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/notes-app/' // materialize-app
      : '/',
    pages: {
      index: {
        entry: 'src/main.js',
        title: 'Mis Notas en la Nube'
      }
    }
}