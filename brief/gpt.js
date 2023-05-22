const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({ apiKey: process.env.OPEN_AI_KEY, });
const openai = new OpenAIApi(configuration);


async function summarise(article) {
    const response = await openai.createCompletion({
        "model": "text-davinci-002",
        "prompt": await "summarise the following article into a single paragraph that sums up the news article with no reference to the original article or the fact that it is a summary such as 'the article refers to' etc \n" + article,
        "max_tokens": 400,
        "temperature": 0.5,
        "top_p": 1,
        "n": 1,
        "stream": false,
        "logprobs": null,
        "stop": ""
    });
    return response.data.choices[0].text;
}

async function summariseSummaries(summaries) {
    const response = await openai.createCompletion({
        "model": "text-davinci-002",
        "prompt": await "summarise all the following paragraphs into one single cohesive introductory sentence introducing each paragraph as a short headline separated by commas in the tone of a playful, not too serious news anchor. Starting the paragraph with 'Today in the news'... \n" + summaries,
        "max_tokens": 1000,
        "temperature": 0.5,
        "top_p": 1,
        "n": 1,
        "stream": false,
        "logprobs": null,
        "stop": ""
    });
    return response.data.choices[0].text;
}






module.exports = { summarise, summariseSummaries };