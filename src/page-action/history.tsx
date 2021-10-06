import _ from "lodash"
import React, { useMemo } from "react"
import { createUseStyles } from "react-jss"
import { History } from "../store"
import { CardList } from "./card"


const useStyles = createUseStyles( {
  message: {
    "margin": "4px 2em"
  }
} )

export function HistoryView( props: {
  histories: History[],
  onNavigate: ( url: string ) => void,
  onNavigateWithNewTab: ( url: string ) => void
} ): React.ReactElement {

  const classes = useStyles()

  const histories = useMemo(
      () => _.chain( props.histories )
             .dropRight( 1 )  // Removes current page
             .sortBy( history => history.timestamp )
             .reverse()
             .value(),
      [ props.histories ]
  )

  if ( _.isEmpty( histories ) ) {
    return (
        <div className={classes.message}>
          <p>The history is empty.</p>
        </div>
    )
  }

  return <CardList histories={histories}
                   onNavigate={tab => props.onNavigate( tab.url )}
                   onNavigateWithNewTab={tab => props.onNavigateWithNewTab( tab.url )} />
}
