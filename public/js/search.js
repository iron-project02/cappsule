const searchJS = document.querySelector(`script[src='/js/search.js']`),
      axiosJS  = document.createElement(`script`);
axiosJS.src = `https://unpkg.com/axios/dist/axios.min.js`;
document.body.insertBefore(axiosJS, searchJS);

window.onload = () => {
  addEventListener(`submit`, e => {
    e.preventDefault();
    const inst = axios.create({ headers: {
                                  test: true,
                              }});
    axios .get(`${window.location.origin}/prod?${e.target[0].name}=${e.target[0].value}`)
          .then(search => {
            const container = document.getElementById(`search-results`);
            let div1 = document.createElement(`div`),
                div2 = document.createElement(`div`);

            container.innerHTML = ``;
            div1.innerHTML      = search.data.SanPablo;
            div2.innerHTML      = search.data.Ahorro;

            container.appendChild(div1);
            container.appendChild(div2);
          });
  });
}