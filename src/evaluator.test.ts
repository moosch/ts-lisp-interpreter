import { parseList } from "./parser"
import { evaluate } from "./evaluator"
import * as types from './types/global'

describe('stdLib operators', () => {
  it('should throw when unknown arithmetic operator is used', async () => {
    const expression = parseList('(! 1 3 4)')

    expect(() => evaluate(expression)).toThrow()
  })

  it('should throw when not enough arguments are passed to arithmetic function', async () => {
    const expression = parseList('(+ 1)')

    expect(() => evaluate(expression)).toThrow()
  })

  test('should evaluate a "+" expression correctly', async () => {
    const expression = parseList('(+ 1 2)')
    const expected = <Atom<number>>{ value: 3 }
    const actual = evaluate(expression)

    expect(actual).toEqual(expected)
  })

  test('should evaluate a "-" expression correctly', async () => {
    const expression = parseList('(- 2 1)')
    const expected = <Atom<number>>{ value: 1 }
    const actual = evaluate(expression)

    expect(actual).toEqual(expected)
  })

  test('should evaluate a "*" expression correctly', async () => {
    const expression = parseList('(* 2 2)')
    const expected = <Atom<number>>{ value: 4 }
    const actual = evaluate(expression)

    expect(actual).toEqual(expected)
  })

  test('should evaluate a "/" expression correctly', async () => {
    const expression = parseList('(/ 4 2)')
    const expected = <Atom<number>>{ value: 2 }
    const actual = evaluate(expression)

    expect(actual).toEqual(expected)
  })

  test('should evaluate a "+" expression with more than 2 args correctly', async () => {
    const expression = parseList('(+ 1 2 3 4)')
    const expected = <Atom<number>>{ value: 10 }
    const actual = evaluate(expression)

    expect(actual).toEqual(expected)
  })

  test('should evaluate an arithmetic expression with nested arithmetic operations correctly', async () => {
    [
      {
        expression: '(+ 1 (+ 1 (+ 2 2)))',
        expected: <Atom<number>>{ value: 6 },
      },
      {
        expression: '(/ 4 (* 1 (+ 1 (- 2 1))))',
        expected: <Atom<number>>{ value: 2 },
      },
      {
        expression: '(/ 4 (* 1 (+ 1 (- 2 1))) 2)',
        expected: <Atom<number>>{ value: 1},
      },
    ].forEach(scenario => {
      const expression = parseList(scenario.expression)
      const actual = evaluate(expression)

      expect(actual).toEqual(scenario.expected)
    })
  })
})

