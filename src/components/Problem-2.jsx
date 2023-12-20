import React from "react";
import { TAB_ALL, TAB_USA } from "../lib/constants";
import { Link } from "react-router-dom";

const Problem2 = () => {
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <Link to={`${TAB_ALL}`}>
            <button className="btn btn-lg btn-outline-primary" type="button">
              All Contacts
            </button>
          </Link>
          <Link to={`${TAB_USA}`}>
            <button className="btn btn-lg btn-outline-secondary" type="button">
              US Contacts
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Problem2;
