/* Api.registration('mayflower@mail.com','America_2021')
.then(response =>{
  console.log(response);
}).catch(error => {
  console.log(error);
}); */

//const root = document.querySelector('#root');
// root.append(home());
//root.append(loader());

let state = {
  loading:false,
  token: null,
  page: 'home',
  contacts: [],
  credentials: {
    email: '',
    password: '',
  },
  authSuccess: false,
  authError: null,
  selectedIndex: -1,
}

init();



function updateState(newState){
  state = {...state, ...newState}; //// Spread Operator for Objects
  renderApp();
}

function init(){
  const token = Store.getCurrentToken();
  if(token){
    Api.getAllContacts(token).then(response => {
      updateState({token, page:'list', contacts: response.contacts});
    });
  }else{
    updateState({});
  }
}

function renderApp(){
  const root = document.querySelector('#root');
  root.innerHTML = '';
  root.append(header({
    auth: state.token !== null, 
    isAdd: state.page === 'add',
    onAddClickHandler,
    onAuthClickHandler,
    onLogoutClickHandler,
  }));
  root.append(document.createElement('hr'));
  if(state.page === 'home'){
    root.append(home());
  }else if(state.page === 'login'){
    root.append(authorization(
      state.authSuccess, 
      state.authError, 
      state.credentials.email, 
      state.credentials.password,
      onLoginClickHandler,
      onRegClickHandler
      ));
  }else{
    root.append(content(
      state.contacts,
      state.selectedIndex,
      state.page,
      onContactClickHandler,
      onAddContactClickHandler,
      onDeleteContactClickHandler,
      onEditContactClickHandler
  ));
  if(state.loading){
    root.append(loader());
  }
  //console.log(state);
}
}

function onDeleteContactClickHandler(id){
  Api.deleteById(state.token,id)
  .then(() => loadContacts());
}

function onEditContactClickHandler(contact){
  Api.editContact(state.token,contact)
      .then(() => {
        loadContacts();
      });
}

function onAuthClickHandler(){
  updateState({page:'login'});
}

function onAddClickHandler(){
  updateState({page:'add',selectedIndex: -1})
}

function onLoginClickHandler(email,password){
  updateState({
    loading: true,
    authSuccess: false,
    authError: null,
    credentials: {email,password},
  });
  Api.login(email,password)
  .then(response => {
    Store.saveToken(response.token); // SAVING TOKEN
    updateState({
      loading:false,
      authSuccess: true,
      token: response.token,
    });
    setTimeout(() => updateState({page:'list', credentials: null}), 1000);
    loadContacts(); /// <-- to show all contacts after login
  }).catch(error => {
    updateState({
      loading:false,
      authError: error.message,
    });
  });
}

function onRegClickHandler(email,password){
  updateState({
    loading: true,
    authSuccess: false,
    authError: null,
    credentials: {email,password},
  });
  Api.registration(email,password)
  .then(response => {
    Store.saveToken(response.token); // SAVING TOKEN
    updateState({
      loading:false,
      authSuccess: true,
      token: response.token,
    });
    setTimeout(() => updateState({page:'list', credentials: null}), 1000);
  }).catch(error => {
    updateState({
      loading:false,
      authError: error.message,
    });
  });
}

function onContactClickHandler(index){
  updateState({selectedIndex:index,page:'view'});
}

function onAddContactClickHandler(contact){
  Api.addContact(state.token,contact).then(() => {
    loadContacts();
  }).catch(error => {
    updateState({
      loading:false,
      authError: error.message,
    });
    showError(error.message);
  })
}

function onLogoutClickHandler(){
  Store.removeToken();
  updateState({
    token: null,
    page: 'home',
    credentials: {
      email: '',
      password: '',
    },
    authSuccess: null,
    authError: null,
  });
}

function loadContacts(){
  updateState({loading:true});
  Api.getAllContacts(state.token).then(response => {
    updateState({
    ...state,
    loading: false,
    contacts: response.contacts,
   });
  }).catch(error => {
    updateState({...state,loading:false});
    showError(error.message); 
  });
}


function showError(error){
  let div = document.querySelector('.alert');
  if(!div){
      document.querySelector('.add-contact').insertAdjacentHTML('afterbegin', `<div class="alert"></div>`);
      div = document.querySelector('.alert');
  }
  div.className = "alert alert-danger";
  div.innerHTML = error;
}