const adminJS = document.querySelector(`script[src='/js/admin.js']`),
      axiosJS = document.createElement(`script`);
axiosJS.src = `https://unpkg.com/axios/dist/axios.min.js`;
document.body.insertBefore(axiosJS, adminJS);

window.onload = () => {
  console.log(`Running admin.js`);

  addEventListener(`submit`, onSubmit);
  addEventListener(`click`, onDelete);

  function onSubmit(e) {
    e.preventDefault();
    getUsers(e);
    updateUser(e);
  }
  function onDelete(e) {
    deleteUser(e);
  }
};

function getUsers(e) {
  if (e.target.id === `search-user`) {
    axios .get(`${window.location.href}/search?${e.target[0].name}=${e.target[0].value}`)
          .then(search => {
            const container = document.getElementById(`user-results`);
            container.innerHTML = ``;
            search.data.forEach(user => {
              container.insertAdjacentHTML(`beforeend`, `
              <div>
                <div class="result-card uk-card uk-card-default uk-card-small">
                  <div class="uk-card-header">
                    <h4 class="uk-card-title">${user.name}</h4>
                  </div>
                  <form action="${window.location.href}" method="POST" enctype="application/x-www-form-urlencoded" id="update-user" class="uk-card-body">
                    <div class="result-field">
                      <label>Role: </label>
                      <select name="role">
                        <option value="${user.role}" selected disabled>${user.role}</option>
                        <option value="admin">Administrator</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                    <div class="result-field">
                      <label>Phone: </label>
                      <input name="username" value="${user.username}" placeholder="${user.username}" required>
                    </div>
                    <div class="result-field">
                      <label>Email: </label>
                      <input name="email" value="${user.email}" placeholder="${user.email}" required>
                    </div>
                    <div class="result-field">
                      <label>Name: </label>
                      <input name="name" value="${user.name}" placeholder="${user.name}" required>
                    </div>
                    <div class="result-field">
                      <label>Age: </label>
                      <input name="age" value="${user.age}" placeholder="${user.age}" type="number">
                    </div>
                    <div class="result-field">
                      <label>Gender: </label>
                      <select name="gender">
                        <option value="${user.gender}" selected disabled>${user.gender}</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div class="result-field">
                      <label>Address: </label>
                      <input name="address" value="${user.address}" placeholder="${user.address}">
                    </div>
                    <input type="hidden" name="userID" value="${user._id}">
                    <div class="submit-form">
                      <button type="submit">Update</button>
                      <button data-event="delete" data-click="${window.location.href}/delete/${user._id}" type="button">Delete</button>
                    </div>
                  </form>
                </div>
              </div>
              `);
            });
          });
  }
}

function updateUser(e) {
  if (e.target.id === `update-user`) {
    let inputs = e.target,
        obj    = {};
    for (let i = 0; i < inputs.length - 1; i++) {
      obj[inputs[i].name] = inputs[i].value; // To place the keys and values in obj
    }
    axios .patch(`${window.location.href}/update?${e.target[1].name}=${e.target[1].value}`, obj)
          .then(result => {
            let form   = e.target,
                user   = result.data;
            (async function resetValues(form) {
              for (let i = 0; i < 7; i++) {
                form[i].value = ``;
              }
              await setTimeout(() => {
                form[0].value = user.role;
                form[1].value = user.username;
                form[2].value = user.email;
                form[3].value = user.name;
                form[4].value = user.age;
                form[5].value = user.gender;
                form[6].value = user.address;
              },50);
            })(form);
            (async function updateOK(form) {
              form[8].classList = `updated`;
              form[8].innerText = `Updated`;
              await setTimeout(()=> {
                form[8].classList = ``;
                form[8].innerText = `Update`;
              }, 1701);
            })(form);
          })
          .catch(err => {
            let form = e.target;
            form[8].classList = `error`;
            form[8].innerText = `Error`;
          });
  }
}

function deleteUser(e) {
  if (e.target.dataset.event === `delete`) {
    let btn   = e.target,
        cards = e.target.parentNode.parentNode.parentNode.parentNode.parentNode,
        card  = e.target.parentNode.parentNode.parentNode.parentNode;

    
    axios .delete(e.target.dataset.click)
          .then(() => {
            cards.removeChild(card);
          })
          .catch(err => {
            btn.classList = `error`;
            btn.innerText = `Error`;
          });
  }
}