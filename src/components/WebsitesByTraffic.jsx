import { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

import moment from "moment";

import { CSVToJSON } from "../utils";
import CSVContent from "./dataset.csv";
import Title from "./Title";

class CellRenderer {
  init(params) {
    const eTemp = document.createElement("div");
    eTemp.innerHTML = `<span>${params.data.site}</span>`;
    this.eGui = eTemp.firstElementChild;
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    return false;
  }
}

function WebsitesByTraffic({ rowData, date, setRowData, setDate }) {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);

  const getConvertedDateString = () => {
    return moment(date).format("DD/MM/YYYY");
  };

  useEffect(() => {
    fetch(CSVContent)
      .then((r) => r.text())
      .then((text) => {
        const jsonData = CSVToJSON(text);

        const filteredData = jsonData.filter((site) => {
          return site.date === getConvertedDateString();
        });
        setRowData(
          filteredData
            .map((s) => {
              return { ...s, pageViews: parseFloat(s.pageViews) };
            })
            .sort((a, b) => b.pageViews - a.pageViews)
            .slice(0, 5)
        );
      });
  }, [date]);

  const [columnDefs] = useState([
    {
      headerName: "Site",
      field: "site",
      cellRenderer: CellRenderer,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Pageviews (in Billions)",
      field: "pageViews",
      type: "numericColumn",
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const getRowId = (params) => params.data.site;

  return (
    <div style={containerStyle} id="reports">
      <Title>Top 5 Websites Ranking</Title>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          value={date}
          onChange={(newValue) => {
            setDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <div className="ag-theme-alpine">
        <AgGridReact
          getRowId={getRowId}
          defaultColDef={defaultColDef}
          rowData={rowData}
          columnDefs={columnDefs}
        ></AgGridReact>
      </div>
    </div>
  );
}

export default WebsitesByTraffic;
