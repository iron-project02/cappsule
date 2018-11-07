function goBack() { return window.history.back(); }

window.onload = () => {
  console.log(`Running!`);

  let searchDiv = document.querySelector(`[href='#search-modal']`);
  if (searchDiv) searchDiv.focus();
};

window.onscroll = e => {
  const btt = document.querySelector(`.back-to-top`);
  if (btt) {
    if (e.pageYOffset > 200) btt.classList.add(`show-btt`);
    if (e.pageYOffset < 200) btt.classList.remove(`show-btt`);
  }
};