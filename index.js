const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const translate = require('google-translate-api')
const PORT = process.env.PORT || 5000
express()
	.use(morgan('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
	.get('/translate', function(request,response){
		var query = request.query.word;
		var from = 'id';
		var to = 'en';
		if(request.query.from){
			form = request.query.from
		}
		if(request.query.to){
			to = request.query.to
		}
		translate(query, {from: from, to: to}).then(res => {
			var isTranslated = false;
			var initialText = query;
		    var translatedText = res.text.toLowerCase();
		    if(translatedText !== initialText){
		    	isTranslated = true;
		    }
		    var autoCorrected = res.from.text.autoCorrected;
		    var correctedText = res.from.text.value.toLowerCase().replace(/[^\w\s]/gi, '');
		    var didYouMean = res.from.text.didYouMean;

		    response.setHeader('Content-Type', 'application/json');
	    	response.send(JSON.stringify({initialText: initialText, translatedText: translatedText, isTranslated: isTranslated, autoCorrected: autoCorrected, correctedText: correctedText, didYouMean:didYouMean}));

		}).catch(err => {
		    console.error(err);
		});

	})
	.listen(PORT, () => console.log(`Listening on ${ PORT }`))
