const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const faculties = require('./faculties');
const Doc = require('./documents');
const Buffer = require('buffer').Buffer;
const fs = require('fs');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

//FILL DB CONNECTION
const dbRoute = 'mongodb+srv://<user>:<login>@cluster0-a6xbk.mongodb.net/test?retryWrites=true&w=majority';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

mongoose.connect(dbRoute, {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;

db.once('open', ()=> console.log('connected'));
db.on('error', ()=>console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Получить факультеты
router.get('/getFaculties', (request, response)=>{
    return response.json(faculties);
});

//Получить документы
router.get('/getDocuments/:faculty/:discipline', (request, response)=>{
    let faculty = request.params.faculty;
   let discipline = request.params.discipline;

    Doc.find({discipline: discipline, faculty: faculty})
        .select('_id title authors year')
        .then(data=> response.json({success: true, documents: data}))
        .catch(err=>response.json({success: false, error: err}))
});

//загрузить документ
router.post('/uploadDocument', upload.single('file'), (request, response)=>{
    let uploadedFile = fs.readFileSync(request.file.path);
    let doc = new Doc();

    doc.mimeType = request.file.mimetype;
    doc.binary = uploadedFile;
    doc.title = request.body.title;
    doc.authors = request.body.authors;
    doc.year = request.body.year;
    doc.discipline = request.body.discipline;
    doc.faculty = request.body.faculty;
    doc.save()
        .then((resp)=>response.json({success: true, id: resp._id}))
        .catch(err=>response.json({success: false, error: err}))
        .finally(()=>fs.unlink(request.file.path).then(console.log('deleted' + doc.name)))
});


//скачать документ
router.get('/download/:id', (requst, response)=>{
    const id = requst.params.id;
    Doc.findById(id)
        .then(doc=>{
            response.contentType(doc.mimeType);
            response.setHeader('Content-Disposition','attachment; filename="'+doc.title+'"');
            response.send(doc.binary);
        })
        .catch(err=>response.json({success: false, error: err}))
});

//удалить документ
router.delete('/delete', (request, response)=>{
    const id = request.body.id;
    console.log(id);
    Doc.deleteOne({_id:id})
        .then((resp)=>{
            if(resp.deletedCount !== 0)
                response.json({success: true, resp: resp});
            else
                response.json({success: false});
        })
        .catch(err=>response.json({success: false, error: err}))
});

app.use('/api', router);
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));




