Vue.config.devtools = true;

var app = new Vue({
  el: '#root',
  data: {
    searchInput: '',
    uri: 'https://api.themoviedb.org/3',
    api_key: '76ba2aae3375d8d4f8e6654f74fad328',
    lang: 'it',
    movieResults: [],
    tvResults: [],
    searchResults: [],
    noResults: false,

},
  methods: {
    getResults: function () {
      if (this.searchInput != '') {
        let movieRequest = `${this.uri}/search/movie?api_key=${this.api_key}&query=${this.searchInput}&language=${this.lang}`;
        let tvRequest = `${this.uri}/search/tv?api_key=${this.api_key}&query=${this.searchInput}&language=${this.lang}`;
        axios.all([axios.get(movieRequest), axios.get(tvRequest)])
          .then(axios.spread((...responses) => {
            this.movieResults = responses[0].data.results;
            this.tvResults = responses[1].data.results;
            let allResults = [...this.movieResults,...this.tvResults];
            if (allResults.length != 0) {
              this.searchResults = allResults;
              this.searchInput = '';
              this.noResults = false;
            } else {
              this.searchResults = [];
              this.searchInput = '';
              this.noResults = true;
            }
          }));
      } else {
        this.searchResults = [];
        this.noResults = true;
      }
      if (this.searchResults.length == 0) {
        this.noResults = true;
      }
    },
    hideImage: function (e) {
      e.target.style.display = 'none';
      e.target.nextElementSibling.style.display = 'block';
    },
    getTitle: function (object) {
      if (object.title) {
        return object.title;
      } else {
        return object.name;
      }
    },
    getOriginalTitle: function (object) {
      if (object.title) {
        return object.original_title;
      } else {
        return object.original_name;
      }
    }
  },
});
