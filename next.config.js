/*const path = require('path')
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')

module.exports = withCSS(
    withImages(
        withLess({
            webpack: {
                resolve: {
                    alias: {
                        rsuite: path.resolve(__dirname, '../rsuite'),
                    },
                },
            },
            lessLoaderOptions: {
                javascriptEnabled: true,
            },
        })
    )
)
*/
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Note: we provide webpack above so you should not `require` it
        // Perform customizations to webpack config
        config.plugins.push(new AntdDayjsWebpackPlugin())

        // Important: return the modified config
        return config
    },
})
