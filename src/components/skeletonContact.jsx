import React from "react";

function SkeletonContact() {
  return (
    <div className="list-group placeholder-glow">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => (
        <li className="list-group-item gap-2" key={e}>
          <span className="placeholder col-7 rounded"></span>
          <br />
          <small className="placeholder col-3 rounded"></small>
        </li>
      ))}
    </div>
  );
}

export default SkeletonContact;
