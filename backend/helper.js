const leoProfanity = require('leo-profanity');

function getFilter() {
  leoProfanity.loadDictionary(); 
  leoProfanity.add(['damn', 'hell', 'crap', 'idiot', 'stupid'])
  
  return {
    clean: (text) => {
      return text.split(' ').map(word => {
        if (leoProfanity.check(word)) {
          return word[0] + '*'.repeat(word.length - 1); // Keep first letter, mask the rest
        }
        return word;
      }).join(' ');
    }
  };
}

module.exports = { getFilter };
