function goBack() { return window.history.back(); }

function loader() {
  const loader = document.getElementById(`loader`);
  return loader.style.display = `none`;
}

const btt = document.querySelector(`.back-to-top`);
if (btt) {
  window.onscroll = e => {
    if (e.pageYOffset > 200) btt.classList.add(`show-btt`);
    if (e.pageYOffset < 200) btt.classList.remove(`show-btt`);
  };
}

const formLoad = document.querySelector(`form`);
if (formLoad) {
  formLoad.onsubmit = () => {
    setTimeout(() => {
      formLoad.innerHTML = `<div style="display:flex; justify-content:center; align-items: center;"><div uk-spinner="ratio: 3;"></div><div>`;
    }, 200);
  }
}

window.onload = () => {
  console.log(`Running!`);

  loader();

  let searchDiv = document.querySelector(`[href='#search-modal']`);
  if (searchDiv) searchDiv.focus();
};