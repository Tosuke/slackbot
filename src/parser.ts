import { alt, seq, regex, string, lazy } from 'parsimmon'
import * as babylon from 'babylon'

const str = alt(
  seq(string('"'), regex(/((\\.)|([^"]))*/), string('"')),
  seq(string("'"), regex(/((\\.)|([^']))*/), string("'"))
).map(a => a.join(''))

const expr = lazy(() =>
  alt(
    seq(string('('), expr, string(')')).map(a => a.join('')),
    seq(string('{'), expr, string('}')).map(a => a.join('')),

    str,

    seq(
      string('`'),
      alt(
        seq(string('${'), expr, string('}')).map(a => a.join('')),
        regex(/((\\.)|(\$[^`{])|([^\$`]))+/)
      )
        .many()
        .map(a => a.join('')),
      string('`')
    ).map(a => a.join('')),

    regex(/[^(){}'"]+/)
  )
    .many()
    .map(a => a.join())
)

const command = alt(
  seq(
    regex(/^[^:(\s]+/),
    string('('),
    expr,
    string(')')
  ).map(([name, ...rest]) => ({
    name,
    param: rest.join(''),
  })),
  regex(/^[^:(\s]+/).map(name => ({
    name,
    param: '',
  }))
)

const parser = seq(command, regex(/:\s*/), regex(/.*/)).map(a => ({
  func: a[0],
  arg: a[2].trim(),
}))

import { Command } from './command'

export default function parse(text: string): Command | null {
  const parsed = parser.parse(text)
  if (parsed.status) {
    const value = parsed.value
    if (tryParseExpression('f' + value.func.param)) {
      return value
    } else {
      return null
    }
  } else {
    return null
  }
}

export function parseJsProgram(code: string): any {
  return babylon.parse(code, {
    allowReturnOutsideFunction: true,
    plugins: ['objectRestSpread'],
  })
}

export function parseJsExpression(code: string): any {
  return babylon.parseExpression(code, {
    plugins: ['objectRestSpread'],
  })
}

export function tryParseProgram(code: string): boolean {
  try {
    parseJsProgram(code)
    return true
  } catch (e) {
    return false
  }
}

export function tryParseExpression(code: string): boolean {
  try {
    parseJsExpression(code)
    return true
  } catch (e) {
    return false
  }
}
