import React from "react";
import { Link } from "react-router-dom";
import "./ResultCard.scss";

export default function ResultCard({ stud, cs, branch }) {
  let cgpi = cs === "c" ? stud.cgpi : stud.sgpi;
  let sgpi = cs === "c" ? stud.sgpi : stud.cgpi;
  let base = Number(cgpi) >= 9.5 && Number(cgpi) < 10 ? "9.5" : parseInt(cgpi);
  return (
    <Link to={`/r/${stud.roll}`}>
      <div className="card" data-rank={stud.Rank} data-base={base}>
        <div className="rank">#_{stud.Rank}</div>
        <div className="name">{stud.name}</div>
        <div className="info">
          <div className="rollno">{stud.roll}</div>
          {["FULL_COLLEGE", "FULL_YEAR"].includes(branch) && (
            <div className="branch">{stud.branch}</div>
          )}
          {/* <div className="year">{stud.roll.slice(0, 2)}</div> */}
        </div>
        <div className="cgpa">{cgpi}</div>
        <div className="sgpa">{sgpi}</div>
      </div>
    </Link>
  );
}
