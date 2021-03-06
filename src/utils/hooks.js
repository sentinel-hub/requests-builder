import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Mousetrap from 'mousetrap';

// Hook
export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export function useWhyDidYouUpdate(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// like useeffect but it doesn't run on first mount.
export const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
    // eslint-disable-next-line
  }, deps);
};

export const useOverlayComponent = (ref, overlayedClassName = undefined) => {
  const [isOverlayExpanded, setIsOverlayExpanded] = useState(false);
  const overlayRef = useRef();
  const closeOverlay = () => setIsOverlayExpanded(false);
  const openOverlay = () => setIsOverlayExpanded(true);
  useScrollBlock(isOverlayExpanded);
  useOnClickOutside(ref, closeOverlay);
  useBind('esc', closeOverlay, isOverlayExpanded);

  useLayoutEffect(() => {
    if (isOverlayExpanded) {
      if (ref.current) {
        const parent = ref.current.parentNode;
        const wrapper = document.createElement('div');
        // wrapper.className = 'general-overlay';
        wrapper.className =
          'fixed top-0 left-0 right-0 bottom-0 w-full z-50 flex cursor-pointer items-center bg-gray-700 bg-opacity-50 justify-center max-h-full py-4 px-0';
        overlayRef.current = wrapper;
        parent.replaceChild(wrapper, ref.current);
        wrapper.appendChild(ref.current);
        ref.current.classList.add('overlayed-element');
        if (overlayedClassName !== undefined) {
          ref.current.classList.add(overlayedClassName);
        }
      }
    } else {
      if (overlayRef.current) {
        const childNodes = overlayRef.current.childNodes;
        ref.current.classList.remove('overlayed-element');
        overlayRef.current.replaceWith(...childNodes);
        if (overlayedClassName !== undefined) {
          ref.current.classList.remove(overlayedClassName);
        }
      }
    }
    // eslint-disable-next-line
  }, [isOverlayExpanded]);

  return { openOverlay, isOverlayExpanded };
};

export const useScrollBlock = (condition) => {
  const block = () => {
    document.body.style.overflow = 'hidden';
  };
  const unblock = () => {
    document.body.style.overflow = 'auto';
  };
  useEffect(() => {
    if (condition) {
      block();
    } else {
      unblock();
    }
  }, [condition]);
};

export const useBind = (bind, bindAction, bindCondition) => {
  useEffect(() => {
    if (bindCondition) {
      Mousetrap.bind(bind, bindAction);
    } else {
      Mousetrap.unbind(bind);
    }
    // eslint-disable-next-line
  }, [bindCondition, bindAction]);
};

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
