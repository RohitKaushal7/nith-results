export const downloadCSV = (data, branch, batch) => {
  let text = "Rollno,Name,Branch,Sgpa,Cgpa\n";
  let __data = JSON.parse(JSON.stringify(data));
  __data.sort((x, y) => Number(x.roll) - Number(y.roll));
  for (const st of __data) {
    text += `${st.roll},${st.name},${st.branch},${st.sgpi},${st.cgpi}\n`;
  }

  let a = document.createElement("a");
  a.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(text)
  );
  a.setAttribute("download", `${branch}_${batch}.csv`);

  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
