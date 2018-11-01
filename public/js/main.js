function goBack() { return window.history.back(); }

window.onload = () => {
  console.log(`Running!`);

  let searchDiv = document.querySelector(`[href='#search-modal']`);
  if(searchDiv) searchDiv.focus();
};