const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

/* eslint-disable */
const withCSS = require('@zeit/next-css')
const withLess = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
    fs.readFileSync(path.resolve(__dirname, './antd.less'), 'utf8')
)

module.exports = withBundleAnalyzer(
    withCSS(
        withLess({
            lessLoaderOptions: {
                javascriptEnabled: true,
                modifyVars: themeVariables, // make your antd custom effective
            },
            webpack: (config, { isServer }) => {
                config.plugins.push(new AntdDayjsWebpackPlugin())
                if (isServer) {
                    const antStyles = /antd\/.*?\/style.*?/
                    const origExternals = [...config.externals]
                    config.externals = [
                        (context, request, callback) => {
                            if (request.match(antStyles)) return callback()
                            if (typeof origExternals[0] === 'function') {
                                origExternals[0](context, request, callback)
                            } else {
                                callback()
                            }
                        },
                        ...(typeof origExternals[0] === 'function'
                            ? []
                            : origExternals),
                    ]

                    config.module.rules.unshift({
                        test: antStyles,
                        use: 'null-loader',
                    })
                }
                return config
            },
        })
    )
)
