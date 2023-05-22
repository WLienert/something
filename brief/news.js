const Parser = require('rss-parser');
const rp = require('request-promise');
const extractor = require('unfluff');
const parser = new Parser();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


async function getNewsInfo(numArticles) {
    let feed = await parser.parseURL('https://www.theage.com.au/rss/technology.xml');
    var news = [];
    var titles = [];
    for (var i = 0; i < numArticles; i++) {
        news[i] = feed.items[i].link;
        titles[i] = feed.items[i].title;

    }
    return {news, titles};
}


async function extract(url) {
    var html = await rp(url);
    var article = extractor(html).text;
    return article;
}

async function getArticles(numArticles) {
    let info = await getNewsInfo(numArticles);
    let urls = info.news;
    let titles = info.titles;
    let articles = [];
    const listLength = urls.length;
    for (var i = 0; i < listLength; i++) {
        articles[i] = await extract(urls[i]);
        if (articles[i].length > 2500)  {
            articles[i] = articles[i].slice(0, 2500);
        }
    }

    return { articles, titles };
}


module.exports = { getNewsInfo, extract, getArticles };