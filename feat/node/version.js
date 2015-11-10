exports.description = 'Version of the current Node.js runtime'

function nodeVersionFromSourceURL (sourceUrl, lts) {
  var parts = /^https:\/\/nodejs.org\/download\/(release|nightly|next-nightly|rc|test)\/([^\/]+)/.exec(sourceUrl)
  var result
  if (parts) {
    var branch = parts[1]
    result = 'official'
    if (branch !== 'release') {
      result += ':' + branch
    }
    result += '@' + parts[2]
  } else {
    result = sourceUrl
  }
  if (lts) {
    result += ' [lts: ' + lts + ']'
  }
  return result
}

exports.gather = function gatherVersion (context, callback) {
  var nvd = require('node-version-data')
  var name = process.release.name + '/' + nodeVersionFromSourceURL(process.release.sourceUrl, process.release.lts)
  var semver = require('semver')
  nvd(function (err, data) {
    var warning
    var quality = -1
    var recommend
    var action
    if (err) {
      warning = 'Couldn\'t gather latest version from node.js to compare to'
    } else {
      var latest = data.filter(function (release) {
        if (context.node_version_lts === true) {
          return release.lts
        } else if (context.node_version_lts === false) {
          return !release.lts
        }
        if (process.release.lts) {
          return release.lts !== false
        }
        return true
      }).sort(function (releaseA, releaseB) {
        if (semver.gt(releaseA.version, releaseB.version)) {
          return -1
        }
        return 1
      })[0]

      if (!latest) {
        quality = 0
        warning = 'You are not working with an official, recent release of node'
      } else {
        var diff = semver.diff(latest.version, process.version)
        if (diff === null) {
          quality = 4
        } else if (diff === 'major' || diff === 'premajor') {
          warning = 'This version of node is quite old. You should better update it.'
          quality = 1
        } else if (diff === 'minor' || diff === 'preminor') {
          warning = 'This version is slightly out of date.'
          quality = 2
        } else if (diff === 'patch' || diff === 'prepatch' || diff === 'prerelease') {
          warning = 'A new patch is out for this version of node.'
          quality = 3
        }
        if (warning !== undefined) {
          // TODO: identify first if the system uses n or nvm
          recommend = 'Download the latest node.js version: ' + latest.version + ' from http://nodejs.org/download'
        }
      }
    }
    return callback(null, {
      quality: quality,
      string: name,
      warning: warning === '' ? undefined : warning,
      recommend: recommend === '' ? undefined : recommend,
      action: action
    })
  })
}
