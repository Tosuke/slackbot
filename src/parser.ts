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

;(a =>
  a
    .toString()
    .split('')
    .map(
      b =>
        [
          ':zero:',
          ':one:',
          ':two:',
          ':three:',
          ':four:',
          ':five:',
          ':six:',
          ':seven:',
          ':eight:',
          ':nine:',
        ][eval(b)]
    )
    .join(''))(5000) + ':yen_::hosi::ii:'

const arg = seq(
  regex(/\s*/),
  alt(
    alt(
      str,
      seq(string('`'), regex(/((\\.)|([^`]))*/), string('`')).map(a =>
        a.join('')
      )
    ).map(a => a.slice(1, a.length - 1)),
    regex(/[^\s]+/)
  ),
  regex(/\s*/)
).map(a => a[1])

const parser = seq(command, regex(/:\s+/), arg.many()).map(a => ({
  func: a[0],
  args: a[2],
}))

import { Command } from './command'

export default function parse(text: string): Command | null {
  const parsed = parser.parse(text)
  if (parsed.status) {
    const value = parsed.value
    if (tryParse('f' + value.func.param)) {
      const len = value.func.name.length + value.func.param.length
      value.func.param = value.func.param === '' ? '()' : value.func.param
      return { ...value, argRaw: text.slice(len + 1, text.length) }
    } else {
      return null
    }
  } else {
    return null
  }
}

function tryParse(text: string): boolean {
  try {
    acorn.parse(text)
    return true
  } catch (e) {
    return false
  }
}
