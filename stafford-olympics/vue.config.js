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
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      background_color: '#000000',
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

