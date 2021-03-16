import { createContext, useContext } from 'react'

/* By default, React requires an initial context. This requires
* code duplication, and becomes annoying as state grows. We can
* eliminate the duplication, get type safe Context, and even get a 
* nice error message by using a proxy object
*/
function createContextWithDefault<C>(): [React.Context<C>, () => C] {
  const proxy = new Proxy(
    {},
    {
      get(target: any, property: any) {
        throw new Error(
          `You tried to access the ${property} property within a Context, but it couldn't be found.
          You probably forgot to use a Provider.`
        )
      },
    }
  )

  const context = createContext<C>(proxy)
  return [context, () => useContext(context)]
}

export const ReactUtil = {
  createContextWithDefault,
}