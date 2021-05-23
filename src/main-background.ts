import { EVENT_NAVIGATE, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "./events"
import * as store from "./store"
import { getActiveTab } from "./utils"


async function onNavigated( details: any ) {
  console.debug( "navigated" )
  console.debug( details )

  const targetTabId = details.tabId
  if ( targetTabId ) {
    const capturedImageUrl = await browser.tabs.captureTab( targetTabId )
    const tab = await browser.tabs.get( targetTabId )

    store.save( tab, capturedImageUrl )
  } else {
    console.debug( "loaded but tab id is unknown" )
  }
}

async function onRequestHistory() {

  const tab = await getActiveTab()
  if ( tab.id === browser.tabs.TAB_ID_NONE ) {
    // Usually tab.id is not `undefined` when pageAction is enabled,
    // so this path should be unreachable
    throw new Error()
  }

  const histories = store.load( tab.id )
  return {
    event: EVENT_RESPONSE_HISTORY,
    history: histories
  }
}

async function onNavigate( message: any ) {

  //const tab = await getActiveTab()

  const url = message.url
  if ( typeof url !== "string" ) {
    throw new Error( "Invalid message" )
  }

  // noinspection PointlessBooleanExpressionJS
  const newTab = message.newTab === true

  if ( newTab ) {
    await browser.tabs.create( { url } )
  } else {
    await browser.tabs.update( { url } )
  }
}

console.debug( "adding listener" )
// FIXME: configure an appropriate rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
browser.runtime.onMessage.addListener( ( message: any, _sender: any ) => {
  console.debug( `message received: ${message.event}` )
  if ( message.event === EVENT_REQUEST_HISTORY ) {
    return onRequestHistory()
  } else if ( message.event === EVENT_NAVIGATE ) {
    return onNavigate( message )
  } else {
    console.debug( `unknown message: ${message.event}` )
    return Promise.resolve()
  }
} )

browser.webNavigation.onCompleted.addListener( ( details: any ) => {
  return onNavigated( details )
} )

browser.tabs.onRemoved.addListener( ( tabId: number ) => {
  return store.scheduleCleanUp( tabId )
} )
