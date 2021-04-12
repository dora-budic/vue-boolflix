Vue.config.devtools = true;

var app = new Vue({
  el: '#root',
  data: {
    searchInput: '',
    searchResults: []
  },
  methods: {
    getResults: function () {
      if (this.searchInput != '') {
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=76ba2aae3375d8d4f8e6654f74fad328&query=${this.searchInput}`)
          .then((response) => {
            this.searchResults = response.data.results;
          });
      }
    }
  },
});
