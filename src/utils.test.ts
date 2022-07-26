import { toChars, isAtom, isList, head, tail } from "./utils"
import * as types from './types/global'

describe('toChars', () => {
  test('should return an array of chars from a given string', () => {
    const expected = ['a','b','c','d']
    const actual = toChars('abcd')

    expect(actual).toEqual(expected)
  })
})

describe('isAtom', () => {
  it('should return expected boolean for isAtom test', async () => {
    [
      { arg: <List>{ items: [] }, expected: false },
      { arg: <Atom<string>>{ value: '+' }, expected: true },
      { arg: <Atom<number>>{ value: 2 }, expected: true },
    ].forEach(scenario => {
      expect(isAtom(scenario.arg)).toBe(scenario.expected)
    })
  })
})

describe('isList', () => {
  it('should return expected boolean for isList test', async () => {
    [
      { arg: <Atom<string>>{ value: '+' }, expected: false },
      { arg: <Atom<number>>{ value: 2 }, expected: false },
      { arg: <List>{ items: [] }, expected: true },
    ].forEach(scenario => {
      expect(isList(scenario.arg)).toBe(scenario.expected)
    })
  })
})

describe('head', () => {
  it('should throw Error if list is empty', async () => {
    expect(() => head(<List>{ items: [] })).toThrow()
  })

  it('should return the first element of a List', async () => {
    [
      { arg: <List>{ items: [
        <Atom<string>>{ value: '+' },
        <Atom<number>>{ value: 1 },
        <Atom<number>>{ value: 2 },
      ] }, expected: <Atom<string>>{ value: '+' } },
      { arg: <List>{ items: [
        <Atom<number>>{ value: 1 },
        <Atom<number>>{ value: 2 },
        <Atom<number>>{ value: 3 },
      ] }, expected: <Atom<number>>{ value: 1 } },
    ].forEach(scenario => {
      expect(head(scenario.arg)).toEqual(scenario.expected)
    })
  })
})

describe('tail', () => {
  it('should throw Error if list is empty', async () => {
    expect(() => tail(<List>{ items: [] })).toThrow()
  })

  it('should return the rest of a list, removing the head', async () => {
    [
      {
        arg: <List>{
          items: [
            <Atom<string>>{ value: '+' },
            <Atom<number>>{ value: 1 },
            <Atom<number>>{ value: 2 },
          ]
        },
        expected: <List>{
          items: [
            <Atom<number>>{ value: 1 },
            <Atom<number>>{ value: 2 },
          ]
        },
      },
      {
        arg: <List>{
          items: [
            <Atom<string>>{ value: '+' },
            <Atom<number>>{ value: 1 },
            <Atom<number>>{ value: 2 },
            <Atom<number>>{ value: 3 },
            <Atom<number>>{ value: 4 },
          ]
        },
        expected: <List>{
          items: [
            <Atom<number>>{ value: 1 },
            <Atom<number>>{ value: 2 },
            <Atom<number>>{ value: 3 },
            <Atom<number>>{ value: 4 },
          ]
        },
      }
    ].forEach(scenario => {
      expect(tail(scenario.arg)).toEqual(scenario.expected)
    })
  })
})
