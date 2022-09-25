const API = "https://api.github.com/users/";
const { createApp } = Vue

createApp({
  data() {
    return {
      search: null,
      result: null,
      error: null,
      favorites: new Map()
    }
  },
  created(){
    const saveFavorites = JSON.parse(window.localStorage.getItem('favorites'));
    if (saveFavorites?.length) {
      const favorites = new Map(saveFavorites.map(favorite =>[favorite.id, favorite]));
      this.favorites = favorites;
    }
  }
  ,
  computed:{
    isFavorite(){
      return this.favorites.has(this.result.id); 
    },
    allFavorites(){
      return Array.from(this.favorites.values());
    }
  }
  ,
  methods: {
    async doSearch(){
        this.result = this.error = null;
        try {
            const response = await fetch(API + this.search);
            if (!response.ok) throw new Error("User not found");
            const  data = await response.json();
            console.log(data);
            this.result = data;
            
        } catch (error) {
            this.error = error;
        } finally{
            this.search = null;
        }
    },
    showFavorite(favorite){
      this.result = favorite;
      console.log(favorite);
    },
    checkFavorite(id){
      return this.result?.id == id
    }
    ,
    addFavorite(){
      this.favorites.set(this.result.id, this.result);
      this.updateStorage();
    },
    removeFavorite(){
      this.favorites.delete(this.result.id);
      this.updateStorage();
    },
    updateStorage(){
      window.localStorage.setItem('favorites', JSON.stringify(this.allFavorites));
    }
  },
}).mount('#app')