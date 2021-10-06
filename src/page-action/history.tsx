import _ from "lodash"
import React, { useMemo } from "react"
import { History } from "../store"
import { CardList } from "./card"


export function HistoryView( props: {
  histories: History[],
  onNavigate: ( url: string ) => void,
  onNavigateWithNewTab: ( url: string ) => void
} ): React.ReactElement {

  const histories = useMemo(
      () => _.chain( props.histories )
             .dropRight( 1 )  // Removes current page
             .sortBy( history => history.timestamp )
             .reverse()
             .value(),
      [ props.histories ]
  )

  return <CardList histories={histories}
                   onNavigate={tab => props.onNavigate( tab.url )}
                   onNavigateWithNewTab={tab => props.onNavigateWithNewTab( tab.url )} />
}
