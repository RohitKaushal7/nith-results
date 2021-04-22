import React, { useContext, useEffect, useState } from "react";
import Controls from "../../components/Controls/Controls";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Progress from "../../components/Progress";
import RememberMe from "../../components/RememberMe/RememberMe";
import ResultCard from "../../components/ResultCard/ResultCard";
import GlobalContext from "../../context/GlobalContext";
import "./Explorer.scss";

import { denseRanks, ordinalRanks, standardRanks } from "../../utils/ranking";
import { fetchData, getVersion } from "../../services/api";
import { downloadCSV } from "../../utils/download";

const LIMIT = 100;

export default function Explorer({ history }) {
  // CONSTANTS
  const {
    location: { search },
  } = history;

  const QUERY = new URLSearchParams(search);

  let q_branch = QUERY.get("branch") ? QUERY.get("branch").toUpperCase() : null;
  let q_batch = QUERY.get("batch");
  let q_r = ["S", "D", "O"].includes(QUERY.get("r")) ? QUERY.get("r") : null;
  let q_q = QUERY.get("q");
  let q_cs = ["c", "s"].includes(QUERY.get("cs")) ? QUERY.get("cs") : null;
  let q_p = Number(QUERY.get("p"))
    ? Number(QUERY.get("p")) >= 0
      ? Number(QUERY.get("p"))
      : null
    : null;

  // STATES
  const [branch, setBranch] = useState(q_branch || "FULL_COLLEGE");
  const [batch, setBatch] = useState(
    q_batch || (new Date().getFullYear() - 1).toString()
  );
  const [ranking, setRanking] = useState(q_r || "S");
  const [searchString, setSearchString] = useState(q_q || "");
  const [cs, setCs] = useState(q_cs || "c");
  const [page, setPage] = useState(q_p || 0);

  const [data, setData] = useState();
  const [displayData, setDisplayData] = useState();
  const [rankedData, setRankedData] = useState();

  const [loading, setLoading] = useState();
  const [hits, setHits] = useState();
  const [resultCount, setResultCount] = useState();

  const { version } = useContext(GlobalContext);

  // EFFECTS

  useEffect(() => {
    // GET VERSION
    if (!window.location.host.includes("localhost")) {
      fetch("https://api.countapi.xyz/hit/rohitkaushal7/nith_results")
        .then((res) => res.json())
        .then((res) => {
          setHits(res.value);
        });
    }
  }, []);

  useEffect(() => {
    if (!version) return;
    let _cacheVersion = localStorage.getItem("VERSION");
    if (_cacheVersion != version) {
      localStorage.setItem("VERSION", version);
      console.log("Clearing Cache for New Version.");
      for (let i = 0; i < 100; ++i) {
        let key = localStorage.key(i);
        if (!key) {
          break;
        }
        if (key.includes(":::")) {
          console.log("CLEARED CACHE - ", key);
          localStorage.removeItem(key);
        }
      }
    }
  }, [version]);

  useEffect(() => {
    if (!version) return;

    fetchData({ batch, branch, setLoading, version })
      .then((_data) => {
        _data = _data.sort((a, b) => {
          if (cs === "c") {
            return Number(b.cgpi) - Number(a.cgpi);
          } else {
            return Number(b.sgpi) - Number(a.sgpi);
          }
        });
        setData(_data);
      })
      .catch((err) => {
        console.error("Failed to Fetch. Err - ", err.message);
      });
  }, [branch, batch, version]);

  useEffect(() => {
    if (!data) return;
    let _data = JSON.parse(JSON.stringify(data));

    _data.sort((a, b) => {
      if (cs === "c") {
        return Number(b.cgpi) - Number(a.cgpi);
      } else {
        return Number(b.sgpi) - Number(a.sgpi);
      }
    });

    switch (ranking) {
      case "S":
        _data = standardRanks(_data, cs);
        break;
      case "D":
        _data = denseRanks(_data, cs);
        break;
      case "O":
        _data = ordinalRanks(_data, cs);
        break;
      default:
        break;
    }
    setRankedData(_data);
    setDisplayData(_data);
  }, [ranking, data, cs]);

  useEffect(() => {
    history.replace(
      `/?${branch !== "FULL_COLLEGE" ? `branch=${branch}&batch=${batch}` : ""}${
        cs === "s" ? `&cs=${cs}` : ""
      }${ranking !== "S" ? `&r=${ranking}` : ""}${page ? `&p=${page}` : ""}`
    );
  }, [branch, batch, ranking, cs, page]);

  useEffect(() => {
    if (!rankedData) return;
    let ss = searchString.toLocaleLowerCase();
    let _displayData = rankedData.filter((stud) => {
      let str = `${stud.roll.toLocaleLowerCase()} ${stud.name.toLocaleLowerCase()} ${stud.branch.toLowerCase()} cg:${
        stud.cgpi
      } sg:${stud.sgpi}`;
      return String(str).includes(ss);
    });
    setDisplayData(_displayData);
    setResultCount(searchString ? _displayData.length : null);
    setPage(0);
  }, [searchString]);

  // FUNCTIONS

  const handleCopy = (e) => {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData(
        "text/plain",
        `https://nith.netlify.app/?${
          branch !== "FULL_COLLEGE" ? `branch=${branch}&batch=${batch}` : ""
        }${cs === "s" ? `&cs=${cs}` : ""}${
          ranking !== "S" ? `&r=${ranking}` : ""
        }${page ? `&p=${page}` : ""}`
      );
    }
  };

  const handleDownloadCSV = () => {
    downloadCSV(data, branch, batch);
  };

  // RENDER
  return (
    <div>
      <Header />
      <Controls
        branch={branch}
        setBranch={setBranch}
        batch={batch}
        setBatch={setBatch}
        page={page}
        setPage={setPage}
        searchString={searchString}
        setSearchString={setSearchString}
        ranking={ranking}
        setRanking={setRanking}
        cs={cs}
        setCs={setCs}
        downloadCSV={handleDownloadCSV}
      />
      {/* <div className="you" id="you" title="">
        <span id="rem">
          <img src="pics/rem.svg" valign="middle" width="12" alt="" />
          Click to Remember You by Roll No.*
        </span>
      </div> */}
      <div
        className="query"
        onClick={() => document.execCommand("copy")}
        onCopy={handleCopy}
        title="copy link"
      >
        🐤
        {`?${
          branch !== "FULL_COLLEGE" ? `branch=${branch}&batch=${batch}` : ""
        }${cs === "s" ? `&cs=${cs}` : ""}${
          ranking !== "S" ? `&r=${ranking}` : ""
        }${page ? `&p=${page}` : ""}`}
      </div>

      <div id="res_cnt">{resultCount ? resultCount + " results..." : null}</div>

      <div className="container">
        {loading && (
          <Progress
            indeterminate
            value={Number.isFinite(loading) ? loading : null}
          />
        )}
        {displayData
          ?.slice(
            page * LIMIT,
            Math.min(page * LIMIT + LIMIT, displayData.length)
          )
          .map((stud) => (
            <ResultCard key={stud.roll} stud={stud} cs={cs} branch={branch} />
          ))}
      </div>
      {Math.floor(displayData?.length / LIMIT) ? (
        <div className="pagination">
          <div
            className="btn"
            onClick={() => setPage((page) => Math.max(0, page - 1))}
          >
            Prev
          </div>
          <div className="page">{page + 1}</div>
          <div
            className="btn"
            onClick={() =>
              setPage((page) =>
                Math.min(page + 1, Math.floor(displayData.length / LIMIT))
              )
            }
          >
            Next
          </div>
        </div>
      ) : null}
      {/* <RememberMe /> */}
      <Footer hits={hits} />
    </div>
  );
}
