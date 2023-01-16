import { Router } from 'express';
import { queryAllNationalIdentities, createNationalIdentity, queryNationalIdentity, updateNationalIdentity, deleteNationalIdentity, NationalIdentityExists } from '../controllers/NIDControllers';
import auth from '../middlewares/auth';
const NIDRouter = Router();

NIDRouter.get("/", auth, queryAllNationalIdentities)
NIDRouter.post("/", auth, createNationalIdentity)
NIDRouter.get("/:NIN", auth, queryNationalIdentity)
NIDRouter.get("/check/:NIN", NationalIdentityExists)
NIDRouter.put("/:NIN", auth, updateNationalIdentity)
NIDRouter.delete("/:NIN", auth, deleteNationalIdentity)


export default NIDRouter;