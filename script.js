
document.addEventListener('DOMContentLoaded', () => {

  const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
    focusableElements: 'img',
    centeredSlides: true,


    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  let popup = new Popup({
      setGrabListenerOn: '.swiper-slide img'
    }
  );
})
