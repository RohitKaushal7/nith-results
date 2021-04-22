export const denseRanks = (data, cs) => {
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

export const standardRanks = (data, cs) => {
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

export const ordinalRanks = (data, cs) => {
  data.forEach((stud, i) => {
    stud.Rank = i + 1;
  });
  return data;
};
