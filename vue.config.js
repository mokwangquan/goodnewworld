// vue.config.js

module.exports = {
  publicPath: '/goodnewworld'
}

let dateStamp = new Date()
let year = ""+dateStamp.getFullYear()
let month = ""+(dateStamp.getMonth()+1)
let date = ""+dateStamp.getDate()
dateStamp = year + month + date 

let filename
let chunkFilename

if (process.env.NODE_ENV === "production") {
  filename = chunkFilename =`[name].[contenthash:8]_${dateStamp}`
} else {
  filename = chunkFilename =`[name].${dateStamp}`
}

let plugins = [];

// === how to use analyzer? turn it on below and just use npm run serve (dev) or npm run production
// === comment the following to disable analyzer
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// plugins.push(new BundleAnalyzerPlugin()); 

module.exports = {
  configureWebpack: {
    output: {
      filename: `js/${filename}.min.js`,
      chunkFilename: `js/${chunkFilename}.min.js`,
    },
    plugins,
  },
  css: {
    extract: {
      filename: `${filename}.css`,
      chunkFilename: `${chunkFilename}.css`,
    },
  },
};