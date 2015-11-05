const xtend = require('xtend')
const features = {
	node:     require('./node'),
	hw:       require('./hw'),
	net:      require('./net'),
	terminal: require('./terminal')
}

module.exports = function (os) {
	var system = {}
	system[os] = require('./' + os)
	return xtend(features, system)
}