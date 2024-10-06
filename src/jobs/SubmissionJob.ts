import { IJob } from "../types/bullMQJobDefinition";
import { Job } from "bullmq";
import { SubmissionPayLoad } from "../types/submissionPayload";
import createExecutor from "../utils/ExecutionFactory";
import { ExecutionResponse } from "../types/CodeExecutorStrategy";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayLoad>;

  constructor(payload: Record<string, SubmissionPayLoad>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }
  handle = async (job?: Job) => {
    if (job) {
      const key = Object.keys(this.payload)[0];
      const codeLanguage = this.payload[key].language;
      const code = this.payload[key].code;
      const inputTestCase = this.payload[key].inputCase;

      const strategy = createExecutor(codeLanguage);
      if (strategy != null) {
        const response:ExecutionResponse = await strategy.execute(code, inputTestCase);
        if(response.status === 'COMPLETED'){
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
