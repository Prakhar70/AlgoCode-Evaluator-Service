import Docker from "dockerode";

async function createContainer(imageName:string, cmdExecutable: string[]){
    const docker = new Docker();
    const container = await docker.createContainer({
        Image : imageName,
        Cmd: cmdExecutable,
        AttachStderr:true, // to enable error streams
        AttachStdin:true, // to enable input streams
        AttachStdout:true,// to enable output streams
        Tty : false, 
        HostConfig:{
            Memory:1024*1024*1024, //1 GB
        },
        OpenStdin:true// keep the input stream open even no interaction is ther

    });
    return container;
    
}
export default createContainer;