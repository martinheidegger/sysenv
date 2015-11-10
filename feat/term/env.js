WHITE_LIST = {
	'LC_CTYPE': true,
	'COMMAND_MODE': true,
	'TERM': true,
	'EDITOR': true,
	'LC_ALL': true,
	'TERM_PROGRAM': true,
	'SHELL': true,
	'SHELL': true,
}

exports.description = 'Defined environment variables'
exports.gather = function (context, callback) {
	callback(null, {
		list: Object.keys(process.env).filter(function (key) {
			if (key === 'PATH') {
				return false
			}
			if (context.anonymous) {
				return WHITE_LIST[key] || false
			}
			return true
		}).map(function (key) {
			return key + ' = ' + process.env[key]
		}),
	})
}