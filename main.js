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
    cast: [],
    genres: [],
    cardGenres: []
  },
  mounted () {
    axios.get(`${this.uri}/genre/movie/list?api_key=${this.api_key}`)
      .then((response) => {
        this.genres = response.data.genres;
      });
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
      if (object.original_title) {
        return object.original_title;
      } else {
        return object.original_name;
      }
    },
    vote: function (object) {
      if (object.vote_average <= 2) {
        return 1;
      } else if (object.vote_average >= 2 && object.vote_average <= 4) {
        return 2;
      } else if (object.vote_average >= 4 && object.vote_average <= 6){
        return 3;
      } else if (object.vote_average >= 6 && object.vote_average <= 8) {
        return 4;
      } else {
        return 5;
      }
    },
    changePoster: function (object) {
      if (object.poster_path) {
        return `https://image.tmdb.org/t/p/w342${object.poster_path}`;
      } else {
        return './img/placeholder.png';
      }
    },
    showBigCard: function (object) {
      if (object.title) {
        axios.get(`${this.uri}/movie/${object.id}/credits?api_key=${this.api_key}`)
        .then((response) => {
          for (let i = 0; i < 5; i++) {
            this.cast.push(response.data.cast[i]);
          }
        });
      } else {
        axios.get(`${this.uri}/tv/${object.id}/credits?api_key=${this.api_key}`)
        .then((response) => {
          for (let i = 0; i < 5; i++) {
            this.cast.push(response.data.cast[i]);
          }
        });
      }

      let movieGenres = this.genres.filter((item) => object.genre_ids.includes(item.id));
      movieGenres.forEach((item, i) => {
        this.cardGenres.push(item.name);
      });
    },
    actorName: function (index) {
      if (index !== this.cast.length - 1) {
        return `${this.cast[index].name},`;
      } else {
        return this.cast[index].name;
      }
   },
   getGenre: function (index) {
     if (index !== this.cardGenres.length - 1) {
       return `${this.cardGenres[index]},`;
     } else {
       return this.cardGenres[index];
     }
   },

  },

});
