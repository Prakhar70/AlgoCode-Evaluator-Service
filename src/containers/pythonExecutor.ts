import createContainer from "./containerFactory";
import { PYTHON_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";


class PythonExecutor implements CodeExecutorStrategy {
  async execute(code: string, inputTestCase: string,outputTestCase:string):Promise<ExecutionResponse> {
    const rawLogBuffer: Buffer[] = [];
    console.log(code,inputTestCase,outputTestCase);
    
    const runCommand = `echo '${code.replace(
      /'/g,
      `'\\"`
    )}' > test.py && echo '${inputTestCase.replace(
      /'/g,
      `'\\"`
    )}' | python3 test.py`;
    console.log(runCommand);
    await pullImage(PYTHON_IMAGE);
    console.log("intialisting a new python docker container");
    //const pythonDockerContainer=await createContainer(PYTHON_IMAGE,['python3','-c',code,'stty -echo']);
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
      `/bin/sh`,
      `-c`,
      runCommand,
    ]);
    await pythonDockerContainer.start();

    console.log("started the docker conatiner");

    const loggerStream = await pythonDockerContainer.logs({
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
        await pythonDockerContainer.remove();
    }
  }
  fetchDecodeStream(loggerStream:NodeJS.ReadableStream, rawLogBuffer:Buffer[]):Promise<string>{
    
    //TODO: Moved to docker helper util
    return new Promise((res, rej) => {
      const timeout = setTimeout(()=>{
        console.log("Timeout called");
        rej('TLE');
      },2000);
        loggerStream.on("end", () => {
          //This callback execute when stream ends
          clearTimeout(timeout);
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

export default PythonExecutor;