describe('stdLib comparisons', () => {
  describe('==', () => {
    it('should throw if comparison operator "==" is not given 2 arguments', async () => {
      expect(() => evaluate(parseList('(==)'))).toThrow()
      expect(() => evaluate(parseList('(== 1)'))).toThrow()
    })

    it('should successfully run comparison operator "==" when given 2 equal numeric arguments', async () => {
      const actual = evaluate(parseList('(== 1 1)'))
      expect(actual.value).toEqual(true)
    })

    it('should successfully run comparison operator "==" when given 2 unequal numeric arguments', async () => {
      const actual = evaluate(parseList('(== 1 2)'))
      expect(actual.value).toEqual(false)
    })
  })

  describe('eq', () => {
    it('should throw if comparison operator "eq" is not given 2 arguments', async () => {
      expect(() => evaluate(parseList('(eq)'))).toThrow()
      expect(() => evaluate(parseList('(eq 1)'))).toThrow()
    })

    it('should successfully run comparison operator "eq" when given 2 equal numeric arguments', async () => {
      const actual = evaluate(parseList('(eq 1 1)'))
      expect(actual.value).toEqual(true)
    })

    it('should successfully run comparison operator "eq" when given 2 unequal numeric arguments', async () => {
      const actual = evaluate(parseList('(eq 1 2)'))
      expect(actual.value).toEqual(false)
    })
  })

  describe('noteq | !=', () => {
    it('should throw if comparison operator "noteq" is not given 2 arguments', async () => {
      expect(() => evaluate(parseList('(noteq)'))).toThrow()
      expect(() => evaluate(parseList('(noteq 1)'))).toThrow()
    })

    it('should successfully run comparison operator "noteq" when given 2 arguments', async () => {
      [
        { expression: '(noteq 1 2)', expected: true },
        { expression: '(!= 1 2)', expected: true },
        { expression: '(noteq a b)', expected: true },
        { expression: '(!= a b)', expected: true },
        { expression: '(noteq 1 1)', expected: false },
        { expression: '(!= 1 1)', expected: false },
        { expression: '(noteq a a)', expected: false },
        { expression: '(!= a a)', expected: false },
      ].forEach(scenario => {
        const actual = evaluate(parseList(scenario.expression))
        expect(actual.value).toEqual(scenario.expected)
      })
    })
  })

  describe('gt | >', () => {
    it('should throw if comparison operator "gt" or ">" is not given 2 arguments', async () => {
      expect(() => evaluate(parseList('(gt)'))).toThrow()
      expect(() => evaluate(parseList('(gt 1)'))).toThrow()
      expect(() => evaluate(parseList('(>)'))).toThrow()
      expect(() => evaluate(parseList('(> 1)'))).toThrow()
    })

    it('should successfully run comparison operator "gt" or ">" when given 2 numeric arguments', async () => {
      [
        { expression: '(gt 2 1)', expected: true },
        { expression: '(> 2 1)', expected: true },
        { expression: '(gt 1 2)', expected: false },
        { expression: '(> 1 2)', expected: false },
      ].forEach(scenario => {
        const actual = evaluate(parseList(scenario.expression))
        expect(actual.value).toEqual(scenario.expected)
      })
    })
  })

  describe('gte | >=', () => {
    it('should throw if comparison operator "gte" or ">=" is not given 2 arguments', async () => {
      expect(() => evaluate(parseList('(gte)'))).toThrow()
      expect(() => evaluate(parseList('(gte 1)'))).toThrow()
      expect(() => evaluate(parseList('(>=)'))).toThrow()
      expect(() => evaluate(parseList('(>= 1)'))).toThrow()
    })

    it('should successfully run comparison operator "gte" or ">=" when given 2 arguments', async () => {
      [
        { expression: '(gte 2 1)', expected: true },
        { expression: '(gte 2 2)', expected: true },
        { expression: '(>= 2 1)', expected: true },
        { expression: '(>= 2 2)', expected: true },
        { expression: '(gte 1 2)', expected: false },
        { expression: '(>= 1 2)', expected: false },
      ].forEach(scenario => {
        const actual = evaluate(parseList(scenario.expression))
        expect(actual.value).toEqual(scenario.expected)
      })
    })
  })

  describe('lt | <', () => {
    it('should throw if comparison operator "lt" or "<" is not given 2 arguments', async () => {
      expect(() => evaluate(parseList('(lt)'))).toThrow()
      expect(() => evaluate(parseList('(lt 1)'))).toThrow()
      expect(() => evaluate(parseList('(<)'))).toThrow()
      expect(() => evaluate(parseList('(< 1)'))).toThrow()
    })

    it('should successfully run comparison operator "lt" or "<" when given 2 arguments', async () => {
      [
        { expression: '(lt 1 2)', expected: true },
        { expression: '(< 1 2)', expected: true },
        { expression: '(lt 2 1)', expected: false },
        { expression: '(< 2 1)', expected: false },
        { expression: '(< 2 2)', expected: false },
      ].forEach(scenario => {
        const actual = evaluate(parseList(scenario.expression))
        expect(actual.value).toEqual(scenario.expected)
      })
    })
  })

  describe('lte | <=', () => {
    it('should throw if comparison operator "lte" or "<=" is not given 2 arguments', async () => {
      expect(() => evaluate(parseList('(lte)'))).toThrow()
      expect(() => evaluate(parseList('(lte 1)'))).toThrow()
      expect(() => evaluate(parseList('(<=)'))).toThrow()
      expect(() => evaluate(parseList('(<= 1)'))).toThrow()
    })

    it('should successfully run comparison operator "lte" or "<=" when given 2 arguments', async () => {
      [
        { expression: '(lte 1 2)', expected: true },
        { expression: '(<= 1 2)', expected: true },
        { expression: '(lte 1 1)', expected: true },
        { expression: '(<= 1 1)', expected: true },
        { expression: '(<= 2 1)', expected: false },
        { expression: '(<= 2 1)', expected: false },
      ].forEach(scenario => {
        const actual = evaluate(parseList(scenario.expression))
        expect(actual.value).toEqual(scenario.expected)
      })
    })
  })
})

