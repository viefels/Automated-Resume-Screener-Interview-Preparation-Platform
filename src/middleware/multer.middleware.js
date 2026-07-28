import multer from "multer";
import path from "node:path";


export class ValidationError extends Error{
    constructor(message){
        super(message);
        this.name = "ValidationError"
    }
}

const storageOptions = {
    destination: function (req, file, cb){
        cb(null, path.join(import.meta.dirname, "../uploads"))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
}

const fileFilterOptions = (req, file, cb) => {
    const allowedExt = ['.pdf', '.docx'];
    const extName = path.extname(file.originalname).toLowerCase();
    if(allowedExt.includes(extName)){
        cb(null,true);
    }
    else{
        cb(new ValidationError(`File type not supported, Only ${allowedExt.join(", ")} are allowed`), false);
    }
}

const storage = multer.diskStorage(storageOptions);

const multerOptions = {
    storage: storage,
    fileFilter: fileFilterOptions,
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
}

const upload = multer(multerOptions);
export default upload;
