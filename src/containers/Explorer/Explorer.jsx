import React, { useEffect, useState } from "react";
import Controls from "../../components/Controls/Controls";
import Header from "../../components/Header/Header";
import "./Explorer.scss";

const LATEST_BATCH = 19;
const $progress = null;
const VERSION = "Jan 2021";

/**
 * This component renders all results of students
 * @param {Object} props
 * @param {Object} props.history - route history
 */
export default function Explorer({ history }) {
  // CONSTANTS
  const {
    location: { search },
  } = history;

  const QUERY = new URLSearchParams(search);

  // STATES
  const [branch, setBranch] = useState(QUERY.get("branch") || "FULL_COLLEGE");
  const [batch, setBatch] = useState(QUERY.get("batch") || LATEST_BATCH);
  const [ranking, setRanking] = useState(QUERY.get("r") || "S");
  const [searchString, setSearchString] = useState(QUERY.get("q") || "");
  const [cs, setCs] = useState(QUERY.get("cs") || "c");

  const [data, setData] = useState();
  const [displayData, setDisplayData] = useState();

  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState();

  // EFFECTS
  useEffect(() => {
    console.log("Fetch Data");
    fetchData(branch, batch)
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
  }, [branch, batch]);

  useEffect(() => {
    if (!data) return;
    let _displayData;
    if (!displayData) {
      setDisplayData(data);
      _displayData = JSON.parse(JSON.stringify(data));
    } else {
      _displayData = JSON.parse(JSON.stringify(displayData));
    }

    let _data;
    switch (ranking) {
      case "S":
        _data = standardRanks(_displayData);
        break;
      case "D":
        _data = denseRanks(_displayData);
        break;
      case "O":
        _data = ordinalRanks(_displayData);
        break;
      default:
        break;
    }
    setDisplayData(_data);
    console.log(_data);
  }, [ranking, data]);

  useEffect(() => {
    if (!displayData) return;
    let _displayData = JSON.parse(JSON.stringify(displayData)).sort((a, b) => {
      if (cs === "c") {
        return Number(b.cgpi) - Number(a.cgpi);
      } else {
        return Number(b.sgpi) - Number(a.sgpi);
      }
    });
    setDisplayData(_displayData);
  }, [cs]);

  useEffect(() => {
    console.log("Filter by string");
  }, [searchString]);

  // FUNCTIONS

  const fetchData = async (branch, batch) => {
    let url;
    let next_cursor;
    let response;
    let __data;

    if (branch === "FULL_COLLEGE") {
      url = `FULL_COLLEGE`;
    } else if (branch === "FULL_YEAR") {
      url = `FULL_YEAR - ${batch}`;
    } else {
      url = `${branch} - ${batch}`;
      if (next_cursor) {
        url += `&next_cursor=${next_cursor}`;
      }
    }

    let _response = localStorage.getItem(VERSION + ":::" + url);
    let cacheHit = false;

    if (_response) {
      try {
        response = JSON.parse(_response);
        if (response.expires) {
          if (new Date(response.expires).getTime() > new Date().getTime()) {
            cacheHit = true;
          } else {
            console.log("Cache Expired - ", VERSION + ":::" + url);
            localStorage.removeItem(VERSION + ":::" + url);
          }
        }
      } catch (err) {
        console.log("Parsing Error - ", err.message);
      }
    }

    if (cacheHit) {
      __data = response.data;
      next_cursor = null;
      console.log("CACHE HIT", VERSION + ":::" + url);
      setLoading(false);
    } else {
      if (branch === "FULL_COLLEGE") {
        console.log("FULL COLLEGE");
        let res;
        let _data = [];
        let _next_cursor = "";
        do {
          console.log("fetching data from " + _next_cursor);
          res = await fetch(
            `https://nithp.herokuapp.com/api/result/student?limit=3000&next_cursor=${_next_cursor}`
          );
          let jso = await res.json();
          _data = _data.concat(jso.data);
          _next_cursor = jso.pagination.next_cursor;

          if ($progress) {
            let _pro = _data.length / 3000;
            setLoading(_pro * 100);
          }
        } while (_next_cursor != "");

        __data = _data;
        response = {
          data: _data,
          pagination: { next_cursor: "" },
          expires: new Date().getTime() + 30 * 24 * 3600 * 1000,
        };
        localStorage.setItem(VERSION + ":::" + url, JSON.stringify(response));
      } else if (branch === "FULL_YEAR") {
        console.log("FULL_YEAR");
        let res;
        let _data = [];
        let _next_cursor = "";
        do {
          console.log("fetching data from " + _next_cursor);
          res = await fetch(
            `https://nithp.herokuapp.com/api/result/student?roll=${batch}%&limit=3000&next_cursor=${_next_cursor}`
          );
          let jso = await res.json();
          _data = _data.concat(jso.data);
          _next_cursor = jso.pagination.next_cursor;

          if ($progress) {
            let _pro = _data.length / 3000;
            setLoading(_pro * 100);
          }
        } while (_next_cursor != "");

        __data = _data;
        response = {
          data: _data,
          pagination: { next_cursor: "" },
          expires: new Date().getTime() + 30 * 24 * 3600 * 1000,
        };
        localStorage.setItem(VERSION + ":::" + url, JSON.stringify(response));
      } else {
        let res;
        let _data = [];
        let _next_cursor = "";
        do {
          console.log("fetching data from " + _next_cursor);
          res = await fetch(
            `https://nithp.herokuapp.com/api/result/student?branch=${branch}&roll=${batch}%&limit=200&next_cursor=${_next_cursor}`
          );
          let jso = await res.json();
          _data = _data.concat(jso.data);
          _next_cursor = jso.pagination.next_cursor;
        } while (_next_cursor != "");

        __data = _data;
        response = {
          data: _data,
          pagination: { next_cursor: "" },
          expires: new Date().getTime() + 30 * 24 * 3600 * 1000,
        };
        localStorage.setItem(VERSION + ":::" + url, JSON.stringify(response));
      }
    }

    return __data;
  };

  const standardRanks = (data) => {
    let k = 1;
    data[0].Rank = 1;
    if (cs == "c") {
      for (let i = 1; i < data.length; ++i) {
        if (data[i - 1].cgpi != data[i].cgpi) k = i + 1;
        data[i].Rank = k;
      }
    } else {
      for (let i = 1; i < data.length; ++i) {
        if (data[i - 1].sgpi != data[i].sgpi) k = i + 1;
        data[i].Rank = k;
      }
    }
    return data;
  };
  const denseRanks = (data) => {
    let k = 1;
    data[0].Rank = 1;
    if (cs == "c") {
      for (let i = 1; i < data.length; ++i) {
        if (data[i - 1].cgpi != data[i].cgpi) k++;
        data[i].Rank = k;
      }
    } else {
      for (let i = 1; i < data.length; ++i) {
        if (data[i - 1].sgpi != data[i].sgpi) k++;
        data[i].Rank = k;
      }
    }
    return data;
  };
  const ordinalRanks = (data) => {
    data.forEach((stud, i) => {
      stud.Rank = i + 1;
    });
  };

  // RENDER
  return (
    <div>
      <Header lastUpdated="Jan 2021" />
      <Controls
        branch={branch}
        setBranch={setBranch}
        batch={batch}
        setBatch={setBatch}
        searchString={searchString}
        setSearchString={setSearchString}
        ranking={ranking}
        setRanking={setRanking}
        cs={cs}
        setCs={setCs}
      />
    </div>
  );
}
