// Karma configuration
module.exports = function(config) {
  config.set({
    // Base path que se usará para resolver todos los patrones (ej. archivos, excludes)
    basePath: '',

    // Frameworks a usar
    // Disponibles: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // Lista de archivos / patrones a cargar en el navegador
    files: [
      // Primero TODA la lógica
      'src/utils/**/*.logic.js',
      // Luego TODOS los tests
      'src/utils/**/*.{spec,test}.js'
    ],

    // Lista de archivos / patrones a excluir
    exclude: [
    ],

    // Preprocesar archivos antes de servirlos al navegador
    // Disponibles: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // Reporteros de resultados
    // Posibles valores: 'dots', 'progress'
    // Disponibles: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'kjhtml'],

    // Puerto del servidor web
    port: 9876,

    // Habilitar / deshabilitar colores en la salida (reporteros y logs)
    colors: true,

    // Nivel de logging
    // Posibles valores: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Habilitar / deshabilitar observar archivos y ejecutar pruebas cuando cambien
    autoWatch: true,

    // Navegadores en los que ejecutar las pruebas
    // Disponibles: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Configuración personalizada de Chrome
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--remote-debugging-port=9222'
        ]
      }
    },

    // Continuous Integration mode
    // Si true, Karma captura navegadores, ejecuta las pruebas y sale
    singleRun: false,

    // Nivel de concurrencia
    // Cuántos navegadores deben iniciarse simultáneamente
    concurrency: Infinity,

    // Plugins necesarios
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter'
    ]
  })
}
