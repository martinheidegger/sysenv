exports.description = 'Uses `supports-color` to check if the terminal supports colors'
exports.gather = function (context, callback) {
	var level = require('supports-color').level

	callback(null, {
		quality: level > 0 ? level + 1 : -1,
		string: level === 1 ? 'basic' : level === 2 ? '256' : level === 3 ? '16m' : 'none',
		bool: level > 0
	})
}