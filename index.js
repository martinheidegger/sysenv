var getFeatures = require('./feat')
var async = require('async')

function flat (obj, sep) {
  return Object.keys(obj).reduce(function (result, key) {
    var child = obj[key]
    Object.keys(child).forEach(function (childKey) {
      result[key + sep + childKey] = child[childKey]
    })
    return result
  }, {})
}

function toList (obj) {
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
  if (context.filter.regex && context.filter.regex.length > 0) {
    features = features.filter(function (entry) {
      for (var i = 0; i < context.filter.regex.length; i++) {
        var regex = context.filter.regex[i]
        if (regex.test(entry.name)) {
          return true
        }
      }
      return false
    })
  }
  if (context.filter.simple && Object.keys(context.filter.simple).length > 0) {
    features = features.filter(function (entry) {
      return context.filter.simple[entry.name]
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
          var desc = context.hide_description ? undefined : feature.spec.description
          if (error) {
            callback(null, {
              id: feature.name,
              description: desc,
              error: error
            })
          }
          callback(null, {
            id: feature.name,
            description: desc,
            data: data
          })
        })
      }, callback)
    }
  }
}
