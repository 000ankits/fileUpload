const express = require('express'),
	mongoose = require('mongoose'),
	multer = require('multer'),
	bodyParser = require('body-parser'),
	image = require('./models/images'),
	dotEnv = require('dotenv'),
	request = require('request'),
	imageType = require('image-type'),
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
		res.redirect('/gallery');
	}
});

// ==================================

app.get('/link', (req, res) => res.render('link'));

app.post('/link', (req, res) => {
	let imgUrl = req.body.url;
	let imgBuffer = request({ uri: imgUrl, encoding: null }, (err, res, buff) => {
		if (err) res.send('err');
		return buff;
	});
	// let imgType = imageType(imgBuffer).mime;
	console.log(imgBuffer);
	res.send(imgBuffer);
});

app.get('/hidden/:imgId', (req, res) => {
	image.findById(req.params.imgId, (err, foundImage) => {
		if (err) res.send(err);
		res.contentType(foundImage.type);
		res.send(foundImage.data);
	});
});

app.get('/gallery', (req, res) => {
	image.find({}, (err, foundImage) => {
		if (err) {
			console.log(err);
			res.send('Error occured');
		}
		console.log('Serving Image');
		res.render('showImage', { images: foundImage });
	});
});

app.listen(port, () => console.log('Server started on ', port, '...'));
