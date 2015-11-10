exports.description = 'Gathers the height of the terminal'
exports.gather = function (context, callback) {
	if (process.stdout.rows > 0) {
		callback(null, {
			integer: process.stdout.rows,
			quality: 4,
		})
	} else {
		callback(null, {
			integer: process.stdout.rows,
			quality: -1,
			warning: 'Cant gather the rows for this terminal'
		})
	}
}