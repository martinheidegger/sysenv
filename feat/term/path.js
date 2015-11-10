var path = require('path')

exports.description = 'Current lookup path'
exports.private = true
exports.gather = function (context, callback) {
	callback(null, {
		list: (process.env.PATH || '').split(path.delimiter),
	})
}