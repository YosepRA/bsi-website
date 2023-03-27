const aboutBSI = document.querySelector('.about-bsi');
const aboutBSIInfo = aboutBSI.querySelector('.about-bsi__info');
const tokenCol = aboutBSI.querySelector('.about-bsi__col--token');
const infoCol = aboutBSI.querySelector('.about-bsi__col--info');

class AboutBSI {
  constructor() {
    // If false, show short content.
    this.show = false;

    this.contentShort = [
      'BSI Token is a partner of the 29th Dream Concert, and the BSI project is an eco-friendly project that is part of its plan to create eco-friendly performances without paper tickets, and it is agreed to work with Dream Concert every year in the future.',
      'Dream Concert is in its 29th year and is famous for being the largest among KPOP concerts.This Dream Concert will be held as a concert for...',
    ];
    this.contentLong = ['', '', '', ''];

    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }

  render() {
    const title = document.createElement('h2');
  }

  handleShow() {
    tokenCol.classList.replace('col-lg-5', 'col-lg-12');

    this.show = true;
  }

  handleHide() {
    tokenCol.classList.replace('col-lg-7', 'col-lg-12');

    this.show = false;
  }
}

export default AboutBSI;
