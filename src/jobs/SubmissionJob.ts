import { IJob } from "../types/bullMQJobDefinition";
import { Job } from "bullmq";
import { SubmissionPayLoad } from "../types/submissionPayload";
import createExecutor from "../utils/ExecutionFactory";
import { ExecutionResponse } from "../types/CodeExecutorStrategy";
import evaluationQueueProducer from "../producers/evaluationQueueProducer";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayLoad>;

  constructor(payload: Record<string, SubmissionPayLoad>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }
  handle = async (job?: Job) => {
    if (job) {
      console.log('Handler of job called');
      console.log(this.payload);
      const key = Object.keys(this.payload)[0];
      const codeLanguage = this.payload[key].language;
      const code = this.payload[key].code;
      const inputTestCase = this.payload[key].inputCase;
      const outputTestCase = this.payload[key].outputCase;
      
      const strategy = createExecutor(codeLanguage);
      console.log(strategy);
      if (strategy != null) {
        const response:ExecutionResponse = await strategy.execute(code, inputTestCase,outputTestCase);
        console.log("response  ---?",response);
        evaluationQueueProducer({response, userId:this.payload[key].userId,submissionId:this.payload[key].submissionId});
        if(response.status === 'SUCCESS'){
          console.log('Code executed sucessfully');
          console.log(response);
        }else{
          console.log("Something went wrong with code execution");
          console.log(response);
          
        }
      }
    }
  };
  failed = (job?: Job): void => {
    console.log("job failed");
    if (job) {
      console.log(job.id);
    }
  };
}
