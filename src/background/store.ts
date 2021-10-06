import { DateTime } from "luxon"
import _ from "lodash"
import { Store } from "../shared/store"


const MAX_COUNT_PER_PAGE = 64
const CLEANUP_TIMEOUT_MILLS = 60 * 1000

const store: Store = {}

export function save( tab: Tab, objectUrl: string ): void {
  if ( !tab.id ) {
    throw new Error()
  }

  // Some sites do clumsy state replacement and may send onComplete events multiple times.
  const previousTab = _.last( store[tab.id] )
  if ( previousTab && previousTab.tab.url === tab.url && previousTab.tab.title === tab.title ) {
    console.debug( "duplicated entry" )
    return
  }

  const newTabs = [ ...(store[tab.id] || []), {
    tab,
    timestamp: DateTime.now().toMillis(),
    objectUrl,
    faviconUrl: tab.favIconUrl
  } ]

  store[tab.id] = _.take( newTabs, MAX_COUNT_PER_PAGE )
}

export function load(): Store {
  return store
}

export async function scheduleCleanUp( tabId: number ): Promise<void> {
  // Sessions can be restored after closed.
  // If we discard the histories immediately, the restored sessions cannot access to it.
  // Since no callback for session forgetting is provided,
  // we use timeout moratorium to possibly recover the histories.

  console.debug( "cleanup requested" )
  const sessions = await browser.sessions.getRecentlyClosed( { maxResults: 1 } )
  console.debug( sessions )
  console.debug( `store size: ${Object.keys( store ).length}` )

  const targetTab = sessions[0]?.tab
  // Since closed tab doesn't have a tabId, we use sessionId
  // to determine the closing tab's identity
  const sessionId = targetTab?.sessionId
  if ( !sessionId ) {
    return
  }

  setTimeout( async () => {
    console.debug( "executing cleanup" )
    const closedSessions = await browser.sessions.getRecentlyClosed()
    if ( _.find( closedSessions, s => s?.tab?.sessionId === sessionId ) ) {
      // If the tab is still closed after the timeout, remove histories
      delete store[tabId]
      console.debug( `done for tabId: ${tabId}` )
    } else {
      console.debug( "the closed tab seemed to be restored" )
    }
  }, CLEANUP_TIMEOUT_MILLS )
}
