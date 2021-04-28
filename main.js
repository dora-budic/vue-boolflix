Vue.config.devtools = true;

var app = new Vue({
  el: '#root',
  data: {
    searchInput: '',
    uri: 'https://api.themoviedb.org/3',
    api_key: '76ba2aae3375d8d4f8e6654f74fad328',
    lang: 'it',
    firstPage: true,
    popularMovies: [],
    popularSeries: [],
    popularAll: [],
    movieResults: [],
    tvResults: [],
    allResults: [],
    noResults: false,
    selectedFilm: null,
    cast: [],
    genres: [],
    cardGenres: [],
    chategory: 'All',
    selectGenre: '',
    filteredAll: [],
    filteredMovies: [],
    filteredTv: []
  },
  mounted () {
    // Prendo i film popolari
    axios.get(`${this.uri}/movie/popular?api_key=${this.api_key}&language=${this.lang}`)
      .then((response) => {
        this.popularMovies = [...response.data.results];
      });

    // Prendo le serie popolari
    axios.get(`${this.uri}/tv/popular?api_key=${this.api_key}&language=${this.lang}`)
      .then((response) => {
        this.popularSeries = [...response.data.results];
        this.popularAll = [...this.popularMovies, ...this.popularSeries];
      });

    // Prendo generi di film
    axios.get(`${this.uri}/genre/movie/list?api_key=${this.api_key}`)
      .then((response) => {
        this.genres = [...response.data.genres];
      });
    // Prendo generi di serie
    axios.get(`${this.uri}/genre/tv/list?api_key=${this.api_key}`)
    .then((response) => {
      let movieGen = [];
      for (var i = 0; i < this.genres.length; i++) {
        movieGen.push(this.genres[i].name);
      }
      response.data.genres.forEach((item, i) => {
          if (!movieGen.includes(item.name)) {
            this.genres.push(item);
          }
      });
      // Generi nell'ordine alfabetico
      this.genres.sort(function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    });
  },
  computed: {
    // Torna array di film/serie in base alla categoria e genere
    showResults: function () {
      if (this.firstPage) {
        if (this.chategory == 'All') {
          if (this.selectGenre != '') {
            this.filteredAll = this.popularAll.filter((item) =>
            item.genre_ids.includes(this.selectGenre))
            return this.filteredAll;
          } else {
            return this.popularAll;
          }
        } else if (this.chategory == 'Movies') {
          if (this.selectGenre != '') {
            this.filteredMovies = this.popularMovies.filter((item) =>
            item.genre_ids.includes(this.selectGenre))
            return this.filteredMovies;
          } else {
            return this.popularMovies;
          }
        } else {
          if (this.selectGenre != '') {
            this.filteredTv = this.popularSeries.filter((item) =>
            item.genre_ids.includes(this.selectGenre))
            return this.filteredTv;
          } else {
            return this.popularSeries;
          }
        }
      } else {
        if (this.chategory == 'All') {
          if (this.selectGenre != '') {
            this.filteredAll = this.allResults.filter((item) =>
            item.genre_ids.includes(this.selectGenre))
            return this.filteredAll;
          } else {
            return this.allResults;
          }
        } else if (this.chategory == 'Movies') {
          if (this.selectGenre != '') {
            this.filteredMovies = this.movieResults.filter((item) =>
            item.genre_ids.includes(this.selectGenre))
            return this.filteredMovies;
          } else {
            return this.movieResults;
          }
        } else {
          if (this.selectGenre != '') {
            this.filteredTv = this.tvResults.filter((item) =>
            item.genre_ids.includes(this.selectGenre))
            return this.filteredTv;
          } else {
            return this.tvResults;
          }
        }
      }
    }
  },
  methods: {
    // Prendome il nome della categoria scelta dall'utente
    selectChategory: function (e) {
      this.chategory = e.target.innerHTML;
      this.selectGenre = '';
    },
    resultsTitle: function () {
      if (this.firstPage) {
        return `Popular - ${this.chategory}`;
      } else {
        return `Search results - ${this.chategory}`;
      }
    } ,
    getResults: function () {
      this.chategory = 'All';
      this.selectGenre = '';
      this.firstPage = false;
      // Prendo i risultati della ricerca
      if (this.searchInput != '') {
        let movieRequest = `${this.uri}/search/movie?api_key=${this.api_key}&query=${this.searchInput}&language=${this.lang}`;
        let tvRequest = `${this.uri}/search/tv?api_key=${this.api_key}&query=${this.searchInput}&language=${this.lang}`;
        axios.all([axios.get(movieRequest), axios.get(tvRequest)])
          .then(axios.spread((...responses) => {
            this.movieResults = responses[0].data.results;
            this.tvResults = responses[1].data.results;
            let allResults = [...this.movieResults,...this.tvResults];
            if (allResults.length != 0) {
              this.allResults = allResults;
              this.searchInput = '';
              this.noResults = false;
            } else {
              this.allResults = [];
              this.searchInput = '';
              this.noResults = true;
            }
          }));
      } else {
        this.allResults = [];
        this.noResults = true;
      }
      if (this.allResults.length == 0) {
        this.noResults = true;
      }
    },
    // Nascondo l'imagine della bandiera se non esiste e mostro il testo
    hideImage: function (e) {
      e.target.style.display = 'none';
      e.target.nextElementSibling.style.display = 'block';
    },
    // Prendo il titolo del film o serie
    getTitle: function (object) {
      if (object.title) {
        return object.title;
      } else {
        return object.name;
      }
    },
    // Prendo il titolo originale del film o serie
    getOriginalTitle: function (object) {
      if (object.original_title) {
        return object.original_title;
      } else {
        return object.original_name;
      }
    },
    // Prendo il voto e lo trasformo in stelline
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
    // Dimostro l'imagine placeholder se non esiste il poster
    changePoster: function (object) {
      if (object.poster_path) {
        return `https://image.tmdb.org/t/p/w342${object.poster_path}`;
      } else {
        return './img/placeholder.png';
      }
    },
    getInfo: function (object) {
      this.selectedFilm = this.showResults.indexOf(object);

      // Prendo i nomi degli attori in base al categoria film o serie
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

      // Prendo i generi nei quali appartiene il film/serie
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
   // Le azioni nel momento della chiusura della card grossa
   closeBigCard: function () {
     this.cast = [];
     this.cardGenres = [];
   },
   homePage: function () {
     this.firstPage = true;
     this.chategory = 'All';
     this.selectGenre = '';
   }
  },

});
