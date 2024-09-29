import express, { Express } from "express";
import serverConfig from "./config/serverConfig";
import SampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/SampleWorker";

const app: Express = express();

app.use("/api", apiRouter);

app.listen(serverConfig.PORT, () => {
  console.log(`server started at *:${serverConfig.PORT}`);

  SampleWorker('SampleQueue');
  SampleQueueProducer("SampleJob", {
    name: "Prakhar",
    company: "Microsoft",
    position: "SDE2",
    location: "Remote|BLR|Noida",
  });
});
