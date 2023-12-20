import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ACTIVE, ALL, COMPLETED } from "../lib/constants";

const Problem1 = () => {
  const [show, setShow] = useState("all");

  const handleClick = (val) => {
    setShow(val);
  };

  // my code starts here
  const [rawData, setRawData] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setRawData((prev) => [...prev, { name, status }]);
  };

  const tableData = useMemo(() => {
    let data = [...rawData]; // clone for mutating
    switch (show) {
      case ACTIVE:
        data = data.filter((e) => e.status.toLowerCase() == ACTIVE);
        break;
      case COMPLETED:
        data = data.filter((e) => e.status.toLowerCase() == COMPLETED);
        break;
      case ALL:
        data = data.sort((item1, item2) => {
          const a = item1.status.toLowerCase();
          const b = item2.status.toLowerCase();
          if (a == b) return 0; // dont swap if same
          if (a != ACTIVE && b == ACTIVE) return 1; // b before a | swap them
          if (a != ACTIVE && b == COMPLETED) return 1; // swap them
          return -1; // a before b
        });
        break;
      default:
        // do nothing
        break;
    }
    return data;
  }, [show, rawData]);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-1</h4>
        <div className="col-6 ">
          <form
            className="row gy-2 gx-3 align-items-center mb-4"
            onSubmit={handleFormSubmit}
          >
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="col-8">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${show === "all" && "active"}`}
                type="button"
                onClick={() => handleClick("all")}
              >
                All
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "active" && "active"}`}
                type="button"
                onClick={() => handleClick("active")}
              >
                Active
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "completed" && "active"}`}
                type="button"
                onClick={() => handleClick("completed")}
              >
                Completed
              </button>
            </li>
          </ul>
          <div className="tab-content"></div>
          <table className="table table-striped ">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((d, i) => (
                <tr key={i}>
                  <td>{d.name}</td>
                  <td>{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problem1;
