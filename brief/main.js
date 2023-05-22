var express = require('express');
const gpt = require('./gpt.js');
const news = require('./news.js');
const app = express();
const port = 3000;
var fs = require('fs');
 


async function main() {
    app.listen(port, () => {
        console.log(`Brief server listening at http://localhost:${port}`)
    });
    // serves the homepage when the / endpoint is accessed.
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });

    // numArticles is the number of articles to be summarised.
    // gets the text from articles from the google news rss feed and puts them in a list called articles.
    const numArticles = 5;
    let info = await news.getArticles(numArticles);
    var articles = info.articles;
    var titles = info.titles;

    var text = "";
    for (var i = 0; i < articles.length; i++) {
        text = text + "\n \n" + /*titles[i] + ": \n " + */await gpt.summarise(articles[i]);
        var percentage = Math.round(((i + 1) / articles.length) * 100).toString() + "%";
        console.log(percentage + "\n")
    }
    text = await gpt.summariseSummaries(text) + "\n \n" + text;


    // writes a text file with the summarised texts from the articles.
    fs.writeFile('Your Brief.txt', text, function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });

    // -- send response to webclient that the request was successful or unsuccessful. --
};

try {
    main();
} catch (err) {
    console.log(err);
}

