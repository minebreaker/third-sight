import { DateTime } from "luxon"
import _ from "lodash"


declare const browser: any  // FIXME

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

export async function cleanUp() {
  // Sessions can be restored after closed.
  // If we discard the histories immediately, the restored sessions cannot access to it.
  // Since no callback for session forgetting is provided,
  // we use timeout moratorium to possibly recover the histories.

  console.debug( "cleanup requested" )
  const closedTab = await browser.sessions.getRecentlyClosed( { maxResults: 1 } )
  const tabId = closedTab[0].id

  setTimeout( async () => {
    console.log( "executing cleanup" )
    const closedSessions: any[] = await browser.sessions.getRecentlyClosed()
    if ( _.find( closedSessions, s => s.tab?.id === tabId ) ) {
      // If the tab is still closed after the timeout, remove histories
      delete store[tabId]
    }
  }, 60 * 1000 )
}
