import express, { Express } from "express";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import bullBoardAdapter from "./config/bullBoardConfig";
import SampleWorker from "./workers/SampleWorker";
import bodyParser from "body-parser";
// import runCpp from "./containers/runCppDocker";
import SubmissionWorker from "./workers/SubmissionWorker";
import { submission_queue } from "./utils/constants";

// import submissionQueueProducer from "./producers/submissionQueueProducer";



const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.text());

app.use("/api", apiRouter);
app.use('/ui', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`server started at *:${serverConfig.PORT}`);

  SampleWorker('SampleQueue');
  SubmissionWorker(submission_queue);

  
//   const code:string =`
//   #include <iostream>
//   using namespace std;

//   int main(){
//     int x;
//     cin>>x;
//     cout<<"Value of x is "<<x<<endl;
//     for(int i=0;i<x;i++){
//       cout<<i<<" ";
//     }
//     return 0;
//   }
// `;
//   const inputCase:string = `10
//   `;

//   submissionQueueProducer({1234:{
//     language: "CPP",
//     inputCase,
//     code
//   }});

  // runCpp(code,inputCase);
});
