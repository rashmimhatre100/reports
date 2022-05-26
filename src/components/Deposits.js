import * as React from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import moment from "moment";

export default function Deposits({ rowData, date }) {
  const initialValue = 0;
  const traffic = rowData
    .reduce(
      (previousValue, currentValue) => previousValue + currentValue.pageViews,
      initialValue
    )
    .toFixed(2);
  return (
    <React.Fragment>
      <Title>Total Traffic</Title>
      <Typography component="p" variant="h4">
        {traffic}B
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {moment(date).format("DD MMM, YYYY")}
      </Typography>
      <div></div>
    </React.Fragment>
  );
}
