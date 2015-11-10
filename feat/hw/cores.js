exports.title = 'CPU Cores'
exports.description = 'Amount of cpu cores available to node.js'
exports.private = true // Specifies all information gathered here as private
exports.gather2 = function getCores (context, callback) {
  var error // following code standards
  callback(error, {
    quality: 1, // -1=not exerminable, 0=bad/not-recommended, 1=low/usable, 2=medium/not-bad, 3=high/good, 4=outstanding/excellent
    // float / integer / string / label / table / list / markdown / boolean
    table: {
      header: null,
      body: [{label: 'Cores'}, {
        quality: 1,
        integer: 1,
        min: 1
        // max: 8?
      }]
    },
    // warning triggers
    warning: 'Not enough cores!',
    error: context.requiredCores > 1 // Marks the warning as a dealbreaker
  })
}
