const readLine = require('readline-sync');

function start(){
  const content = {}

  content.searchTerm = askAndReturnSearchTerm();
  content.searchPrefix = askAndReturnPrefix();

  function askAndReturnSearchTerm(){
    return readLine.question('Qual termo pesquisar ? ');
  }

  function askAndReturnPrefix(){
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex =  readLine.keyInSelect(prefixes,'Choose a option ');
    const selectedPrefixText = prefixes[selectedPrefixIndex];

    return selectedPrefixText;
  }

  console.log(content);
}

start();
