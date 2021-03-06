module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    name: 'Stafford Olympics',
    themeColor: '#121212',
    msTileColor: '#121212',
    appleMobileWebAppCapable: 'yes',
    mobileWebAppCapable: 'yes',
    manifestOptions: {
      background_color: '#121212',
      related_applications: [{
        platform: "webapp",
        // url: "http://localhost:5000"
        url: "https://stafford-olympics.web.app/manifest.json"
      }]
    },
    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      swDest: 'service-worker.js',
    },
  }
}

