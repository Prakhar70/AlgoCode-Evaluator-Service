import { Response, Request, NextFunction } from 'express';
import {ZodSchema} from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate = (schema:ZodSchema<any>) => (req:Request, res:Response, next: NextFunction)=>{
    try{
        schema.parse({
            ... req.body
        });

        next();
    }catch (error){

        console.log(error);
        return res.status(400).json({
            sucess:true,
            message:'Invalid request param recieved',
            data:'error',
            error:error
        });
    }
};