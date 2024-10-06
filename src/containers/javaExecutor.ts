// import Docker from 'dockerode';

import createContainer from "./containerFactory";
import { JAVA_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";
import CodeExecutorStrategy, {
  ExecutionResponse,
} from "../types/CodeExecutorStrategy";

class JavaExecutor implements CodeExecutorStrategy {
  async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
    const rawLogBuffer: Buffer[] = [];

    const runCommand = `echo '${code.replace(
      /'/g,
      `'\\"`
    )}' > Main.java && javac Main.java && echo '${inputTestCase.replace(
      /'/g,
      `'\\"`
    )}' | java Main`;
    
    await pullImage(JAVA_IMAGE);

    console.log("intialisting a new java docker container");

    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
      `/bin/sh`,
      `-c`,
      runCommand,
    ]);

    await javaDockerContainer.start();

    const loggerStream = await javaDockerContainer.logs({
      stderr: true,
      stdout: true,
      timestamps: false,
      follow: true, // wheather logs are streamed or returned as string
    });

    loggerStream.on("data", (chunk) => {
      rawLogBuffer.push(chunk);
    });

    try{
        const codeResponse:string = await this.fetchDecodeStream(loggerStream, rawLogBuffer);
        return {output:codeResponse, status:"COMPLETED"};    
    }catch(error){
        return {output:error as string, status:"ERROR"};
    }finally{
        await javaDockerContainer.remove();
    }
  }
  fetchDecodeStream(loggerStream:NodeJS.ReadableStream, rawLogBuffer:Buffer[]):Promise<string>{

    //TODO: Moved to docker helper util
    return new Promise((res, rej) => {
        loggerStream.on("end", () => {
          console.log(rawLogBuffer);
          const completeBuffer = Buffer.concat(rawLogBuffer);
          const decodedStream = decodeDockerStream(completeBuffer);
          console.log(decodedStream);
  
          if(decodedStream.stderr){
              rej(decodedStream.stderr);
          }else{
              res(decodedStream.stdout);
          }
        });
      });
  }
}

export default JavaExecutor;
