const algorithmia = require('algorithmia');
const apiKey = require('../credentials/credentials.json').apiKey;
const sentenceBoundaryDetection = require('sbd');

async function robot(content){
  await fetchContentFromSource(content)
  sanitizeContent(content)
  breakContentIntoSentences(content)

  async function fetchContentFromSource(content){
    const algorithmiaAuthenticate = algorithmia(apiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticate.algo('web/WikipediaParser/0.1.2?timeout=300')
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
    const wikipediaContent =  wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;

  }

  function sanitizeContent(content){
    const withoutBlankLines = removeBlankLinesAndMarkDown(content.sourceContentOriginal);
    const withoutDateInParentheses = removeDateInParentheses(withoutBlankLines);

    content.sourceContentSanitialized = withoutDateInParentheses;

    // console.log(withoutDateInParentheses);

    function removeBlankLinesAndMarkDown(text){
      const allLines = text.split('\n');

      const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
        if(line.trim().length === 0 || line.trim().startsWith('=')){
          return false
        }
        return true
      });
      return withoutBlankLinesAndMarkdown.join(' ');
    }




    //Essa função precisa ser melhorada
    function removeDateInParentheses(text){
      return text.replace(/(\d\d?)\/(\d\d??)\/(\d\d\d\d)/g);
    }

  }
  function breakContentIntoSentences(content) {
    content.sentences = [];

    const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitialized);
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: []
      })
    })
  }
}

module.exports = robot;
