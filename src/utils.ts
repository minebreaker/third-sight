import _ from "lodash"


declare const browser: any  // FIXME

export async function getActiveTab() {
  // Since `sender.tab` is undefined when sent from page/browser actions,
  // We assume active tab is the one who sent the request
  const tabs = await browser.tabs.query( { active: true, currentWindow: true } )

  if ( _.isEmpty( tabs ) ) {
    throw new Error( "Active tab not found" )
  }

  return tabs[0]
}
