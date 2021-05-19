import { DateTime } from "luxon"


// TODO: Apparently this code leaks memory. Need clean up
type Store = {
  [tabId: number]: History[]
}

type History = {
  tab: any,
  timestamp: DateTime,
  objectUrl: string
}

const store: Store = {}

export function debug() {
  console.debug( store )
}

export function save( tab: any, objectUrl: string ) {
  // Tab id nullability should checked by content script
  store[tab.id!] = [ {
    tab,
    timestamp: DateTime.now(),
    objectUrl
  } ]
}

export function load( tabId: number ): History[] {
  return store[tabId] || []
}
