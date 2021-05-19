import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "./events"


declare const browser: any  // FIXME

function App() {

  const [ s, setS ] = useState( "" )

  useEffect( () => {
        browser.runtime.sendMessage( { event: EVENT_REQUEST_HISTORY } ).then( ( message: any ) => {
          if ( message.event === EVENT_RESPONSE_HISTORY ) {
            const histories = message.history as History[]
            console.info( histories )
            setS( JSON.stringify( histories ) )

          } else {
            console.debug( message )
            console.debug( "unknown message" )
          }
        } )
      }, []
  )

  return (
      <div>
        Histories
        <div>
          {s}
        </div>
      </div>
  )
}

ReactDOM.render(
    <App />,
    document.getElementById( "app" )
)
