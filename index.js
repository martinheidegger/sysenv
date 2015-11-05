const getFeatures = require('./feat')

function flat(obj, sep) {
	return Object.keys(obj).reduce(function (result, key) {
		var child = obj[key]
		Object.keys(child).forEach(function (childKey) {
			result[key + sep + childKey] = child[childKey]
		})
		return result
	}, {})
}

function toList(obj) {
	return Object.keys(obj).reduce(function (result, key) {
		result.push({
			name: key,
			spec: obj[key]
		})
		return result
	}, [])
}

module.exports = function () {
	var features = toList(flat(getFeatures(context.os), '-'))
	if (context.prefix) {
		features = features.filter(function (entry) {
			return entry.name.indexOf(context.prefix) === 0
		})
	}
	if (context.anonymous) {
		features = features.filter(function (entry) {
			return entry.private !== true
		})
	}
	return {
		feat: features
	}
}