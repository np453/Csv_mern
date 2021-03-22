const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const Excel = require('exceljs'); 

//Port
const PORT = 1919;

//.env file
dotenv.config();


//Middlewaress
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());



//connect to DB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Database is connected!"));


app.use(express.static('client/build'));

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
// Multer for storing file 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'client/public/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +file.originalname )
    }
  })
  
  const upload = multer({ storage: storage }).single('file');
app.post('/api/csv',upload, async(req,res) =>{
    const wb = new Excel.Workbook();
    const worksheet = await wb.csv.readFile(`./client/public/${req.file.filename}`);
    // console.log(worksheet.actualColumnCount);
    const thead = []
    for(var i=1;i<=worksheet.actualColumnCount;i++){
        thead.push(worksheet.getRow(1).getCell(i).value);
    }
    // console.log(thead)
    const tbody = [];
    for(var i=2;i<=worksheet.actualRowCount;i++){
        tbody[i-2]=[];
        for(var j=1;j<=worksheet.actualColumnCount;j++){
            tbody[i-2].push(worksheet.getRow(i).getCell(j).value);
        }
        
    }
    // console.log(tbody);
    const csv_data = [thead,tbody];
    // console.log(csv_data);
    res.send(csv_data);
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(PORT, function() {
    console.log(`App running on port ${PORT}`);
}); 