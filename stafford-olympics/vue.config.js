module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    name: 'Stafford Olympics',
    themeColor: '#121212',
    msTileColor: '#121212',
    appleMobileWebAppCapable: 'yes',
    manifestOptions:{
      backgroundColor: '#121212'
    },
    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      swDest: 'service-worker.js',
    },
  }
}
