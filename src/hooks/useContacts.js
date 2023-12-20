import { useEffect, useRef, useState } from "react";
import { HEADER, INITIAL_CONTACT_DATA } from "../lib/constants";

export default function (link, query, page, limit) {
  const url = new URL(link);

  if (query && query != "") url.searchParams.append("search", query);
  if (page && page != "") url.searchParams.append("page", page.toString());
  if (limit && limit != "")
    url.searchParams.append("page_size", limit.toString());

  const [data, setData] = useState(INITIAL_CONTACT_DATA);
  const controllerRef = useRef(null);
  function cancel() {
    controllerRef.current && controllerRef.current.abort();
  }
  const fetchData = async (param = { reset: false }) => {
    const { reset } = param;
    if (reset) setData(INITIAL_CONTACT_DATA);
    else setData((prev) => ({ ...prev, loading: true, error: null }));

    if (controllerRef.current) controllerRef.current.abort("new query added");
    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;
    try {
      const response = await fetch(url, { ...HEADER, signal });
      if (!response.ok) throw new Error("Failed to fetch");
      const d = await response.json();
      setData((prev) => {
        const prevArr = [...prev.data];
        const mergedArr = prevArr.concat(d.results);
        return {
          data: mergedArr,
          count: d.count,
          hasMore: !!d.next,
          loading: false,
          error: null,
          canceled: false,
        };
      });
    } catch (e) {
      if (e.name === "AbortError")
        setData((prev) => ({
          ...prev,
          canceled: true,
          loading: false,
        }));
      else
        setData({
          data: [],
          count: 0,
          hasMore: false,
          loading: false,
          error: e,
          canceled: false,
        });
    }
  };

  // useEffect(() => {
  //   fetchData();
  //   return cancel;
  // }, [page, link]);
  // useEffect(() => {
  //   let timeout = setTimeout(fetchData, 500);
  //   return () => {
  //     if (timeout) clearTimeout(timeout);
  //   };
  // }, [query]);

  return {
    ...data,
    setData,
    cancel,
    refetch: fetchData,
  };
}
