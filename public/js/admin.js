const adminJS = document.querySelector(`script[src='/js/admin.js']`),
      axiosJS = document.createElement(`script`);
axiosJS.src = `https://unpkg.com/axios/dist/axios.min.js`;
document.body.insertBefore(axiosJS, adminJS);

window.onload = () => {
  console.log(`Running admin.js`);

  loader();

  addEventListener(`submit`, onSubmit);
  addEventListener(`click`, onDelete);

  function onSubmit(e) {
    e.preventDefault();
    createNew(e);
    getResults(e);
    updateResults(e);
  }
  function onDelete(e) {
    deleteResult(e);
  }
};

function createNew(e) {
  if (e.target.id === `create-offer`) {
    let inputs = e.target,
        obj    = {};
    
    for (let i = 0; i < inputs.length - 1; i++) obj[inputs[i].name] = inputs[i].value; // To place the keys and values in obj
    
    axios .post(`${window.location.href}/create?${e.target[1].name}=${e.target[1].value}`, obj)
          .then(() => {
            for (let i = 0; i < inputs.length - 1; i++) inputs[i].value = ``;
            e.target.parentNode.previousElementSibling.onclick = () => {
              UIkit.notification({
                message: `<span uk-icon=\'icon: check\'></span> Offer Created`,
                status:  `success`,
                pos:     `top-center`,
                timeout: 3000
              });
            };
            e.target.parentNode.previousElementSibling.click();
          });
  }
}

function getResults(e) {
  if (e.target.id === `search-offer`) {
    axios .get(`${window.location.href}/search?${e.target[0].name}=${e.target[0].value}`)
          .then(search => {
            const container = document.getElementById(`offer-results`);
            container.innerHTML = ``;
            let onlyOffers = search.data.filter(item => typeof item === `object`),
                html       = search.data.filter(item => typeof item === `string`);

            if (typeof search.data[0] === `object`) {
              onlyOffers.forEach(offer => {

                function formatDate(date) {
                  let d = new Date(date),
                      month = '' + (d.getMonth() + 1),
                      day = '' + d.getDate(),
                      year = d.getFullYear();
              
                  if (month.length < 2) month = '0' + month;
                  if (day.length < 2) day = '0' + day;
              
                  return [year, month, day].join('-');
                }

                offer.validity = formatDate(offer.validity);
                container.insertAdjacentHTML(`beforeend`, eval('`'+html[1]+'`'));
              });
            } else {
              container.insertAdjacentHTML(`beforeend`, html[0]);
            }
          });
  }
  if (e.target.id === `search-product`) {
    axios .get(`${window.location.href}/search?${e.target[0].name}=${e.target[0].value}`)
          .then(search => {
            const container = document.getElementById(`product-results`);
            container.innerHTML = ``;
            let onlyProducts = search.data.filter(item => typeof item === `object`),
                html         = search.data.filter(item => typeof item === `string`);

            if (typeof search.data[0] === `object`) {
              onlyProducts.forEach(product => {
                container.insertAdjacentHTML(`beforeend`, eval('`'+html[1]+'`'));
              });
            } else {
              container.insertAdjacentHTML(`beforeend`, html[0]);
            }
          });
  }
  if (e.target.id === `search-user`) {
    axios .get(`${window.location.href}/search?${e.target[0].name}=${e.target[0].value}`)
          .then(search => {
            const container = document.getElementById(`user-results`);
            container.innerHTML = ``;
            let onlyUsers = search.data.filter(item => typeof item === `object`),
                html      = search.data.filter(item => typeof item === `string`);

            if (typeof search.data[0] === `object`) {
              onlyUsers.forEach(user => {
                container.insertAdjacentHTML(`beforeend`, eval('`'+html[1]+'`'));
              });
            } else {
              container.insertAdjacentHTML(`beforeend`, html[0]);
            }
          });
  }
}

function updateResults(e) {
  if (e.target.id === `update-user`) {
    let inputs = e.target,
        obj    = {};

    for (let i = 0; i < inputs.length - 1; i++) {
      if (inputs[i].name === `age` && inputs[i].value === ``) inputs[i].value = 0;
      obj[inputs[i].name] = inputs[i].value; // To place the keys and values in obj
    }

    axios .patch(`${window.location.href}/update?${e.target[1].name}=${e.target[1].value}`, obj)
          .then(result => {
            let form   = e.target,
                user   = result.data;

            (async function resetValues(form) {
              for (let i = 0; i < 7; i++) form[i].value = ``;

              await setTimeout(() => {
                for (let i = 0; i < 7; i++) {
                  form[i].value       = user[form[i].name];
                  form[i].placeholder = user[form[i].name];
                  if (form[i].name === `age` && form[i].value === ``) form[i].value = 0;
                }
              },100);
            })(form);
            (async function userUpdateOK(form) {
              form[8].classList = `updated`;
              form[8].innerText = `Updated`;
              form[8].onclick = (function notifUserUpdateOK() {
                UIkit.notification({
                  message: `<span uk-icon=\'icon: check\'></span> User Updated`,
                  status:  `success`,
                  pos:     `top-center`,
                  timeout: 3000
                });
              })();
              await setTimeout(()=> {
                form[8].classList = ``;
                form[8].innerText = `Update`;
              }, 1701);
            })(form);
          })
          .catch(err => {
            let form = e.target;
            form[8].classList = `error-update`;
            form[8].innerText = `Error`;
            form[8].onclick = (function notifUserUpdateError() {
              UIkit.notification({
                message: `<span uk-icon=\'icon: ban\'></span> Try again`,
                status:  `danger`,
                pos:     `top-center`,
                timeout: 3000
              });
            })();
          });
  }
}

function deleteResult(e) {
  if (e.target.dataset.event === `delete`) {
    let btn   = e.target,
        cards = e.target.parentNode.parentNode.parentNode.parentNode.parentNode,
        card  = e.target.parentNode.parentNode.parentNode.parentNode;
    
    axios .delete(e.target.dataset.click)
          .then(() => {
            cards.removeChild(card);
            btn.onclick = (function notifUserDeleteOK() {
              UIkit.notification({
                message: `<span uk-icon=\'icon: check\'></span> User deleted`,
                status:  `success`,
                pos:     `top-center`,
                timeout: 3000
              });
            })();
          })
          .catch(err => {
            btn.classList = `error-delete`;
            btn.innerText = `Error`;
            btn.onclick = (function notifUserDeleteError() {
              UIkit.notification({
                message: `<span uk-icon=\'icon: ban\'></span> Try again`,
                status:  `danger`,
                pos:     `top-center`,
                timeout: 3000
              });
            })();
          });
  }
}