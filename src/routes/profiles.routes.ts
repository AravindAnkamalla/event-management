import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { getProfileDetails, updateUser } from "../controllers/user/profile.controller";

const profilesRoutes: Router = Router();
profilesRoutes.get('/', authenticate,authorize, getProfileDetails);
profilesRoutes.post('/update', authenticate, authorize, updateUser); 
export default profilesRoutes;