// Find the correct dictionary according to current language.
function lang(req, res, next) {
  const { lang } = req.params;
  const langData = {
    lang,
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
