import React from "react"
import { createUseStyles } from "react-jss"


const useStyles = createUseStyles( {
  sep: {
    "border-bottom": "solid #4a4a4f 8px"
  }
} )

export function Separator(): React.ReactElement {
  return <div className={useStyles().sep} />
}
