import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

export default function decodeDockerStream (buffer: Buffer): DockerStreamOutput{

    let offset:number = 0;//This variable keeps track of current position int the buffer while parsing
    console.log(buffer.toString());
    //The output that will store the accumulated stdout and stderr output as strings
    const output: DockerStreamOutput= {stdout:'', stderr:''};

    //Loop until the offset reacher the end of bufffer
    while(offset < buffer.length){

        // typeOfStream is read from buffer and has the value of type of stream
        const typeOfStream = buffer[offset];

        //This length variable hold the length of the value
        // We will read this variable on an offset of 4 bytes from the start of chunk
        const length = buffer.readUInt32BE(offset + 4);

        //as now we have read the header, we can move forward to the value of chunk
        offset += DOCKER_STREAM_HEADER_SIZE;

        if(typeOfStream == 1){
            output.stdout += buffer.toString('utf-8', offset, offset+length);
        }else if(typeOfStream == 2){
            output.stderr += buffer.toString('utf-8', offset, offset+length);
        }

        offset += length;
    }
    return output;

}