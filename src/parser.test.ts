import { parseList, parseAtom } from './parser'
import * as types from './types/global'

describe('pareAtom', () => {
  test('should return an Atom given input', () => {
    [
      { expected: <Atom<number>>{ value: 42 }, actual: parseAtom('42')},
      { expected: <Atom<string>>{ value: 'foo' }, actual: parseAtom('foo')},
    ].forEach(scenario => {
      expect((scenario.actual)).toEqual(scenario.expected)
    })
  })

  test('should throw error when given unexpected input', () => {
    const actual = () => parseAtom('')
    expect(actual).toThrow()
  })
})

describe('parseList', () => {
  test('should throw error when given unexpected input', () => {
    const actual = () => parseList('')
    expect(actual).toThrow()
  })

  test('should throw if input start and end is invalid', () => {
    const input1 = ' 1 2)'
    const input2 = '(1 2 '

    const actual1 = () => parseList(input1)
    expect(actual1).toThrow()

    const actual2 = () => parseList(input2)
    expect(actual2).toThrow()
  })

  test('should return an empty list when "()" is given', () => {
    const expected = <List>{ items: [] }
    const actual = parseList('()')

    expect(actual).toEqual(expected)
  })

  test('should return a List with one number atom', () => {
    const expected = <List>{ items: [<Atom<number>>{ value: 1 }] }
    const actual = parseList('(1)')

    expect(actual).toEqual(expected)
  })

  test('should return a List with two Atoms', () => {
    const expected = <List>{
      items: [<Atom<number>>{ value: 1 }, <Atom<string>>{ value: 'A' }]
    }
    const actual = parseList('(1 A)')

    expect(actual).toEqual(expected)
  })

  test('should return a List with an Atom, a List of Atoms and an empty list', () => {
    const expected = <List>{
      items: [
        <Atom<string>>{ value: 'A' },
        <List>{ items: [<Atom<number>>{ value: 1 }, <Atom<number>>{ value: 2 }] },
        <List>{ items: [] },
      ],
    }
    const actual = parseList('(A (1 2) ())')

    expect(actual).toEqual(expected)
  })

  test('should return a List when given a symbol and numeric atoms', () => {
    const expected = <List>{
      items: [
        <Atom<string>>{ value: 'add' },
        <Atom<number>>{ value: 1 },
        <Atom<number>>{ value: 2 },
      ],
    }
    const actual = parseList('(add 1 2)')

    expect(actual).toEqual(expected)
  })

  test('should return a nested List of arithmetic expressions', () => {
    const expected = <List>{
      items: [
        <Atom<string>>{ value: '+' },
        <Atom<number>>{ value: 1 },
        <Atom<number>>{ value: 2 },
        <List>{
          items: [
            <Atom<string>>{ value: '*' },
            <Atom<number>>{ value: 3 },
            <Atom<number>>{ value: 4 },
          ]
        },
      ]
    }

    const actual = parseList('(+ 1 2 (* 3 4))')

    expect(actual).toEqual(expected)
  })

  test('should create a deep nested list given a string of arithmetic...', async () => {
    const expected = <List>{
      items: [
        <List>{
          items: [
            <List>{
              items: [
                <Atom<string>>{ value: '+' },
                <Atom<number>>{ value: 1 },
                <Atom<number>>{ value: 2 },
              ]
            }
          ]
        }
      ]
    }
    const actual = parseList('(((+ 1 2)))')

    expect(actual).toEqual(expected)
  })
})
