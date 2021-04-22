import React, { useEffect, useState } from "react";

import "./Controls.scss";

import searchIcon from "../../assets/search.svg";
import { getBranches } from "../../services/api";

export default function Controls({
  branch,
  setBranch,
  batch,
  setBatch,
  ranking,
  setRanking,
  searchString,
  setSearchString,
  cs,
  setCs,
  downloadCSV,
}) {
  // STATES
  const [branches, setBranches] = useState([]);

  // EFFECTS
  useEffect(() => {
    getBranches()
      .then((branches) => {
        if (branches) {
          setBranches([
            { name: "FULL_COLLEGE", batches: [] },
            { name: "FULL_YEAR", batches: branches[0].batches },
            ...branches,
          ]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // FUNCTIONS

  const handleBranchChange = (e) => {
    setBranch(e.target.value);

    let _branch = branches.find((b) => b.name == e.target.value);
    if (
      e.target.value !== "FULL_COLLEGE" &&
      !_branch.batches.includes(Number(batch))
    ) {
      setBatch(_branch.batches[_branch.batches.length - 1]);
    }
  };
  const handleBatchChange = (e) => {
    setBatch(e.target.value);
  };
  const handleSearchStringChange = (e) => {
    setSearchString(e.target.value);
  };
  const handleRankingChange = (e) => {
    setRanking(e.target.value);
  };
  const handleCSChange = (e) => {
    setCs((cs) => {
      if (cs === "c") {
        return "s";
      }
      return "c";
    });
  };

  return (
    <div className="ctrl">
      <div className="ser">
        <img src={searchIcon} alt="" />
        <input
          type="search"
          value={searchString}
          onChange={handleSearchStringChange}
          placeholder="Search by RollNo Name Branch cg:6.9 sg:9:0"
        />
      </div>
      <div className="branch-con">
        <select
          name="branch"
          id="branch"
          title="Branch"
          value={branch}
          onChange={handleBranchChange}
        >
          <option disabled>📑 Branch</option>
          {branches.map((branch) => (
            <option key={branch.name} value={branch.name}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      <div className="batch-con">
        <select
          name="batch"
          id="batch"
          title="Batch"
          value={batch}
          onChange={handleBatchChange}
        >
          <option disabled>🎓 Batch</option>
          {branches
            .find((b) => b.name == branch)
            ?.batches?.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
        </select>
      </div>
      <div className="cs" title="sort: CGPA / SGPA" onClick={handleCSChange}>
        {cs === "c" ? "Cg" : "Sg"}
      </div>
      <div className="batch-con ranking-con">
        <select
          name="ranking"
          id="ranking"
          title="Ranking"
          value={ranking}
          onChange={handleRankingChange}
        >
          <option disabled>🏆 Ranking</option>
          <option value="S">Standard '1224'</option>
          <option value="D">Dense '1223'</option>
          <option value="O">Ordinal '1234'</option>
        </select>
      </div>
      <div className="csv" onClick={downloadCSV} title="download result csv">
        <span>🍧</span>
      </div>
    </div>
  );
}
