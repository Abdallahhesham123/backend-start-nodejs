import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from "fs";
//for image

export const fileValidation ={
    image:["image/jpeg" , "image/png" , "image/gif","image/jpg"],
    file:["application/pdf","application/msword"]
}
export function fileupload(customValidation=[]){
    const fullpath= path.join(__dirname, "../../public/images/bookstore/")

    if(!fs.existsSync(fullpath)){
        fs.mkdirSync(fullpath,{recursive:true});
    
    }
  
 
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, fullpath);
        },
        filename: (req, file, cb) => {
          cb(null, req.body.name);
        //   console.log(req.body.data.path);
        },
      });

      function fileFilter(req,file, cb) {
        if(customValidation.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb("in-Valid format",false)
        }

  }

      const upload = multer({dest:"public",fileFilter,storage})

      return upload;
}
