/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const path = require('path')
const normalizeToUnixPath = require('./utils/normalize-to-unix-path')

const isWindows = process.platform === 'win32'

/**
 *
 * @param {import('./types').PluginOptions} pluginOptions
 * @returns
 */
function withSwingset(pluginOptions = {}) {
  /**
   * @param {import('next/types').NextConfig} nextConfig
   */
  return function nextOverrides(nextConfig = {}) {
    return Object.assign({}, nextConfig, {
      /**
       *
       * @param {*} config
       * @param {import('next/dist/server/config-shared').WebpackConfigContext} options
       * @returns
       */
      webpack(config, options) {
        // normalize componentsRoot path
        const componentsRootGlob = normalizeToUnixPath(
          path.resolve(
            normalizeToUnixPath(config.context),
            pluginOptions.componentsRoot
              ? pluginOptions.componentsRoot
              : 'components/*'
          )
        )

        const componentsRootSystemPath = path.resolve(
          config.context,
          pluginOptions.componentsRoot
            ? pluginOptions.componentsRoot
            : 'components/*'
        )

        pluginOptions.componentsRoot = componentsRootGlob
        pluginOptions.componentsRootSystemPath = componentsRootSystemPath

        // normalize docsRoot path
        const docsRootPath = normalizeToUnixPath(
          path.resolve(
            config.context,
            pluginOptions.docsRoot ? pluginOptions.docsRoot : 'docs/*'
          )
        )
        pluginOptions.docsRoot = docsRootPath
        //
        const loaderPath = path.join(__dirname, 'components-loader.js')
        console.log({ loaderPath })
        config.module.rules.push({
          test: /__swingset_data/,
          use: [
            {
              loader: loaderPath,
              options: { pluginOptions, webpackConfig: config },
            },
          ],
        })

        // Don't clobber previous plugins' webpack functions
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    })
  }
}

module.exports = withSwingset