describe('stdLib logical operations', () => {
  describe('and', () => {
    it('should throw when no arguments are given', async () => {
      const expression = parseList('(and)')
      expect(() => evaluate(expression)).toThrow()
    })

    it('should successfully run "and" check when given values', async () => {
      [
        { expression: '(and nil nil ())', expected: false },
        { expression: '(and a nil)', expected: false },
        { expression: '(and a true)', expected: true },
        { expression: '(and a b)', expected: true },
        { expression: '(and (+ 1 1) a)', expected: true },
      ].forEach(scenario => {
        const actual = evaluate(parseList(scenario.expression))
        expect(actual.value).toEqual(scenario.expected)
      })
    })
  })

  describe('or', () => {
    it('should throw when no arguments are given', async () => {
      const expression = parseList('(or)')
      expect(() => evaluate(expression)).toThrow()
    })

    it('should successfully run "or" check when given values', async () => {
      [
        { expression: '(or nil nil)', expected: false },
        // { expression: '(or nil nil ())', expected: false },
        { expression: '(or a nil)', expected: true },
        { expression: '(or a true)', expected: true },
        { expression: '(or a b)', expected: true },
        { expression: '(or (+ 1 1) a)', expected: true },
      ].forEach(scenario => {
        const actual = evaluate(parseList(scenario.expression))
        expect(actual.value).toEqual(scenario.expected)
      })
    })
  })

  describe('not', () => {
    it('should throw when no arguments are given', async () => {
      const expression = parseList('(not)')
      expect(() => evaluate(expression)).toThrow()
    })

    it('should throw when more than 1 argument is given', async () => {
      const expression = parseList('(not (eq 1 1) 1)')
      expect(() => evaluate(expression)).toThrow()
    })

    it('should successfully run "not" check when given a value', async () => {
      [
        { expression: '(not nil)', expected: true },
        // { expression: '(not ())', expected: false },
        { expression: '(not a)', expected: false },
        { expression: '(not true)', expected: false },
        { expression: '(not (+ 1 1))', expected: false },
        { expression: '(not (eq 1 1))', expected: false },
        { expression: '(not (eq 1 2))', expected: true },
      ].forEach(scenario => {
        const actual = evaluate(parseList(scenario.expression))
        expect(actual.value).toEqual(scenario.expected)
      })
    })
  })
})

describe('stdLib conditional functions', () => {
  describe('if', () => {
    it('should throw when unexpected argument lengths are given', async () => {
      [
        '(if)',
        '(if true)',
        '(if nil)',
        '(if nil (+ 1 1) (- 2 1) (eq 1 1))',
      ].forEach(expression => {
        expect(() => evaluate(parseList(expression))).toThrow()
      })
    })

    it('should successfully run "if" condition when given expected arguments', async () => {
      [
        { expression: '(IF nil (+ 1 1))', expected: false },
        { expression: '(IF T (+ 1 1))', expected: 2 },
        { expression: '(if nil (+ 1 1) (eq 1 1))', expected: true },
        { expression: '(if (eq 2 (+ 1 1)) (- 5 3))', expected: 2 },
        { expression: '(if (noteq 2 (+ 1 1)) (- 5 3) (/ 8 2))', expected: 4 },
        { expression: '(if nil (+ 1 1) (- 5 3))', expected: 2 },
        { expression: '(if (+ 1 1) good)', expected: 'good' },
        { expression: '(if (eq 2 1) good bad)', expected: 'bad' },
      ].forEach(scenario => {
        const actual = evaluate(parseList(scenario.expression))
        expect(actual.value).toEqual(scenario.expected)
      })
    })
  })
})

describe('defun', () => {
  it('should throw if "defun" is supplied with less than 2 arguments', async () => {
    [
      '(defun)',
      '(defun testing)',
    ].forEach(expression => {
      expect(() => evaluate(parseList(expression))).toThrow()
    })
  })

  // it('should throw when trying to create a function with a name that already exists', async () => {

  // })

  it('should create a function with the supplied name', async () => {
    [
      { expression: '(defun tester () 2)', args: [], result: 2 },
    ].forEach(scenario => {
      const actual = evaluate(parseList(scenario.expression))
    });
  })
})
