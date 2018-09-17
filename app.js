var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
const translate = require('google-translate-api')
const PORT = process.env.PORT || 5000
express()
	app.use(morgan('dev'))
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: false }))

	app.get('/translate', function(request,response){

		var query = request.query.word;
		translate(query, {from: 'id', to: 'en'}).then(res => {
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

	// app.listen(5000);
	// console.log('Server started on port 3000');
	// module.exports = app;
	app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
