exports.description = 'Current terminal location'
exports.private = true
exports.gather = function (context, callback) {
  callback(null, {
    string: process.cwd()
  })
}
