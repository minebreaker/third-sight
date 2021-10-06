import { EVENT_HIGHLIGHT, EVENT_NAVIGATE, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "./events"
import * as store from "./store"


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
  const histories = store.load()
  return {
    event: EVENT_RESPONSE_HISTORY,
    store: histories
  }
}

async function onNavigate( message: any ) {

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

async function onHighlight( message: any ) {

  const tabId = message.tabId
  if ( typeof tabId !== "number" ) {
    throw new Error( "Invalid message" )
  }

  const tab = await browser.tabs.get( tabId )
  const info = { windowId: tab.windowId, populate: false, tabs: [ tab.index ] }
  // To avoid promise rejection error at the frontend, uses timeout to
  // (hopefully) wait until promise resolving and then execute highlighting.
  // FIXME: Find better way to do this
  setTimeout( () => browser.tabs.highlight( info ).then(), 0 )
}

console.debug( "adding listener" )
// FIXME: configure an appropriate rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
browser.runtime.onMessage.addListener( ( message: any, _sender: any ) => {
  console.debug( `message received: ${message.event}` )
  switch ( message.event ) {
    case EVENT_REQUEST_HISTORY:
      return onRequestHistory()
    case EVENT_NAVIGATE:
      return onNavigate( message )
    case EVENT_HIGHLIGHT:
      return onHighlight( message )
    default:
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
