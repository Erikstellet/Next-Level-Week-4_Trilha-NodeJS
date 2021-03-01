import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppErrors";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController
{
    // http://localhost:3333/answers/1?u=94f9cbda-0f04-4d70-99e1-0c67c881a0ca
    /*
        Route Params => Parâmetros que compôe a rota.
            - routes.get("/answers/:value")

        Query Params => Busca, paginação e não obrigatórios.
            - key=value
            - ?
    */

    async execute(request: Request, response: Response)
    {
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne
        ({
            id: String(u),
        });

        if(!surveyUser)
        {
            throw new AppError("Survey User does not exists!")
        }

        surveyUser.value = Number(value);
        await surveysUsersRepository.save(surveyUser)

        return response.status(200).json(surveyUser);
    }
}

export { AnswerController }