import axios from 'axios';

var baseURL = 'http://695u121.mars-t.mars-hosting.com/mngapi/';

let instance = axios.create({
  baseURL: baseURL
});


//Interceptor koji salje sid parametar uz svaki AXIOS poziv;
//zakomentarisano je jer nije do kraja sredjeno, posto bi svi apiji morali da se
//menjaju a bilo je stvari koje su more imortant u tom trenutku za srediti
//
// instance.interceptors.request.use((config) => {
//   config.params = {sid: localStorage.sid};
//   return config;
// });

export {
  instance, baseURL
};
