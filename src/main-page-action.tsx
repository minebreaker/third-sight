import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "./events"
import _ from "lodash"
import { History } from "./store"
import { DateTime } from "luxon"


declare const browser: any  // FIXME

function App() {

  const [ histories, setHistories ] = useState<History[]>()

  useEffect( () => {
        browser.runtime.sendMessage( { event: EVENT_REQUEST_HISTORY } ).then( ( message: any ) => {
          if ( message.event === EVENT_RESPONSE_HISTORY ) {
            const histories = message.history as History[]
            console.debug( histories )
            setHistories( _.chain( histories )
                           .dropRight( 1 ) // Removes current page
                           .sortBy( history => history.timestamp )
                           .reverse()
                           .value() )

          } else {
            console.debug( message )
            console.debug( "unknown message" )
          }
        } )
      }, []
  )

  return (
      <div>
        {histories === undefined
            ? <p>Loading...</p>
            : _.isEmpty( histories )
                ? <p>The history is empty</p>
                : histories.map( history => (
                    <div style={{ margin: "4px", border: "solid 1px black" }}>
                      <p>{history.tab.title}</p>
                      <p>{history.tab.url}</p>
                      <p>{DateTime.fromMillis( history.timestamp ).toISO()}</p>
                      <img src={history.objectUrl} style={{
                        width: 400,
                        height: 300,
                        objectFit: "cover"
                      }} />
                    </div>
                ) )
        }
      </div>
  )
}

ReactDOM.render(
    <App />,
    document.getElementById( "app" )
)
