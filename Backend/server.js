const express = require("express");
const cors = require("cors");
const { drop } = require("./extraaa/drop");
const { dataP, dataP2 } = require("./extraaa/dataP");
const { timestamp } = require("./extraaa/timestamp");
const app = express();
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173","https://proj4-milestone4.onrender.com"],
    })
);

app.get("/api-inti", (req, res) => {
    res.send(drop)
})

let count = 0;
app.post("/api-data", (req, res) => {
    const { COUNTRY_CD, WAYS_TO_BUY_CD, REPORTING_DATE } = req.body.filters;
    console.log(COUNTRY_CD, "======");

    if (COUNTRY_CD.includes("CA"))
        setTimeout(() => {
            res.send(dataP);
        }, 3000);
    else
        setTimeout(() => {
            res.send(dataP2);
        }, 3000);
    console.log("done", count);
    count++;

})
app.get("/api-timestamp", (req, res) => {
    res.send(timestamp)
})

app.listen(60001, () => console.log(`Server is now running on port `));


