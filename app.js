const express = require('express'),
	mongoose = require('mongoose'),
	multer = require('multer'),
	bodyParser = require('body-parser'),
	image = require('./models/images'),
	dotEnv = require('dotenv'),
	app = express();

dotEnv.config({ path: './.env' });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(process.env.DBURL, {
	useNewUrlParser    : true,
	useUnifiedTopology : true
});
const port = process.env.PORT || 8888;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => res.render('index'));

app.get('/upload', (req, res) => res.render('upload'));

app.post('/upload', upload.single('myFile'), (req, res) => {
	if (!req.file) {
		req.send('No Images Found!');
	} else {
		let img = new image();
		img.data = req.file.buffer;
		img.type = req.file.mimetype;
		img.save();
		res.send('Saved Successfully!');
	}
});

// ==================================

app.get('/link', (req, res) => res.render('link'));

app.post('/link', upload.single('myFile'), (req, res) => {
	res.send(req.file);
});

app.get('/gallery', (req, res) => {
	image.findOne({}, (err, foundImage) => {
		if (err) {
			console.log(err);
			res.send('Error occured');
		}
		let imgdata = new Buffer(foundImage.data).toString('base64');
		res.render('showImage', { images: foundImage, img: imgdata });
	});
});

app.listen(port, () => console.log('Server started on ', port, '...'));
