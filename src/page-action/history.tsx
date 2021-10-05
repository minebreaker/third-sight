import _ from "lodash"
import React, { useMemo } from "react"
import { createUseStyles } from "react-jss"
import { History } from "../store"
import { Card } from "./card"


const useStyles = createUseStyles( {
  cardList: {
    "overflow-x": "hidden"
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

  return (
      <div className={classes.cardList}>
        {histories.map( history => (
            <Card key={history.timestamp}
                  history={history}
                  onNavigate={props.onNavigate}
                  onNavigateWithNewTab={props.onNavigateWithNewTab} />
        ) )}
      </div>
  )
}
