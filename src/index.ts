import express, { Express } from "express";
import serverConfig from "./config/serverConfig";
import SampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import bullBoardAdapter from "./config/bullBoardConfig";
import SampleWorker from "./workers/SampleWorker";
import bodyParser from "body-parser";



const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.text());

app.use("/api", apiRouter);
app.use('/ui', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`server started at *:${serverConfig.PORT}`);

  SampleWorker('SampleQueue');
  SampleQueueProducer("SampleJob", {
    name: "Prakhar",
    company: "Microsoft",
    position: "SDE2",
    location: "Remote|BLR|Noida",
  },2000);
  SampleQueueProducer("SampleJob", {
    name: "Prakhar Agarwal",
    company: "Walmart",
    position: "SDE2",
    location: "Remote|BLR|Noida",
  },30);
});
