import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useContacts from "../hooks/useContacts";
import { TAB_USA, TAB_ALL, INITIAL_CONTACT_DATA } from "../lib/constants";
import Contact from "./contact";
import SkeletonContact from "./skeletonContact";
import { useParams, Link } from "react-router-dom";

export default function Modal() {
  const { country } = useParams();
  const isMounted = useRef(false);
  const frag =
    country == TAB_USA ? "country-contacts/United States/" : "contacts/";
  const url = `https://contact.mediusware.com/api/${frag}`;

  const [searchQuery, setSetSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [evenOnly, setEvenOnly] = useState(false);
  const { data, loading, error, hasMore, canceled, setData, refetch } =
    useContacts(url, searchQuery, pageNumber, pageSize);

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }
      refetch({ reset: true });
    }, 500);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery]);

  useEffect(() => {
    refetch();
  }, [pageNumber]);

  useEffect(() => {
    if (pageNumber != 1) setPageNumber(1);
    if (searchQuery != "") setSetSearchQuery("");
    refetch({ reset: true });
  }, [country]);

  const handleEnterEvent = () => {
    refetch({ reset: true });
  };

  // infinite
  const observer = useRef(null);
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (hasMore && entries[0].isIntersecting) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, loading]
  );

  // filter
  const filtered = useMemo(() => {
    if (!evenOnly) return data;
    return data.filter((d) => !(d.id & 1));
  }, [evenOnly, data, country]);

  return (
    <div className="modal fade show" style={{ display: "block" }} role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLiveLabel">
              Modal {country == "US" ? "B" : "A"}
            </h1>
            <div className="d-flex gap-2">
              <Link to={`/problem-2/${TAB_ALL}`}>
                <button type="button" className="btn btn-primary">
                  All Contacts
                </button>
              </Link>
              <Link to={`/problem-2/${TAB_USA}`}>
                <button type="button" className="btn btn-secondary">
                  US Contacts
                </button>
              </Link>
              <Link to={`/problem-2`}>
                <button type="button" className="btn btn-outline-primary">
                  Close
                </button>
              </Link>
            </div>
          </div>
          {/* modal body  */}
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="q" className="form-label">
                Search
              </label>
              <input
                type="search"
                className="form-control"
                id="q"
                placeholder="Search Anything..."
                onChange={(e) => setSetSearchQuery(e.target.value)}
                value={searchQuery}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEnterEvent();
                }}
              />
            </div>
            <ul className="list-group">
              {filtered.map((c, index) => (
                <Contact
                  contact={c}
                  key={c.id}
                  ref={index + 1 == filtered.length ? lastItemRef : null}
                />
              ))}
            </ul>
            {error && <p>{JSON.stringify(error)}</p>}
            {loading && <SkeletonContact />}
            {!canceled && !loading && !error && filtered.length == 0 && (
              <p>No item found</p>
            )}
            {!loading && !error && filtered.length != 0 && !hasMore && (
              <div className="card p-4 my-1">
                You have reached the end of the list
              </div>
            )}
          </div>
          <div className="modal-footer">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="even"
                checked={evenOnly}
                onChange={() => setEvenOnly((prev) => !prev)}
              />
              <label className="form-check-label" htmlFor="even">
                Only Even
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
