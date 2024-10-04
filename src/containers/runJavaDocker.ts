// import Docker from 'dockerode';

import createContainer from './containerFactory';
import { JAVA_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';


async function runJava(code:string, inputTestCase:string){

    const rawLogBuffer:Buffer[] = [];
     
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
    console.log(runCommand);
    await pullImage(JAVA_IMAGE);
    console.log("intialisting a new java docker container");
    //const pythonDockerContainer=await createContainer(PYTHON_IMAGE,['python3','-c',code,'stty -echo']);
    const javaDockerContainer=await createContainer(JAVA_IMAGE,[
        `/bin/sh`,
        `-c`,
        runCommand
    ]);
    await javaDockerContainer.start();

    console.log('started the docker conatiner');
    
    const loggerStream = await javaDockerContainer.logs({
        stderr:true,
        stdout:true,
        timestamps:false,
        follow:true // wheather logs are streamed or returned as string
    });

    loggerStream.on('data',(chunk)=>{
        rawLogBuffer.push(chunk);
    });

    await new Promise ((res)=>{
        loggerStream.on('end',()=>{
        console.log(rawLogBuffer);
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        console.log(decodedStream);
        res(decodeDockerStream);
        });
        
    });

    //removing container when done with it
    await javaDockerContainer.remove();
    return javaDockerContainer;

}
export default runJava;