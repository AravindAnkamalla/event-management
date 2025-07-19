import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { cancelRegistration, registerEvent } from "../controllers/registrations/registration.controller";

const registrationsRoutes: Router = Router();
registrationsRoutes.post('/',authenticate,authorize,registerEvent);
registrationsRoutes.post('/cancel', authenticate, authorize, cancelRegistration);
export default registrationsRoutes;