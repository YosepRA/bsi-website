const en = require('../data/languages/en.js');
const id = require('../data/languages/id.js');
const kr = require('../data/languages/kr.js');

const dictionary = { en, id, kr };

// Find the correct dictionary according to current language.
function lang(req, res, next) {
  const { lang } = req.params;
  const langData = {
    lang,
    data: dictionary[lang],
  };

  if (req.data) {
    req.data.lang = langData;
  } else {
    req.data = {
      lang: langData,
    };
  }

  next();
}

module.exports = {
  lang,
};
