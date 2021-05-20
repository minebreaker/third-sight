import { DateTime } from "luxon"
import _ from "lodash"


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

  // Some sites do clumsy state replacement and may send onComplete events multiple times.
  const previousTab = _.last( store[tab.id] )
  if ( previousTab && previousTab.tab.url === tab.url && previousTab.tab.title === tab.title ) {
    console.debug( "duplicated entry" )
    return
  }

  // Tab id nullability should checked by content script
  store[tab.id] = [ ...(store[tab.id] || []), {
    tab,
    timestamp: DateTime.now().toMillis(),
    objectUrl
  } ]
}

export function load( tabId: number ): History[] {
  return store[tabId] || []
}
