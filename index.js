var getFeatures = require('./feat')
var async = require('async')

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

module.exports = function (context) {
  var features = toList(flat(getFeatures(context), '-'))
  // Once all features have gather methods, this isn't necessary anymore
  features = features.filter(function (entry) {
    return typeof entry.spec.gather === 'function'
  })
  if (context.prefix) {
    features = features.filter(function (entry) {
      return entry.name.indexOf(context.prefix) === 0
    })
  }
  if (context.anonymous) {
    features = features.filter(function (entry) {
      return entry.spec.private !== true
    })
  }
  return {
    gather: function (callback) {
      async.map(features, function (feature, callback) {
        feature.spec.gather(context, function (error, data) {
          callback(null, {
            id: feature.name,
            description: context.hide_description ? undefined : feature.spec.description,
            data: data
          })
        })
      }, callback)
    }
  }
}