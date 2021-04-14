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
    getVote: function (vote) {
      let filledStars = '';
      let emptyStars = '';
      for (var i = 1; i <= 5; i++) {
        if (i <= Math.round(vote / 2)) {
          filledStars += '<i class="fas fa-star"></i>';
        } else {
          emptyStars += '<i class="far fa-star"></i>';
        }
      }
      return `${filledStars}${emptyStars}`;
    },
    changePoster: function (object) {
      if (object.poster_path) {
        return `https://image.tmdb.org/t/p/w342${object.poster_path}`;
      } else {
        return './img/placeholder.png';
      }
    },
    getInfo: function (object) {
      if (object.title) {
        axios.get(`${this.uri}/movie/${object.id}/credits?api_key=${this.api_key}`)
        .then((response) => {
          for (let i = 0; i < 5; i++) {
            if (response.data.cast[i] != undefined) {
              this.cast.push(response.data.cast[i].name);
            }
          }
        });
      } else {
        axios.get(`${this.uri}/tv/${object.id}/credits?api_key=${this.api_key}`)
        .then((response) => {
          for (let i = 0; i < 5; i++) {
            if (response.data.cast[i] != undefined) {
              this.cast.push(response.data.cast[i].name);
            }
          }
        });
      }

      let movieGenres = this.genres.filter((item) => object.genre_ids.includes(item.id));
      movieGenres.forEach((item, i) => {
        this.cardGenres.push(item.name);
      });
    },
    // Scrivo la virgola dopo tutti i nomi tranne dopo l'ultimo
    actorName: function (index) {
      if (index !== this.cast.length - 1) {
        return `${this.cast[index]},`;
      } else {
        return this.cast[index];
      }
   },
   // Scrivo la virgola dopo tutti i generi tranne dopo l'ultimo
   getGenre: function (index) {
     if (index !== this.cardGenres.length - 1) {
       return `${this.cardGenres[index]},`;
     } else {
       return this.cardGenres[index];
     }
   },
   closeBigCard: function () {
     this.cast = [];
     this.cardGenres = [];
   }
  },

});
