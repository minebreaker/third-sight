import { EVENT_LOAD, EVENT_NAVIGATE, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "./events"
import * as store from "./store"
import _ from "lodash"
import { getActiveTab } from "./utils"


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

  const tab = await getActiveTab()

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
browser.runtime.onMessage.addListener( ( message: any, sender: any, _response: never ) => {
  console.debug( `message received: ${message.event}` )
  if ( message.event === EVENT_LOAD ) {
    return onLoad( sender )
  } else if ( message.event === EVENT_REQUEST_HISTORY ) {
    return onRequestHistory()
  } else if ( message.event === EVENT_NAVIGATE ) {
    return onNavigate( message )
  } else {
    console.debug( `unknown message: ${message.event}` )
    return Promise.resolve()
  }
} )
