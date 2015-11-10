exports.description = 'Check if the terminal is a tty terminal'
exports.gather = function (context, callback) {
  if (process.stdout.isTTY) {
    callback(null, {
      bool: true,
      quality: 4
    })
  } else {
    callback(null, {
      bool: false,
      quality: 0,
      warning: 'This terminal does not support tty!',
      recommend: 'Change the terminal application.' // TODO: recommend a terminal application
    })
  }
}
