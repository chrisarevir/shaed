import fs from 'fs'
import merge from 'webpack-merge'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'

const config = customizations => {
  const mode = process.env.NODE_ENV

  const tsScriptConfigPath = fs.existsSync(`${process.cwd()}/tsconfig.json`)
    ? `${process.cwd()}/tsconfig.json`
    : path.resolve('node_modules', '@shaed', 'webpack-config', 'tsconfig.json')

  const output =
    mode === 'production'
      ? {
          path: path.resolve(`${process.cwd()}`, 'build'),
          filename: '[name].js',
          libraryTarget: 'umd',
        }
      : {
          path: '/',
          publicPath: 'http://localhost:5000/',
          filename: '[name].js',
          libraryTarget: 'umd',
        }

  let plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    }),
  ]

  plugins =
    mode === 'development'
      ? plugins
      : plugins.concat([
          new webpack.SourceMapDevToolPlugin({
            test: /\.js$/,
            filename: `[file].js.map`,
            append: false,
            exclude: [/node_modules\/*/],
          }),
          new webpack.SourceMapDevToolPlugin({
            test: /\.css$/,
            filename: '[file].map',
            exclude: [/node_modules\/*/],
          }),
        ])

  const defaults = {
    entry: {
      index: path.resolve('src', 'index.js'),
    },

    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      host: '0.0.0.0',
      hot: true,
      inline: true,
      port: '5000',
    },

    devtool: mode === 'production' ? false : 'inline-source-map',

    mode,

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('ts-loader'),
            options: {
              context: process.cwd(),
              configFile: tsScriptConfigPath,
            },
          },
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                require.resolve('@babel/plugin-proposal-object-rest-spread'),
                require.resolve('@babel/plugin-transform-runtime'),
                require.resolve('babel-plugin-transform-class-properties'),
              ],
              presets: [
                require.resolve('@babel/preset-env'),
                require.resolve('@babel/preset-react'),
              ],
            },
          },
        },
        {
          test: /\.s?[ca]ss$/,
          exclude: /node_modules/,
          use: [
            {
              loader:
                mode === 'development'
                  ? require.resolve('style-loader')
                  : MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                localIdentName: '[local]--[hash:base64:5]',
                modules: true,
                importLoaders: 1,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-preset-env')({
                    browsers: 'last 2 versions',
                  }),
                  require('precss')(),
                ],
              },
            },
          ],
        },
        {
          test: /\.(gif|jpe?g|png|svg|eot|ttf|otf|woff2?)$/,
          use: require.resolve('file-loader'),
        },
      ],
    },

    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: 2,
          sourceMap: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          styles: {
            chunks: 'all',
            enforce: true,
            name: 'styles',
            test: /\.css$/,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
        },
      },
    },

    output,

    plugins,

    resolve: {
      extensions: ['.css', '.js', '.jsx', '.scss', '.ts', '.tsx'],
    },
  }

  return typeof customizations === 'function'
    ? customizations(merge, defaults)
    : merge(defaults, customizations)
}

exports = module.exports = config
