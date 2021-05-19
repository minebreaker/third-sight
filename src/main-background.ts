import { EVENT_LOAD, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "./events"
import * as store from "./store"
import _ from "lodash"


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

async function onRequestHistory() {
  // Since `sender.tab` is undefined when sent from page/browser actions,
  // We assume active tab is the one who sent the request
  const tabs = await browser.tabs.query( { active: true, currentWindow: true } )
  if ( _.isEmpty( tabs ) ) {
    throw new Error( "Active tab not found" )
  }

  const histories = store.load( tabs[0].id )
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
    return onRequestHistory()
  } else {
    console.debug( `unknown message: ${message.event}` )
    return Promise.resolve()
  }
} )
