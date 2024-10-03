import express, { Router } from 'express';
import { addSubmission } from '../../controllers/submissionController';
import { createSubmissionZodSchema } from '../../dtos/CreateSubmissionDto';
import { validate } from '../../validators/zodValidators';


const submissionRouter:Router = express.Router();

submissionRouter.post(
    '/', 
    validate(createSubmissionZodSchema),
    addSubmission
    );

export default submissionRouter;