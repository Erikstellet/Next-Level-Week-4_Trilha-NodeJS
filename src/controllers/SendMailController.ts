import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import sendMailService from "../services/SendMailService";
import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppErrors";

class SendMailController
{
    async execute(request: Request, response: Response)
    {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email });

        if(!user)
        {
            throw new AppError("User does not exists!");
        }

        const survey = await surveysRepository.findOne({ id: survey_id })

        if(!survey)
        {
            throw new AppError("Survey does not exists!");
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        
        const surveyUserAlreadyExists = await surveysUsersRepository.findOne
        ({
            where: [{ user_id: user.id, value: null }],
            relations: ["user", "survey"]
        })
        
        const variables = 
        {
            name: user.name,
            name_title: survey.name,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL,
        };

        if(surveyUserAlreadyExists)
        {
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.name, variables, npsPath);

            return response.json(surveyUserAlreadyExists);
        }

        const surveyUser =  surveysUsersRepository.create
        ({
            user_id: user.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser);
        variables.id = surveyUser.id;

        await sendMailService.execute(email, survey.name, variables, npsPath);

        return response.json(surveyUser)
    }
}

export { SendMailController }