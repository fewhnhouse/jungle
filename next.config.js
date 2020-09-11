const path = require('path')
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
