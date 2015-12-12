exports.description = 'User that runs the node process'
exports.private = true
exports.gather = function (context, callback) {
  require('os-user')(function (ignore, user) {
    var hasUser = !/^\s*$/.test(String(user))
    callback(null, {
      string: user,
      quality: hasUser ? 4 : 0,
      warning: hasUser ? undefined : 'Can not identify the user.'
    })
  })
}
