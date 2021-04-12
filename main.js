Vue.config.devtools = true;

var app = new Vue({
  el: '#root',
  data: {
    searchInput: '',
    searchResults: [],
    noResults: false,
    flags: ['de', 'en', 'es', 'fr', 'hr', 'it', 'pt', 'ru', 'zh'],
},
  methods: {
    getResults: function () {
      if (this.searchInput != '') {
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=76ba2aae3375d8d4f8e6654f74fad328&query=${this.searchInput}`)
          .then((response) => {
            if (response.data.results.length != 0) {
              this.searchResults = response.data.results;
              this.searchInput = '';
              this.noResults = false;
            } else {
              this.searchResults = [];
              this.searchInput = '';
              this.noResults = true;
            }
          });
      } else {
        this.searchResults = [];
        this.noResults = true;
      }
      if (this.searchResults.length == 0) {
        this.noResults = true;
      }
    }
  },
});
