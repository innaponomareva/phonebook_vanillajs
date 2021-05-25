function header(props){
  const div = document.createElement('div');
  div.classList.add('nav');
  div.innerHTML = `
  <h2>Phone Book</h2>
  <ul>
  ${props.auth ? 
    `<li><a href="add" ${props.isAdd ? "active" : ""}>Add new contact</a></li>
    <li><a href="logout">logout</a></li>`:
    `<li><a href="login">Login</a></li>`
  }
  </ul>`;
  div.onclick = event => {
    event.preventDefault();
    if(event.target.tagName === 'A'){
      switch(event.target.attributes['href'].value){
        case 'add':
          props.onAddClickHandler();
          break;
        case 'login':
          props.onAuthClickHandler();
          break;
        case 'logout':
          props.onLogoutClickHandler();
          break;
      }
    }
  }
  return div;
}

function authorization(authSuccess,authError,email,password,onLoginClickHandler, onRegClickHandler){
  const div = document.createElement('div');
  div.classList.add('auth');
  div.innerHTML = `
  ${authSuccess ? `<div class="alert alert-success">Login or registration is successful</div>` : ''}
  ${authError ? `<div class="alert alert-danger">${authError}</div>` : ''}
  <form name="authForm" action="#">
       <input
         class="form-control"
         type="email"
         name="email"
         placeholder="Type email"
       />
       <input
         class="form-control"
         type="password" 
         name="password"
         placeholder="Type password"
       />
       <div class="auth-controls">
       <button id="loginBtn" class="btn btn-success">login</button>
       <button id="regBtn" class="btn btn-success">registration</button>
       </div>
     </form>
  `;
  div.onclick = event => {
    console.log(event.target);
    event.preventDefault();
    if(event.target.tagName === 'BUTTON'){
      const emailInput = document.forms.authForm.email.value;
      const passwordInput = document.forms.authForm.password.value;
      switch(event.target.id){
        case 'loginBtn': onLoginClickHandler(emailInput,passwordInput);
        break;
        case 'regBtn': onRegClickHandler(emailInput,passwordInput);
        break;
      }
    }
  }
  return div;
}

function content(contacts,selectedIndex,mode,onContactClickHandler,onAddContactClickHandler,onDeleteContactClickHandler,onEditContactClickHandler){
  const div = document.createElement('div');
  div.classList.add('contacts');
  div.append(contactList(contacts,selectedIndex,onContactClickHandler));
  if(selectedIndex >= 0 && mode === 'view'){
    div.append(contactView(contacts[selectedIndex],onDeleteContactClickHandler));
  }else if(mode === 'add'){
    div.append(contactForm('add', onAddContactClickHandler));
  }else if(mode === 'save'){
    div.append(contactForm('save', onEditContactClickHandler)); 
  }
  return div;
}


function contactList(contacts,selectedIndex,onContactClickHandler){
  const ul = document.createElement('ul');
  ul.classList.add('list');
  ul.innerHTML = contacts.map((contact,index) =>
    `<li class='list-item ${index === selectedIndex ? 'item-active' : ''}' data-index = ${index}>
      <h2 class='title'>${contact.name} ${contact.lastName}</h2>
      <h3 class='sub-title'>${contact.phone}</h3>
    </li>`
  ).join('');
  ul.onclick = event => {
    event.preventDefault();
    const li = event.target.tagName === 'LI' ? event.target : event.target.parentElement;
    onContactClickHandler(parseInt(li.dataset.index));
  }
  return ul;
}

function contactView(contact,onDeleteContactClickHandler){
  const div = document.createElement('div');
  div.classList.add('contact-view');
  div.innerHTML = `
  <div class="header">
    <h2>${contact.name} ${contact.lastName}</h2>
    <div class="img-btn delete"><img src="./img/delete.png" alt=""></div>
    <div class="img-btn edit"><img src="./img/edit.png" alt=""></div>
  </div>
    <div class="contact-view-row">
      <img src="./img/technology.png" alt="">
      <h3>${contact.phone}</h3>
    </div>
    <div class="contact-view-row"><img src="./img/multimedia.png" alt="">
      <h3>${contact.email}</h3>
    </div>
    <div class="contact-view-row"><img src="./img/buildings.png " alt="">
      <h3>${contact.address}</h3>
    </div>
    <p>${contact.description}</p>`;

    div.onclick = event => {
      event.preventDefault();
      let target = event.target;
      if(target.tagName === 'IMG'){
        target = target.parentNode;
      }
      if(target.classList.contains('delete')){
        target = target;
        // console.log(contact.id);
        onDeleteContactClickHandler(contact.id);
      }
      if(target.classList.contains('edit')){
        target = target;
        editForm(contact);
      }
    }
    return div;
}


function editForm(contact){
  updateState({page:'add', mode:'save'});
  const form = document.forms.addForm;
  form.name.value = contact.name;
  form.lastName.value = contact.lastName;
  form.phone.value = contact.phone;
  form.email.value = contact.email;
  form.address.value = contact.address;
  form.description.value = contact.description;
  const saveBtn = form.querySelector('#saveBtn');
  saveBtn.innerHTML = 'Save'; 
  saveBtn.setAttribute('data-index', contact.id);
}

function contactForm(mode,onAddContactClickHandler){
  const div = document.createElement('div');
  div.classList.add('contact-view', 'add-contact');
  div.innerHTML = `
  <form action="#" name="addForm">
    <input class="form-control" type="text" name="name" placeholder="Type name">
    <input class="form-control" type="text" name="lastName" placeholder="Type lastname">
    <input class="form-control" type="text" name="phone" placeholder="Type phone">
    <input class="form-control" type="text" name="email" placeholder="Type email">
    <input class="form-control" type="text" name="address" placeholder="Type address">
    <textarea class="form-control" type="text" name="description" placeholder="Type description"></textarea>
    <div class="buttons"><button id="saveBtn" class="btn btn-success">${mode === 'add' ? 'Add' : 'Save'}</button></div>
  </form>`;

  div.onclick = event =>{
    event.preventDefault();
    if(event.target.tagName === 'BUTTON' && event.target.innerHTML === 'Add'){
      const form = document.forms.addForm;
      // VALIDATION
      const contact = {
        id: 0,
        name: form.name.value,
        lastName: form.lastName.value,
        phone: form.phone.value,
        email: form.email.value,
        address: form.address.value,
        description: form.description.value,
      }
      onAddContactClickHandler(contact);
    }else if(event.target.tagName === 'BUTTON' && event.target.innerHTML === 'Save'){
      console.log()
      const form = document.forms.addForm;
      const saveBtn = form.querySelector('#saveBtn');
      const editedContact = {
        id: saveBtn.getAttribute('data-index'),
        name: form.name.value,
        lastName: form.lastName.value,
        phone: form.phone.value,
        email: form.email.value,
        address: form.address.value,
        description: form.description.value,
      }
      onEditContactClickHandler(editedContact);
    }
  }
  return div;
}


function home(){
  const div = document.createElement('div');
  div.classList.add('container');
  div.innerHTML = `<img class="home-view" src="./img/contact_us.jpg" alt="homeview">`;
  return div;
}

function loader(){
  const div = document.createElement('div');
  div.classList.add('progress');
  div.innerHTML = `<div class="loader"></div>`;
  return div;
}