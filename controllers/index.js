module.exports = {
  index(req, res) {
    const { lang } = req.data;

    res.render('index-v2', { ...lang, currentPage: 'home' });
  },
  bsi(req, res) {
    const { lang } = req.data;

    res.render('bsi', { ...lang, currentPage: 'bsi' });
  },
  service(req, res) {
    const { lang } = req.data;

    res.render('service', { ...lang, currentPage: 'service' });
  },
  about(req, res) {
    const { lang } = req.data;

    res.render('about', { ...lang, currentPage: 'about' });
  },
  contact(req, res) {
    const { lang } = req.data;

    res.render('contact', { ...lang, currentPage: 'contact' });
  },
  exchange(req, res) {
    const { lang } = req.data;

    res.render('exchange', { ...lang, currentPage: 'exchange' });
  },
};
