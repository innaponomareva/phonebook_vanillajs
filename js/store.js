const TOKEN_KEY = 'TOKEN';

class Store{
  static getCurrentToken(){
    return localStorage.getItem(TOKEN_KEY);
  }
  static saveToken(token){
    localStorage.setItem(TOKEN_KEY,token);
  }
  static removeToken(){
    localStorage.removeItem(TOKEN_KEY);
  }
}