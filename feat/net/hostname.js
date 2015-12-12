exports.description = 'Hostname for this computer'
exports.private = true
exports.gather = function (context, callback) {
  require('os-hostname')(function (ignore, hostname) {
    var hasHostName = !/^\s*$/.test(String(hostname))
    callback(null, {
      string: hostname,
      quality: hasHostName ? 4 : 0,
      warning: hasHostName ? undefined : 'Can not identify the hostname.'
    })
  })
}
