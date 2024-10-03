import {Request, Response} from 'express';
import { CreateSubmissionDto } from '../dtos/CreateSubmissionDto';

export function addSubmission(req:Request, res:Response){
    const submissionDto = req.body as CreateSubmissionDto;

    return res.status(201).json({
        sucess: true,
        error:{},
        message:"Sucessfully collected the submission",
        data: submissionDto
    });
}