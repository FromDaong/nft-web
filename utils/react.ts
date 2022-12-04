import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

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
				);
			},
		}
	);

	const context = createContext<C>(proxy);
	return [context, () => useContext(context)];
}

export const ReactUtil = {
	createContextWithDefault,
};

export const useAsync = (asyncFunction, immediate = true) => {
	const [status, setStatus] = useState("idle");
	const [value, setValue] = useState(null);
	const [error, setError] = useState(null);
	// The execute function wraps asyncFunction and
	// handles setting state for pending, value, and error.
	// useCallback ensures the below useEffect is not called
	// on every render, but only if asyncFunction changes.
	const execute = useCallback(() => {
		setStatus("pending");
		setValue(null);
		setError(null);
		return asyncFunction()
			.then((response) => {
				setValue(response);
				setStatus("success");
			})
			.catch((error) => {
				setError(error);
				setStatus("error");
			});
	}, [asyncFunction]);
	// Call execute if we want to fire it right away.
	// Otherwise execute can be called later, such as
	// in an onClick handler.
	useEffect(() => {
		if (immediate) {
			execute();
		}
	}, [execute, immediate]);
	return {execute, status, value, error};
};

export function useEventListener(eventName, handler, element = window) {
	const savedHandler = useRef();
	// Update ref.current value if handler changes.
	// This allows our effect below to always get latest handler ...
	// ... without us needing to pass it in effect deps array ...
	// ... and potentially cause effect to re-run every render.
	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);
	useEffect(
		() => {
			// Make sure element supports addEventListener
			// On
			const isSupported = element && element.addEventListener;
			if (!isSupported) return;
			// Create event listener that calls handler function stored in ref
			// @ts-ignore
			const eventListener = (event) => savedHandler.current(event);
			// Add event listener
			element.addEventListener(eventName, eventListener);
			// Remove event listener on cleanup
			return () => {
				element.removeEventListener(eventName, eventListener);
			};
		},
		[eventName, element] // Re-run if eventName or element changes
	);
}
/**
 *
 * @description Get a mutable ref object where we can store props for comparison next time this hook runs.
 */
export function useWhyDidYouUpdate(name, props) {
	const previousProps = useRef();
	useEffect(() => {
		if (previousProps.current) {
			// Get all keys from previous and current props
			// @ts-ignore
			const allKeys = Object.keys({...previousProps.current, ...props});
			// Use this object to keep track of changed props
			const changesObj = {};
			// Iterate through keys
			allKeys.forEach((key) => {
				// If previous is different from current
				// @ts-ignore
				if (previousProps.current[key] !== props[key]) {
					// Add to changesObj
					changesObj[key] = {
						// @ts-ignore
						from: previousProps.current[key],
						to: props[key],
					};
				}
			});
			// If changesObj not empty then output to console
			if (Object.keys(changesObj).length) {
				console.log("[why-did-you-update]", name, changesObj);
			}
		}
		// Finally update previousProps with current props for next hook call
		previousProps.current = props;
	});
}

export const useToggle = (initialState = false) => {
	// Initialize the state
	const [state, setState] = useState(initialState);

	// Define and memorize toggler function in case we pass down the component,
	// This function change the boolean value to it's opposite value
	const toggle = useCallback(() => setState((state) => !state), []);

	return [state, toggle];
};
