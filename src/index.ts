import express, {Express} from 'express';
import serverConfig from './config/serverConfig';
import apiRouter from './routes/v1';

const app:Express = express();

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, ()=>{
    console.log(`server started at *:${serverConfig.PORT}`);
    console.log("wooow ");
})