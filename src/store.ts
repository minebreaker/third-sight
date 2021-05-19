import { DateTime } from "luxon"


// TODO: Apparently this code leaks memory. Need clean up
export type Store = {
  [tabId: number]: History[]
}

export type History = {
  tab: any,
  timestamp: number,
  objectUrl: string
}

const store: Store = {}

export function debug() {
  console.debug( store )
}

export function save( tab: any, objectUrl: string ) {
  // Tab id nullability should checked by content script
  store[tab.id!] = [ ...(store[tab.id!] || []), {
    tab,
    timestamp: DateTime.now().toMillis(),
    objectUrl
  } ]
}

export function load( tabId: number ): History[] {
  return store[tabId] || []
}
