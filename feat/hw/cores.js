exports.title = 'CPU Cores'
exports.description = 'Amount of cpu cores available to node.js'
exports.private = true // Specifies all information gathered here as private
exports.gather = function getCores (context, callback) {
	var error // following code standards
	callback(error, {
		quality: 1, // -1=bad/unacceptable, 0=low/usable, 1=medium/not-bad, 2=high/good, 3=outstanding/excellent
		// float / integer / string / label / table / list / markdown
		table: {
			header: null,
			body: [{label: 'Cores'},{
				quality: 1,
				integer: 1,
				min: 1
				// max: 8?
			}]
		},
		// warning triggers
		warning: 'Not enough cores!',
		error: context.
	})
}
