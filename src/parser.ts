/*
Parser/Lexer
Takes the string input, creating an AST of the code.
An atom is a basic unit in Lisp
*/

import { toChars } from "./utils"

export function parseAtom(s: string): AtomType {
  const atom: any = s.trim()
  if (!s) throw new Error('Invalid symbol')

  if (isNaN(atom)) {
    if (atom.toLowerCase() === 'true') {
      return <Atom<boolean>>{ value: true }
    }
    if (atom.toLowerCase() === 'nil') {
      return <Atom<boolean>>{ value: false }
    }
    return <Atom<string>>{ value: atom }
   } else {
    return <Atom<number>>{ value: Number(atom) }
   }
  }

const listStartDelimeter = '('
const listEndDelimeter = ')'
const listItemDelimeter = ' '

function parseListFromParens(chars: string[], index: number): [List, number] {
  let result = <List>{ items: [] }
  const len = chars.length
  let idx = index
  let atomStartPos = -1 // Tracking atoms

  const addAtom = () => {
    if (atomStartPos != -1) {
      const term = chars.slice(atomStartPos, idx)
      result.items.push(parseAtom(term.join('')))
    }
  }

  while (idx < len) {
    // When closing list found, return the result (could be within recursive parse sweep)
    if (chars[idx] === listEndDelimeter) {
      addAtom()
      return [result, idx + 1]
    }
    // When new list found, parse recursively
    if (chars[idx] === listStartDelimeter) {
      const [res, j] = parseListFromParens(chars, idx + 1)
      idx = j
      result.items.push(res)
      continue
    }

    if (chars[idx] === listItemDelimeter) {
      // End of a Atom
      addAtom()
      atomStartPos = -1
    } else {
      if (atomStartPos === -1) {
        // Start of a Atom
        atomStartPos = idx
      }
    }
    idx++
  }
  return [result, idx]
}

export function parseList(str: string): List {
  if (!str) throw new Error('Expected a stringified list')

  if (str.charAt(0) !== listStartDelimeter) throw new Error(`List should start with "${listStartDelimeter}"`)
  if (str.charAt(str.length-1) !== listEndDelimeter) throw new Error(`List should end with "${listEndDelimeter}"`)

  const chars = toChars(str.trim())

  const [list, pos] = parseListFromParens(chars, 0)

  return <List>list.items[0]
}
