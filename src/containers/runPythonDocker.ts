// import Docker from 'dockerode';

import createContainer from './containerFactory';
import { PYTHON_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';


async function runPython(code:string, inputTestCase:string){

    const rawLogBuffer:Buffer[] = [];
    // eslint-disable-next-line prefer-const
    let runCommand:string = `echo '${code.replace(/'/g,`'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g,`'\\"`)}'} | python3 test.py`;
    console.log(runCommand);
    
    console.log("intialisting a new docker container");
    //const pythonDockerContainer=await createContainer(PYTHON_IMAGE,['python3','-c',code,'stty -echo']);
    const pythonDockerContainer=await createContainer(PYTHON_IMAGE,[
        `/bin/sh`,
        `-c`,
        runCommand
    ]);
    await pythonDockerContainer.start();

    console.log('started the docker conatiner');
    
    const loggerStream = await pythonDockerContainer.logs({
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
    await pythonDockerContainer.remove();
    return pythonDockerContainer;

}
export default runPython;