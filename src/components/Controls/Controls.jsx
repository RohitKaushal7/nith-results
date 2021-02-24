import React from "react";

import "./Controls.scss";

import searchIcon from "../../assets/search.svg";

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
}) {
  const BATCHES = [
    { name: 19, value: 19 },
    { name: 18, value: 18 },
    { name: 17, value: 17 },
    { name: 16, value: 16 },
  ];
  const BRANCHES = [
    { name: "FULL_COLLEGE", value: "FULL_COLLEGE" },
    { name: "FULL_YEAR", value: "FULL_YEAR" },
    { name: "ARCHITECTURE", value: "ARCHITECTURE" },
    { name: "CHEMICAL", value: "CHEMICAL" },
    { name: "CIVIL", value: "CIVIL" },
    { name: "CSE", value: "CSE" },
    { name: "CSE_DUAL", value: "CSE_DUAL" },
    { name: "ECE", value: "ECE" },
    { name: "ECE_DUAL", value: "ECE_DUAL" },
    { name: "ELECTRICAL", value: "ELECTRICAL" },
    { name: "MATERIAL", value: "MATERIAL" },
    { name: "MECHANICAL", value: "MECHANICAL" },
  ];

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
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
          placeholder='Search RollNo, Name, CGPA, Rank, "property":"value"'
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
          {BRANCHES.map((branch) => (
            <option key={branch.value} value={branch.value}>
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
          {BATCHES.map((batch) => (
            <option key={batch.value} value={batch.value}>
              {batch.name}
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
      <div className="csv" onClick={() => {}} title="download result csv">
        <span>.</span> <span>csv</span>
      </div>
    </div>
  );
}
