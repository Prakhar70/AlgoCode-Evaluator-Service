import { Response, Request, NextFunction } from 'express'
import {ZodSchema} from 'zod'

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
}