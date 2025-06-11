export default {
  // Base public path when served in development or production
  base: './',
  
  // Configure the server options
  server: {
    port: 3000,
    open: true
  },
  
  // Configure build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
} 