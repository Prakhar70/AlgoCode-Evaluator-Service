// import Docker from 'dockerode';

import createContainer from './containerFactory';
import { CPP_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';

//TODO: Migrate to strategy design pattern
async function runCpp(code:string, inputTestCase:string){

    const rawLogBuffer:Buffer[] = [];
     
    console.log("intialisting a new cpp docker container");
    await pullImage(CPP_IMAGE);
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;
    console.log(runCommand);

    //const pythonDockerContainer=await createContainer(PYTHON_IMAGE,['python3','-c',code,'stty -echo']);
    const cppDockerContainer=await createContainer(CPP_IMAGE,[
        `/bin/sh`,
        `-c`,
        runCommand
    ]);
    await cppDockerContainer.start();

    console.log('started the docker conatiner');
    
    const loggerStream = await cppDockerContainer.logs({
        stderr:true,
        stdout:true,
        timestamps:false,
        follow:true // wheather logs are streamed or returned as string
    });

    loggerStream.on('data',(chunk)=>{
        rawLogBuffer.push(chunk);
    });

    const response = await new Promise ((res)=>{
        loggerStream.on('end',()=>{
        console.log(rawLogBuffer);
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        console.log(decodedStream);
        res(decodedStream);
        });
        
    });

    //removing container when done with it
    await cppDockerContainer.remove();
    return response;

}
export default runCpp;