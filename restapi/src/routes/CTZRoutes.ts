import { Router } from 'express';
import { queryAllCitizenships, createCitizenship, queryCitizenshipByNIN, updateCitizenship, deleteCitizenship, checkIfCitizenshipExists, getLastUpdatedDate } from '../controllers/CTZControllers';
import auth from '../middlewares/auth';
const CTZRouter = Router();

CTZRouter.get("/", auth, queryAllCitizenships)
CTZRouter.post("/", auth, createCitizenship)
CTZRouter.get("/:NIN", auth, queryCitizenshipByNIN)
CTZRouter.get("/check/:NIN", checkIfCitizenshipExists)
CTZRouter.get("/last-updated-date/:NIN", getLastUpdatedDate)
CTZRouter.put("/:NIN", auth, updateCitizenship)
CTZRouter.delete("/:NIN", auth, deleteCitizenship)


export default CTZRouter;