import { Router } from 'express';

import { AnswerController } from './src/controllers/AnswerController';
import { NpsController } from './src/controllers/NpsController';
import { SendMailController } from './src/controllers/SendMailController';
import { SurveysController } from './src/controllers/SurveysController';
import { UserController } from './src/controllers/UserController';

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post("/users", userController.create)

router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);

router.post("/sendMail", sendMailController.execute);

router.get("/answers/:value", answerController.execute);
router.get("/nps/:survey_id", npsController.execute);

export { router };