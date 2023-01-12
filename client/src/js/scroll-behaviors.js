function navbarScroll(navbar) {
  let prevDirection = '';

  return function navbarScrollFunction({ direction }) {
    if (prevDirection === direction) return undefined;

    if (direction === 'down') {
      navbar.classList.add('scroll');
    } else {
      navbar.classList.remove('scroll');
    }

    prevDirection = direction;

    return undefined;
  };
}

function floatingButtonScroll(floatingButton) {
  let prevDirection = '';

  return function floatingButtonScroll({ direction }) {
    if (prevDirection === direction) return undefined;

    if (direction === 'down') {
      floatingButton.classList.add('scroll');
    } else {
      floatingButton.classList.remove('scroll');
    }

    prevDirection = direction;

    return undefined;
  };
}

export { navbarScroll, floatingButtonScroll };
