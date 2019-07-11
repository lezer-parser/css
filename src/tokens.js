/* Hand-written tokenizers for CSS tokens that can't be
   expressed by Lezer's built-in tokenizer. */

import {ExternalTokenizer} from "lezer"
import {Callee, PropertyName, identifier, noSpace} from "./parser.terms.js"

const space = [9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197,
               8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288]
const colon = 58, parenL = 40, dash = 45

function isIdentifierChar(ch) {
  return ch === 45 || ch === 95 || (ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || ch >= 161
}

export const identifiers = new ExternalTokenizer((input, token) => {
  let start = token.start, pos = start
  for (;;) {
    let next = input.get(pos)
    if (isIdentifierChar(input.get(pos))) {
      pos++
      continue
    }
    if (pos > start && !(pos == start + 1 && input.get(pos - 1) == dash)) {
      if (next == parenL) {
        token.accept(Callee, pos)
      } else {
        let end = pos
        while (space.includes(next)) next = input.get(++pos)
        token.accept(next == colon ? PropertyName : identifier, end)
      }
    }
    break
  }
})

export const checkSpace = new ExternalTokenizer((input, token) => {
  if (!space.includes(input.get(token.start - 1))) token.accept(noSpace, token.start)
})
