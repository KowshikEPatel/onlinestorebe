require('dotenv').config()
const express  =  require("express")
const cors = require('cors')
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const {GridFsStorage} = require("multer-gridfs-storage");
const Grid = require('gridfs-stream');
const crypto = require('crypto');
app.use(express.json());
app.use(cors());
const dbURL = process.env.DB_URL;
const port = process.env.PORT||8000;

const conn = mongoose.createConnection(dbURL,{useNewUrlParser: true, useUnifiedTopology: true})
let gfs;
conn.once('open',()=>{
    gfs = Grid(conn.db,mongoose.mongo);
    gfs.collection('images');
})
const storage = new GridFsStorage({
  url:dbURL,
  file:(req,file)=>{
      return new Promise((resolve,reject) =>{
          crypto.randomBytes(16, async(err,buf)=>{

              if(err){
                  return reject(err);
              }
              const filename = buf.toString('hex') + path.extname(file.originalname);
              const fileInfo = {
                  filename:filename,
                  bucketName:'images'
              };
              req.setfilename = filename;
              resolve(fileInfo);
          })
      })
  }
})
const upload = multer({storage})

app.post("/upload", upload.single("file"), (req, res) => {
console.log(req.setfilename);
res.status(200).json({"message":"File has been uploaded","filename":req.setfilename});
});

app.get('/files',(req,res)=>{

    gfs.files.find().toArray((err,files)=>{
        if(!files||files.length ===0){
            return res.status(404).json({
                err:'No files exist'
            })
        }
        return res.json(files)
    })

})

app.get('/image/:filename',(req,res)=>{

    gfs.files.findOne({filename:req.params.filename},(err,file)=>{
        
        if(err){
            console.log(err);
        }

        if(!file||file.length ===0){
            return res.status(404).json({
                err:'No file exist'
            })
        }
        console.log(file)
        //check if image
        if(file.contentType ==='image/jpeg'||file.contentType === 'image/png'){
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res)
        } else {
            res.status(404).json({
                error:"not an image"
            });
        }
    })

})

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Database connnected"))
  .catch((err) => console.log(err));

  const userRoute = require("./routes/users");
  const productRoute = require("./routes/products");
  const billRoute = require("./routes/bills");
 
  app.use("/users", userRoute);
  app.use("/products", productRoute);
  app.use("/bills", billRoute);

  app.listen(port, () => {
    console.log("Server is running on port",port);
  });