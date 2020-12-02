const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
const withSass = require('@zeit/next-sass')
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')

const isProd = process.env.NODE_ENV === 'production'

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
    require.extensions['.less'] = (file) => {}
}

const bundleConfig = withBundleAnalyzer({
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Note: we provide webpack above so you should not `require` it
        // Perform customizations to webpack config
        config.plugins.push(new AntdDayjsWebpackPlugin())

        // Important: return the modified config
        return config
    },
})

module.exports = withCSS({
    ...bundleConfig,
    cssModules: true,
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: '[local]___[hash:base64:5]',
    },
    ...withLess(
        withSass({
            lessLoaderOptions: {
                // modifyVars: {
                //     'primary-color': '#1DA57A',
                //     'link-color': '#1DA57A',
                //     'border-radius-base': '2px',
                // },
                javascriptEnabled: true,
            },
        })
    ),
})
