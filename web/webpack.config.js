module.exports = {
  resolve: {
    fallback: {
      util: require('util/'),
      stream: require.resolve('stream-browserify'),
    }
  }
}
