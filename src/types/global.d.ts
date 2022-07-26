export {};

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
  */
  type Nullable = null | undefined

  interface Atom<T> {
    value: T
  }
  type AtomType = Atom<string> | Atom<number> | Atom<boolean>

  // List is a sequence of Atoms or other Lists
  // e.g. (1 2 (3 4) (5 6 (7 8)))
  interface List {
    items: (AtomType | List)[]
  }

  interface OperatorMap {
    [key: string]: (a: Atom<number>, b: Atom<number>) => Atom<number>
  }

  interface ComparisonMap {
    [key: string]: (a: AtomType, b: AtomType) => Atom<boolean>
  }

  interface LogicalListMap {
    [key: string]: (args: List) => Atom<boolean>
  }
  interface LogicalAtomMap {
    [key: string]: (args: AtomType) => Atom<boolean>
  }
}
