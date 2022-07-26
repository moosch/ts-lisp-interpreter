export function toChars(s: string): string[] {
  return Array.from(s)
}

export function isAtom(item: AtomType | List): item is AtomType {
  return item && (item as AtomType).value !== undefined
}

export function isList(item: AtomType | List): item is List {
  return item && (item as List).items !== undefined
}

export function head(list: List): AtomType {
  if (list.items.length == 0) throw new Error('List is empty')
  if (isAtom(list.items[0])) {
    return list.items[0]
  } else {
    throw new Error('Expected an Atom as the List head')
  }
}

export function tail(list: List): List {
  if (list.items.length === 0) throw new Error('List is empty')
  if (list.items.length === 1) throw new Error('List only contains one item')
  return <List>{ items: list.items.slice(1) }
}
