exports.description = 'Gathers the width of the terminal'
exports.gather = function (context, callback) {
  if (process.stdout.columns > 0) {
    callback(null, {
      integer: process.stdout.columns,
      quality: 4
    })
  } else {
    callback(null, {
      integer: process.stdout.columns,
      quality: -1,
      warning: 'Cant gather the columns for this terminal'
    })
  }
}
