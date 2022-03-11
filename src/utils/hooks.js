import { useEffect, useState, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import Mousetrap from 'mousetrap';
import { getMessageFromApiError } from '../api';

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

export const useScrollGenerationContainer = (listOfElements, containerRef) => {
  const [currentLimit, setCurrentLimit] = useState(50);
  const scrollCallback = useCallback((e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setCurrentLimit((prev) => prev + 50);
    }
  }, []);
  useEffect(() => {
    const element = containerRef.current;
    element.addEventListener('scroll', scrollCallback);
    return () => {
      element.removeEventListener('scroll', scrollCallback);
    };
    // eslint-disable-next-line
  }, []);

  return listOfElements.slice(0, currentLimit);
};

export const useDownloadLink = (response, type = 'application/json') => {
  const [downloadLink, setDownloadLink] = useState('');
  useEffect(() => {
    let srcUrl;
    if (response) {
      srcUrl = URL.createObjectURL(new Blob([JSON.stringify(response, null, 2)], { type }));
      setDownloadLink(srcUrl);
    }
    return () => {
      URL.revokeObjectURL(srcUrl);
    };
    // eslint-disable-next-line
  }, []);

  return downloadLink;
};

const hasNextPage = (res) => res.data?.links?.next !== undefined || res.data?.links?.nextToken !== undefined;

export function useFetchAllPaginatedData(request, options) {
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState(() => (options?.flat ? [] : [[]]));
  const [error, setError] = useState();
  const [maxPage, setMaxPage] = useState(0);
  const flat = useMemo(() => {
    return options?.flat ?? false;
  }, [options?.flat]);

  const fetchAll = useCallback(async () => {
    setIsFetching(true);
    setError(undefined);

    let results = [];
    let maxPage = 0;
    let done = false;

    while (!done) {
      try {
        // eslint-disable-next-line
        const res = await request({
          viewtoken: maxPage * 100,
          sort: 'created:desc',
        });
        if (flat) {
          results = results.concat(res.data.data);
        } else {
          results.push(res.data.data);
        }
        if (hasNextPage(res)) {
          maxPage += 1;
        } else {
          done = true;
        }
      } catch (err) {
        setError(getMessageFromApiError(err));
        break;
      }
    }

    setMaxPage(maxPage);
    setData(results);
    setIsFetching(false);
    // eslint-disable-next-line
  }, []);

  return { data, error, maxPage, isFetching, fetchAll, setData };
}

export const usePaginatedData = (paginatedRequest, deps, order) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');
  const [sortOrder] = useState(order);
  const [hasError, setHasError] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const fetchAndSet = useCallback(
    async (page, debouncedSearch, results) => {
      try {
        setHasError(false);
        setIsFetching(true);
        const res = await paginatedRequest({
          viewtoken: page * 100,
          search: debouncedSearch !== '' ? debouncedSearch : undefined,
          sort: sortOrder,
        });
        if (hasNextPage(res)) {
          setMaxPage((prev) => {
            if (page === prev) {
              return prev + 1;
            }
            return prev;
          });
        }
        setResults(res.data.data);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        setHasError(true);
      }
    },
    [paginatedRequest, sortOrder],
  );

  const refetch = useCallback(() => {
    setMaxPage(0);
    setCurrentPage(0);
    setResults([]);
    fetchAndSet(0, '', []);
  }, [fetchAndSet]);

  useEffect(() => {
    fetchAndSet(currentPage, debouncedSearch, results);
    // eslint-disable-next-line
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(0);
    setMaxPage(0);
  }, [debouncedSearch]);

  useDidMountEffect(() => {
    setCurrentPage(0);
    setMaxPage(0);
    if (currentPage === 0) {
      fetchAndSet(0, debouncedSearch, results);
    }
    // eslint-disable-next-line
  }, deps);

  const setSearchQuery = useCallback((value) => {
    setSearch(value);
  }, []);

  const setPage = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  return {
    currentPage,
    maxPage,
    results,
    search,
    hasError,
    isFetching,
    setSearchQuery,
    setPage,
    refetch,
  };
};
