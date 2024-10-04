import express, { Express } from "express";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import bullBoardAdapter from "./config/bullBoardConfig";
import SampleWorker from "./workers/SampleWorker";
import bodyParser from "body-parser";
import runPython from "./containers/runPythonDocker";



const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.text());

app.use("/api", apiRouter);
app.use('/ui', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`server started at *:${serverConfig.PORT}`);

  SampleWorker('SampleQueue');
  
  const code = `
x=input()
y=input()
print("val of x is", x)
print("val of y is", y)
`;
  const inputTestCase = `100
  200
  `;

  runPython(code,inputTestCase);
});
