import { IJob } from "../types/bullMQJobDefinition";
import { Job } from "bullmq";
import { SubmissionPayLoad } from "../types/submissionPayload";
import runCpp from "../containers/runCppDocker";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayLoad>;

  constructor(payload: Record<string, SubmissionPayLoad>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }
  handle = async (job?:Job) => {

    if(job){
        const key = Object.keys(this.payload)[0];
        console.log(this.payload[key].language);
        if(this.payload[key].language == 'CPP'){
            const response = await runCpp(this.payload[key].code, this.payload[key].inputCase);
            console.log('Evaluated response is', response);
            
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
