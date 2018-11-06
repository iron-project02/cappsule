const searchJS   = document.querySelector(`script[src='/js/search.js']`),
      axiosJS    = document.createElement(`script`),
      searchForm = document.getElementById(`search-form`);
axiosJS.src = `https://unpkg.com/axios/dist/axios.min.js`;
document.body.insertBefore(axiosJS, searchJS);

searchForm.onsubmit = e => {
  e.preventDefault();
  axios .get(`${window.location.origin}/prod?${e.target[0].name}=${e.target[0].value}`)
        .then(search => {
          const container = document.querySelector(`#search-results > div`);
          container.innerHTML = ``;
          console.log(search);
          console.log(`===`);
          console.log(search.data.SanPablo[0]);
          console.log(`===`);
          console.log(search.data.Ahorro[0]);
          console.log(`===`);
          let allProducts = search.data.SanPablo.map(item => item);

          search.data.Ahorro.forEach(item => allProducts.push(item));

          (async function sortProducts(all) {
            all.sort((a,b) => {
              let priceA = parseFloat(a.price),
                  priceB = parseFloat(b.price);
              return priceA - priceB;
            });
            await console.log(allProducts);
          })(allProducts);
          
          allProducts.forEach(product => {
            container.insertAdjacentHTML(`beforeend`, eval('`'+search.data.html+'`'));
          });
        });
};