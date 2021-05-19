import { EVENT_LOAD, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "./events"
import * as store from "./store"


declare const browser: any  // FIXME

async function onLoad( sender: any ) {
  console.debug( "loaded event received" )
  console.debug( sender )

  const targetTabId = sender.tab?.id
  if ( targetTabId ) {
    const capturedImageUrl = await browser.tabs.captureTab( targetTabId )
    store.save( sender.tab, capturedImageUrl )
  } else {
    console.debug( "loaded but tab id is unknown" )
  }
}

async function onRequestHistory( sender: any ) {
  console.debug( sender )
  console.debug( sender.tab?.id )
  const histories = store.load( sender.tab?.id )
  return {
    event: EVENT_RESPONSE_HISTORY,
    history: histories
  }
}

console.debug( "adding listener" )
browser.runtime.onMessage.addListener( ( message: any, sender: any, _response: never ) => {
  console.debug( `message received: ${message.event}` )
  if ( message.event === EVENT_LOAD ) {
    return onLoad( sender )
  } else if ( message.event === EVENT_REQUEST_HISTORY ) {
    return onRequestHistory( sender )
  } else {
    console.debug( "unknown message" )
    return Promise.resolve()
  }
} )
