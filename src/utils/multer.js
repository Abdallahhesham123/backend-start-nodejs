import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid'
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const fileValidation ={
    image:["image/jpeg" , "image/png" , "image/gif","image/jpg"],
    file:["application/pdf","application/msword"]
}
export function fileupload(customPath="general",customValidation=[]){

    const fullpath= path.join(__dirname, `../uploads/${customPath}`)

    if(!fs.existsSync(fullpath)){
        fs.mkdirSync(fullpath,{recursive:true});
    
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, fullpath );
        },
        filename: (req, file, cb) => {
          // console.log({file});
          const SuffixName = nanoid() + "_" + file.originalname
          file.dest= `${customPath}/${SuffixName}`
          cb(null, SuffixName);
        },
      });

      function fileFilter(req,file, cb) {
            if(customValidation.includes(file.mimetype)){
                cb(null,true)
            }else{
                cb("in-Valid format",false)
            }

      }

      const upload = multer({dest:"uploads",fileFilter,storage})

      return upload;

}

