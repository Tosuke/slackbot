import { alt, seq, regex, string, lazy } from 'parsimmon'
import * as acorn from 'acorn'

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
  arg: a[2],
}))

import { Command } from './command'

export default function parse(text: string): Command | null {
  const parsed = parser.parse(text)
  if (parsed.status) {
    const value = parsed.value
    if (tryParse('f' + value.func.param)) {
      return value
    } else {
      return null
    }
  } else {
    return null
  }
}

export function tryParse(text: string): boolean {
  try {
    acorn.parse(text)
    return true
  } catch (e) {
    return false
  }
}
