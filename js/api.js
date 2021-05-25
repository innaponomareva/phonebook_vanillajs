const BASE_URL = 'https://contacts-telran.herokuapp.com';

class Api{
  static registration(email,password){
    const auth = {email,password}; 
    //{email:email,password:password}
    const requestBody = JSON.stringify(auth);
    return request(`${BASE_URL}/api/registration`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json; charset=utf-8'
      },
      body:requestBody
    });
  }
  static async login(email,password){
    const auth = {email,password};
    const requestBody = JSON.stringify(auth);
    try{
      const response = await fetch(`${BASE_URL}/api/login`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json; charset=utf-8'
        },
        body:requestBody
      });
      const data = await response.json();
      if(response.ok){
        return data;
      }
      return Promise.reject(data); // <-- obrabotka klientskoj owibki
    }catch(error){
      return Promise.reject({message: error.message}); // <-- obrabotka owibki s servera
      // так как у await нет reject и resolve мы обращаемся к Promise
      // и вызываем его статичный метод reject
      // у Promise есть статичные методы resolve и reject
    }
  }
  static getAllContacts(token){
    return request(`${BASE_URL}/api/contact`,{
      headers:{
        Authorization: token,
      }
    });
  }

  static addContact(token,contact){
    const requestBody = JSON.stringify(contact);
    return request(`${BASE_URL}/api/contact`,{
      method: 'POST',
      headers:{
        Authorization: token,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body:requestBody
    });
  }

  static editContact(token,contact){
    return request(`${BASE_URL}/api/contact`,{
      method: 'PUT',
      headers:{
        Authorization: token,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(contact)
    });
  }

  static deleteById(token,id){
    return request(`${BASE_URL}/api/contact/${id}`,{
      method: 'DELETE',
      headers:{
        Authorization: token,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
}



function parseJSON(response){
  return new Promise(resolve => {
    response.json().then(json => resolve({
      status: response.status,
      ok: response.ok,
      json
    }));
  });
}

function request(url,options){
  return new Promise((resolve,reject) => {
    fetch(url,options)
    .then(parseJSON)
    .then(response => {
      if(response.ok){
        return resolve(response.json)
      }
      return reject(response.json)
    }).catch(error => {
      reject({message:error.message})
    });
  });
}