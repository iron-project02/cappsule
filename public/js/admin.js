const adminJS = document.querySelector(`script[src='/js/admin.js']`),
      axiosJS = document.createElement(`script`);
axiosJS.src = `https://unpkg.com/axios/dist/axios.min.js`;
document.body.insertBefore(axiosJS, adminJS);

window.onload = () => {
  console.log(`Running admin.js`);

  addEventListener(`submit`, onSubmit);

  function onSubmit(e) {
    e.preventDefault();
    if (e.target.id === `search-user`) {
      axios .get(`${window.location.href}/search?${e.target[0].name}=${e.target[0].value}`)
            .then(search => {
              console.log(search);
              const container = document.querySelector(`#users-crud .search-results`),
                    list      = document.createElement(`ul`);
              container.innerHTML = ``;
              container.appendChild(list);
              search.data.forEach(user => {
                let li = document.createElement(`li`);
                li.innerHTML = `<a href="${window.location.href}/edit/${user._id}">${user.name}</a>`;
                list.appendChild(li)
              });
            });
    }
  }
};