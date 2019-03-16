const config = require('@shaed/webpack-config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = config((merge, defaults) => {
  return merge(defaults, {
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'A Framework?',
      }),
    ],
  })
})
