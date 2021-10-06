import _ from "lodash"
import React, { useMemo, useState } from "react"
import { createUseStyles } from "react-jss"
import { EVENT_HIGHLIGHT, EVENT_NAVIGATE, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "../shared/events"
import { Store } from "../shared/store"
import { getActiveTab } from "../shared/utils"
import { BirdsEye } from "./birds-eye"
import { HistoryView } from "./history"
import { Separator } from "./separator"
import { States, Tab } from "./tab"
import { useEffectAsync } from "./utils"


const useStyles = createUseStyles( {
  "@global": {
    body: {
      "background-color": "#38383d",
      "color": "#ffffff"
    }
  },
  header: {
    "position": "sticky",
    "top": 0
  },
  messageOnly: {
    "margin": "4px 2em"
  }
} )

const openTab = ( url: string ) => {
  browser.runtime.sendMessage( { event: EVENT_NAVIGATE, url } ).then( () => {
    window.close()
  } )
}

const openNewTab = ( url: string ) => {
  browser.runtime.sendMessage( { event: EVENT_NAVIGATE, url, newTab: true } ).then()
}

const highlightTab = ( tabId: number ) => {
  browser.runtime.sendMessage( { event: EVENT_HIGHLIGHT, tabId } ).then()
}

export function App(): React.ReactElement {

  const classes = useStyles()

  const [ store, setStore ] = useState<Store>()
  const [ activeTab, setActiveTab ] = useState<Tab>()
  const [ state, setState ] = useState<States>( "history" )

  // Sync histories on popup
  useEffectAsync( async () => {
        const message: any = await browser.runtime.sendMessage( { event: EVENT_REQUEST_HISTORY } )

        if ( message.event === EVENT_RESPONSE_HISTORY ) {
          const store = message.store as Store
          console.debug( store )
          setStore( store )

        } else {
          console.debug( message )
          console.debug( "unknown message" )
        }
      }, []
  )

  useEffectAsync( async () => {
    const tab = await getActiveTab()
    setActiveTab( tab )
  }, [] )

  const histories = useMemo( () => {
    return store && activeTab && activeTab.id ? store[activeTab.id] : []
  }, [ store, activeTab ] )

  if ( store === undefined ) {
    return <p className={classes.messageOnly}>Loading...</p>
  }

  return (
      <div>
        <div className={classes.header}>
          <Tab state={state} onClick={setState} />
          <Separator />
        </div>
        {state === "history" && (
            <HistoryView histories={histories}
                         onNavigate={openTab}
                         onNavigateWithNewTab={openNewTab} />
        )}
        {state === "birdseye" && (
            <BirdsEye store={store} activeTab={activeTab} onNavigate={highlightTab} />
        )}
      </div>
  )
}
