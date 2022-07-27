import { head, isAtom, isList, tail } from "./utils"

function add(a: Atom<number>, b: Atom<number>): Atom<number> {
  return <Atom<number>>{ value: a.value + b.value }
}

function sub(a: Atom<number>, b: Atom<number>): Atom<number> {
  return <Atom<number>>{ value: a.value - b.value }
}

function mul(a: Atom<number>, b: Atom<number>): Atom<number> {
  return <Atom<number>>{ value: a.value * b.value }
}

function div(a: Atom<number>, b: Atom<number>): Atom<number> {
  return <Atom<number>>{ value: a.value / b.value }
}

function eq(a: AtomType, b: AtomType): Atom<boolean> {
  return <Atom<boolean>>{ value: a.value === b.value }
}

// TODO: Remove
function noteq(a: AtomType, b: AtomType): Atom<boolean> {
  return <Atom<boolean>>{ value: a.value !== b.value }
}

function gt(a: AtomType, b: AtomType): Atom<boolean> {
  return <Atom<boolean>>{ value: a.value > b.value }
}

function gte(a: AtomType, b: AtomType): Atom<boolean> {
  return <Atom<boolean>>{ value: a.value >= b.value }
}

function lt(a: AtomType, b: AtomType): Atom<boolean> {
  return <Atom<boolean>>{ value: a.value < b.value }
}

function lte(a: AtomType, b: AtomType): Atom<boolean> {
  return <Atom<boolean>>{ value: a.value <= b.value }
}

function and(list: List): Atom<boolean> {
  let result = true
  for (let i = 0, len = list.items.length; i < len; i++) {
    if (evaluate(list.items[i]).value === false) {
      result = false
      break
    }
  }
  return <Atom<boolean>>{ value: result }
}

function or(list: List): Atom<boolean> {
  let result = false
  for (let i = 0, len = list.items.length; i < len; i++) {
    if (evaluate(list.items[i]).value !== false) {
      result = true
      break
    }
  }

  return <Atom<boolean>>{ value: result }
}

function not(args: AtomType): Atom<boolean> {
  return <Atom<boolean>>{ value: !args.value }
}

function doIf(list: List) {
  const condition = list.items[0]
  const first = list.items[1]
  const second = list.items[2]

  if (evaluate(condition).value) {
    return evaluate(first)
  } else {
    // Returns false if condition is false and no "else" is provided
    return second ? evaluate(second) : <Atom<boolean>>{ value: false }
  }
}

// Known arithmetic operators
const stdLibOperators: OperatorMap = {
  '+': add,
  '-': sub,
  '*': mul,
  '/': div,
}

function doArithmeticFunction(first: Atom<string>, rest: List) {
  const evaluatedArgs = rest.items.map(e => evaluate(e))
  if (evaluatedArgs.length < 2) {
    throw new Error(`Not enough arguments to ${first.value} function`)
  }
  const fn = stdLibOperators[first.value]
  const firstArg = <Atom<number>>evaluatedArgs[0]
  const args = evaluatedArgs.slice(1)
  return args
    .reduce((acc, arg) => {
      return fn(<Atom<number>>acc, <Atom<number>>arg)
    },
    firstArg)
}

const stdLibComparisons: ComparisonMap = {
  'eq': eq,
  '==': eq,
  // TODO: Remove
  'noteq': noteq,
  // TODO: Remove
  '!=': noteq,
  '>': gt,
  'gt': gt,
  '>=': gte,
  'gte': gte,
  '<': lt,
  'lt': lt,
  '<=': lte,
  'lte': lte,
}

function doComparisonFunction(first: Atom<string>, rest: List): Atom<boolean> {
  if (rest.items.length !== 2) {
    throw new Error(`Not enough arguments to ${first.value} comparison function`)
  }
  const [a, b] = rest.items
  const fn = stdLibComparisons[first.value]
  return fn(evaluate(a), evaluate(b))
}

const stdLibLogicalAtomOperators: LogicalAtomMap = {
  'not': not,
}

function doLogicalAtomOperatorFunction(first: Atom<string>, rest: List): Atom<boolean> {
  if (rest.items.length !== 1) {
    throw new Error(`Too many arguments for ${first.value} function. Expected only 1`)
  }
  const fn = stdLibLogicalAtomOperators[first.value]
  const arg = rest.items[0]
  const result = evaluate(arg)
  return fn(result as Atom<boolean>)
}

const stdLibLogicalListOperators: LogicalListMap = {
  '&&': and,
  'and': and,
  '||': or,
  'or': or,
}

function doLogicalListOperatorFunction(first: Atom<string>, rest: List): Atom<boolean> {
  if (rest.items.length < 1) {
    throw new Error(`Not enough arguments for ${first.value} function. Expected at least 1`)
  }
  const fn = stdLibLogicalListOperators[first.value]
  return fn(rest)
}

const stdLibConditionalFunction: ConditionalMap = {
  'if': doIf,
}

function doConditionalFunction(first: Atom<string>, rest: List) {
  // Must have at least a single branch: (if t (+ 1 1))
  if (rest.items.length < 2) {
    throw new Error(`Nothing to evaluate after "${first.value}" condition. Expected at least 1 expression`)
  }
  // Doesn't allow more than 2 branches: (if t (+ 1 1) (+ 2 2))
  if (rest.items.length > 3) {
    throw new Error(`Too many expressions after "${first.value}" condition. Expected 2 maximum`)
  }

  const fn = stdLibConditionalFunction[first.value]
  return fn(rest)
}

function doFunctionDefinition(first: Atom<string>, rest: List) {
  if (rest.items.length < 2) {
    throw new Error(`Not enough arguments to "${first.value}" function call`)
  }

  return <Atom<boolean>>{ value: true }
}

export function evaluate(expression: AtomType | List): AtomType {
  if (isAtom(expression)) {
    return expression
  } else if (isList(expression)) {
    const first = <Atom<string>>head(expression)
    const rest = tail(expression)
    if (first.value in stdLibOperators) {
      return doArithmeticFunction(first, rest)
    }
    if (first.value in stdLibComparisons) {
      return doComparisonFunction(first, rest)
    }
    if (first.value in stdLibLogicalAtomOperators) {
      return doLogicalAtomOperatorFunction(first, rest)
    }
    if (first.value in stdLibLogicalListOperators) {
      return doLogicalListOperatorFunction(first, rest)
    }
    // TODO: Make this into a macro
    if (first.value === 'if') {
      return doConditionalFunction(first, rest)
    }
    if (first.value === 'defun') {
      return doFunctionDefinition(first, rest)
    }
  }
  throw new Error(`Unknown expression error ${expression}`)
}
