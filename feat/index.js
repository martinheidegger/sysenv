var xtend = require('xtend')
var features = {
  node: require('./node'),
  hw: require('./hw'),
  net: require('./net'),
  term: require('./term')
}

module.exports = function (context) {
  var system = {}
  if (context.os) {
    system[context.os] = require('./' + context.os)
  }
  return xtend(features, system)
}
