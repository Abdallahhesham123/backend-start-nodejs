import multer from "multer";




export const fileValidation ={
    image:["image/jpeg" , "image/png" , "image/gif","image/jpg"],
    file:["application/pdf","application/msword"]
}
export function fileupload(customValidation=[]){

    const storage = multer.diskStorage({});

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

