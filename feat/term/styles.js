exports.description = 'Renders all ansi styles to check if the terminal supports colors or not'
exports.gather = function (context, callback) {
  var chalk = require('chalk')
  var ansi = require('ansi-styles')
  var ansi256 = require('ansi-256-colors')
  var color = require('color')

  function fill (name, width) {
    return name + new Array(width - name.length + 1).join(' ')
  }

  function map256 () {
    var chalk = require('chalk')

    var result = '\n256-color palette\n[fg]             [bg]             [bg+inv]         [bg+txt]         [black+fg]       [fg+white]\n'

    var size = []
    var cnt = 0
    var y
    while (cnt < 16) size.push(cnt++)

    for (var z = 0; z < 6; ++z) {
      for (var x = 0; x < 16; ++x) {
        result += x.toString(16)
      }
      result += ' '
    }
    result += '\n'
    for (cnt = 0, y = 0; y < 16; ++y) {
      result += size.reduce(function (line, offset) {
        return line + ansi256.fg.codes[cnt + offset] + 'X' + ansi256.reset
      }, '') +
      ' ' +
      size.reduce(function (line, offset) {
        return line + ansi256.bg.codes[cnt + offset] + ' ' + ansi256.reset
      }, '') +
      ' ' +
      size.reduce(function (line, offset) {
        return line + chalk.inverse(ansi256.bg.codes[cnt + offset] + 'X' + ansi256.reset)
      }, '') +
      ' ' +
      size.reduce(function (line, offset) {
        return line + ansi256.bg.codes[cnt + offset] + 'X' + ansi256.reset
      }, '') +
      ' ' +
      size.reduce(function (line, offset) {
        return line + chalk.bgBlack(ansi256.fg.codes[cnt + offset] + 'X' + ansi256.reset)
      }, '') +
      ' ' + size.reduce(function (line, offset) {
        return line + ansi256.bg.codes[cnt + offset] + chalk.white('X') + ansi256.reset
      }, '') +
      ' ' + y.toString(16) + '\n'
      cnt += size.length
    }
    return result
  }

  var col16m = function (style, r, g, b, txt) {
    txt = '\x1b[' + ((style & 1) === 1 ? '48' : '38') + ';2;' + r + ';' + g + ';' + b + 'm' + txt
    if ((style & 2) === 2) {
      txt = '\u001b[7m' + txt
    }
    txt += ansi256.reset
    return txt
  }

  var gradient16m = function (bg, start, end, size) {
    var diff = {
      h: (end.h - start.h) / size,
      s: (end.s - start.s) / size,
      v: (end.v - start.v) / size
    }
    var result = ''
    for (var i = 0; i < size; ++i) {
      var hsv = {
        h: (start.h + diff.h * i),
        s: (start.s + diff.s * i),
        v: (start.v + diff.v * i)
      }
      var col = color(hsv)
      result += col16m(
        bg,
        col.red() | 0,
        col.green() | 0,
        col.blue() | 0,
        'X'
      )
    }
    return result
  }

  var colorBlock = function (bg, width, height) {
    var result = ''
    height = height / 2
    var col, y, x
    for (y = 0; y < height; ++y) {
      for (x = 0; x < width; ++x) {
        col = color({
          h: 360 / width * x,
          s: 10 + 80 / height * y,
          v: 100
        })
        result += col16m(
          bg,
          col.red() | 0,
          col.green() | 0,
          col.blue() | 0,
          'X'
        )
      }
      result += '\n'
    }
    for (y = 0; y < height; ++y) {
      for (x = 0; x < width; ++x) {
        col = color({
          h: 360 / width * x,
          s: 100,
          v: 100 - (10 + 80 / height * y)
        })
        result += col16m(
          bg,
          col.red() | 0,
          col.green() | 0,
          col.blue() | 0,
          'X'
        )
      }
      result += '\n'
    }
    return result
  }

  function colorPalette (bg) {
    var size = 33
    var halfA = 17
    var halfB = 16
    var result = '' +
      gradient16m(bg, {h: 0, s: 0, v: 0}, {h: 0, s: 100, v: 100}, size) + '\n' +
      gradient16m(bg, {h: 120, s: 0, v: 0}, {h: 120, s: 100, v: 100}, size) + '\n' +
      gradient16m(bg, {h: 240, s: 0, v: 0}, {h: 240, s: 100, v: 100}, size) + '\n' +
      gradient16m(bg, {h: 180, s: 0, v: 0}, {h: 180, s: 100, v: 100}, size) + '\n' +
      gradient16m(bg, {h: 310, s: 0, v: 0}, {h: 310, s: 100, v: 100}, size) + '\n' +
      gradient16m(bg, {h: 55, s: 0, v: 0}, {h: 55, s: 100, v: 100}, size) + '\n' +
      gradient16m(bg, {h: 55, s: 0, v: 0}, {h: 55, s: 0, v: 100}, size) + '\n' +
      gradient16m(bg, {h: 30, s: 0, v: 0}, {h: 30, s: 100, v: 100}, halfA) + gradient16m(bg, {h: 90, s: 0, v: 0}, {h: 90, s: 100, v: 100}, halfB) + '\n' +
      gradient16m(bg, {h: 330, s: 0, v: 0}, {h: 330, s: 100, v: 100}, halfA) + gradient16m(bg, {h: 150, s: 0, v: 0}, {h: 150, s: 100, v: 100}, halfB) + '\n' +
      gradient16m(bg, {h: 270, s: 0, v: 0}, {h: 270, s: 100, v: 100}, halfA) + gradient16m(bg, {h: 210, s: 0, v: 0}, {h: 210, s: 100, v: 100}, halfB) + '\n' +
      colorBlock(bg, size, 8)
    return result
  }

  function map16m () {
    var palA = colorPalette(0).split('\n')
    var palB = colorPalette(1).split('\n')
    var palC = colorPalette(3).split('\n')
    return palA.reduce(function (result, a, nr) {
      return result + a + ' ' + palB[nr] + ' ' + palC[nr] + '\n'
    }, '\ntrue color palette:\n[fg]                              [bg+txt]                          [bg+inv]\n')
  }

  var widest = Object.keys(ansi.colors).reduce(function (widest, name) {
    return Math.max(widest, name.length)
  }, 0)

  widest = Object.keys(ansi.bgColors).reduce(function (widest, name) {
    return Math.max(widest, name.length)
  }, widest)

  var bgFg = [ansi.colors, ansi.bgColors].reduce(function (result, list) {
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
  }, []).join('\n') + '\n'

  var select = '\nSelect combinations: \n' +
    ' - white on white: ' + chalk.white.bgWhite(' white \u2588 ') + '\n' +
    ' - red on red: ' + chalk.red.bgRed(' red \u2588 ') + '\n' +
    ' - black on black: ' + chalk.black.bgBlack(' black \u2588 ') + '\n' +
    ' - italic,underlined,strikethrough red on blue: ' + chalk.red.bgBlue.italic.underline.strikethrough(' red on blue \u2588 ') + '\n' +
    ' - dim,bold blue on green: ' + chalk.dim.bold.blue.bgGreen(' blue on green \u2588 ') + '\n' +
    ' - dim white on yellow: ' + chalk.inverse.dim.white.bgYellow(' white on yellow \u2588 ') + '\n' +
    ' - inverse,dim white on yellow: ' + chalk.inverse.dim.white.bgYellow(' white on yellow \u2588 ')

  callback(null, {
    string: bgFg + map256() + map16m() + select
  })
}
