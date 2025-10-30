// karma.conf.js
module.exports = function(config) {
  config.set({
    // ... (otras configuraciones)

    files: [
      // Añade estas dos líneas para React
      'node_modules/react/umd/react.development.js',
      'node_modules/react-dom/umd/react-dom.development.js',
      
      // Tu código fuente y pruebas
      'src/**/*.js',
      'src/**/*.jsx', // Asegúrate de incluir archivos JSX
      'test/**/*.spec.js' // O donde tengas tus pruebas
    ],
    
    // ... (el resto de tu configuración)
  });
};