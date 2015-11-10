var ansi = require('ansi-styles')
var chalk = require('chalk')

function fill (name, width) {
  return name + new Array(width - name.length + 1).join(' ')
}

exports.description = 'Renders all ansi styles to check if the terminal supports colors or not'
exports.gather = function (context, callback) {
  var widest = Object.keys(ansi.colors).reduce(function (widest, name) {
    return Math.max(widest, name.length)
  }, 0)

  widest = Object.keys(ansi.bgColors).reduce(function (widest, name) {
    return Math.max(widest, name.length)
  }, widest)

  var select = '\n\nSelect combinations: \n'
  select += ' - white on white: ' + chalk.white.bgWhite(' white \u2588 ') + '\n'
  select += ' - red on red: ' + chalk.red.bgRed(' red \u2588 ') + '\n'
  select += ' - black on black: ' + chalk.black.bgBlack(' black \u2588 ') + '\n'
  select += ' - italic,underlined,strikethrough red on blue: ' + chalk.red.bgBlue.italic.underline.strikethrough(' red on blue \u2588 ') + '\n'
  select += ' - dim,bold blue on green: ' + chalk.dim.bold.blue.bgGreen(' blue on green \u2588 ') + '\n'
  select += ' - dim white on yellow: ' + chalk.inverse.dim.white.bgYellow(' white on yellow \u2588 ') + '\n'
  select += ' - inverse,dim white on yellow: ' + chalk.inverse.dim.white.bgYellow(' white on yellow \u2588 ')

  callback(null, {
    string: [ansi.colors, ansi.bgColors].reduce(function (result, list) {
      return result.concat(Object.keys(list).reduce(function (result, name) {
        var style = list[name]
        var string = style.open + '\u2588 ' + fill(name, widest) + style.close
        Object.keys(ansi.modifiers).forEach(function (modifierKey) {
          if (modifierKey === 'reset') {
            return
          }
          var modifier = ansi.modifiers[modifierKey]
          string += ' ' + modifier.open + style.open + '\u2588 ' + modifierKey + style.close + modifier.close
        })
        result.push(string)
        return result
      }, []))
    }, []).join('\n') + select
  })
}
