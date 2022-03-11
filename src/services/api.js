export const fetchData = async ({ branch, batch, setLoading, version }) => {
  let url;
  let next_cursor;
  let response;
  let __data;
  batch = batch.toString();

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

  setLoading(true);

  let _response = localStorage.getItem(version + ":::" + url);
  let cacheHit = false;

  if (_response) {
    try {
      response = JSON.parse(_response);
      if (response.expires) {
        if (new Date(response.expires).getTime() > new Date().getTime()) {
          cacheHit = true;
        } else {
          console.log("Cache Expired - ", version + ":::" + url);
          localStorage.removeItem(version + ":::" + url);
        }
      }
    } catch (err) {
      console.log("Parsing Error - ", err.message);
    }
  }

  if (cacheHit) {
    __data = response.data;
    next_cursor = null;
    console.log("CACHE HIT", version + ":::" + url);
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

        let _pro = _data.length / 3000;
        setLoading(_pro * 100);
      } while (_next_cursor != "");

      // only 5 years old.
      // ! temporary solution. API should facilitate this.
      _data = _data.filter(
        (st) =>
          Number(st.roll.slice(0, 2)) >=
          Number(new Date().getFullYear().toString().slice(2)) - 5
      );

      __data = _data;
      response = {
        data: _data,
        pagination: { next_cursor: "" },
        expires: new Date().getTime() + 30 * 24 * 3600 * 1000,
      };
      localStorage.setItem(version + ":::" + url, JSON.stringify(response));
    } else if (branch === "FULL_YEAR") {
      console.log("FULL_YEAR");
      let res;
      let _data = [];
      let _next_cursor = "";
      do {
        console.log("fetching data from " + _next_cursor);
        res = await fetch(
          `https://nithp.herokuapp.com/api/result/student?roll=${batch.slice(
            2
          )}%&limit=3000&next_cursor=${_next_cursor}`
        );
        let jso = await res.json();
        _data = _data.concat(jso.data);
        _next_cursor = jso.pagination.next_cursor;

        let _pro = _data.length / 3000;
        setLoading(_pro * 100);
      } while (_next_cursor != "");

      __data = _data;
      response = {
        data: _data,
        pagination: { next_cursor: "" },
        expires: new Date().getTime() + 30 * 24 * 3600 * 1000,
      };
      localStorage.setItem(version + ":::" + url, JSON.stringify(response));
    } else {
      let res;
      let _data = [];
      let _next_cursor = "";
      do {
        console.log("fetching data from " + _next_cursor);
        res = await fetch(
          `https://nithp.herokuapp.com/api/result/student?branch=${branch}&roll=${batch.slice(
            2
          )}%&limit=200&next_cursor=${_next_cursor}`
        );
        let jso = await res.json();
        _data = _data.concat(jso.data);
        _next_cursor = jso.pagination.next_cursor;

        let _pro = _data.length / 3000;
        setLoading(_pro * 100);
      } while (_next_cursor != "");

      __data = _data;
      response = {
        data: _data,
        pagination: { next_cursor: "" },
        expires: new Date().getTime() + 30 * 24 * 3600 * 1000,
      };
      localStorage.setItem(version + ":::" + url, JSON.stringify(response));
    }
    setLoading(false);
  }

  return __data;
};

export const getResultByRollNumber = async (roll) => {
  let res = await fetch(
    `https://nithp.herokuapp.com/api/result/student/${roll}`
  );
  if (res.ok) {
    return await res.json();
  }
  return null;
};

export const getBranches = async () => {
  let res = await fetch("https://nithp.herokuapp.com/api/result/branches");
  let data = await res.json();
  return data;
};

export const getVersion = async () => {
  let res = await fetch("https://nithp.herokuapp.com/api/result/last_updated");
  let data = await res.json();
  return data;
};
