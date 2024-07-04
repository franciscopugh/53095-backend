import { Router } from "express";
import { insertImg } from "../controllers/multerController.js";
import { uploadDocs, uploadProds, uploadPerfs } from "../config/multer.js";

const multerRouter = Router()

multerRouter.post('/profiles', uploadPerfs.single('profile'), insertImg)
multerRouter.post('/docs', uploadDocs.single('doc'), insertImg)
multerRouter.post('/products', uploadProds.single('product'), insertImg)

export default multerRouter