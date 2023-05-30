const daysSpan = document.querySelector('.panel__datetime-timer__digit-days');
const hoursSpan = document.querySelector('.panel__datetime-timer__digit-hours');
const minutesSpan = document.querySelector(
  '.panel__datetime-timer__digit-minutes',
);
const secondsSpan = document.querySelector(
  '.panel__datetime-timer__digit-seconds',
);

class Countdown {
  constructor(countDownDate) {
    this.countDownDate = countDownDate;

    this.days = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  render() {
    daysSpan.textContent = this.days;
    hoursSpan.textContent = this.hours;
    minutesSpan.textContent = this.minutes;
    secondsSpan.textContent = this.seconds;
  }

  updateTime() {
    const now = new Date().getTime();
    const distance = this.countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;

    this.render();
  }

  startTimer() {
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }
}

export default Countdown;
