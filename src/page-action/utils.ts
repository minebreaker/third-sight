import { DependencyList, useEffect } from "react"


type AsyncEffectCallback = ( unmounted: Unmounted ) => Promise<void>
type Unmounted = { unmounted: boolean }

/**
 * https://overreacted.io/a-complete-guide-to-useeffect/#speaking-of-race-conditions
 */
export const useEffectAsync: (
    effect: AsyncEffectCallback,
    deps?: DependencyList
) => void = ( effect, deps ) => {
  const unmounted: Unmounted = { unmounted: false }

  useEffect( () => {
    effect( unmounted ).then()

    return () => {
      unmounted.unmounted = true
    }
  }, deps || [] )
}
