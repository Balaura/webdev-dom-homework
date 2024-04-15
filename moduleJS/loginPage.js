
// import { updateButtonState } from "./render.js";
// import { nameInputElement, textInputElement } from './main.js';
// import { safeHTML } from "./utils.js";
// import { renderUsers } from './render.js';
// import { users } from './main.js';
// import { getCommentsAndUpdate } from './main.js';


const hostUsers = 'https://wedev-api.sky.pro/api/user';
const hostAutorization = 'https://wedev-api.sky.pro/api/user/login';
export let token;
export let user;



// buttonElement.addEventListener("click", () => {
//      login({
//           login: loginInputElement.value,
//           password: passwordInputElement.value,
//           name: loginInputElement.value
//      }).then((responseData) => {
//           if (responseData.status === 200) {
//                alert("Войти успешно");
//           } else if (responseData.status === 401) {
//                alert("Неверный пароль");
//           }
//      });
// });


export async function getUsers() {
     const response = await fetch(hostUsers, {
          method: "GET",
     });
     if (response.status === 200) {
          return response.json();
     } else if (response.status === 401) {
          password = prompt('Неверный пароль. Повторите попытку');
          renderUsers();
          throw new Error('Неверный пароль, нет авторизации');
     }
     else {
          throw new Error('Ошибка загрузки комментариев: ' + response.statusText);
     }
}

export function login(login, password) {
     // buttonElement.addEventListener("click", () => {
     //      if (loginInputElement.value.length < 3 || passwordInputElement.value.length < 3) {
     //           alert("Логин и пароль должны быть не короче 3 символов");
     //           return;
     //      }
     // });


     return fetch(hostAutorization, {
          method: "POST",
          body: JSON.stringify({
               login: login,
               password: password,
          })
     })
          .then(response => {
               if (response.status === 201) {
                    return response.json();
               } else if (response.status === 400) {
                    throw new Error("Неверные логин и/или пароль");

               } else {
                    throw new Error(`Ошибка: ${response.statusText} `);
               }
          })
          .then(data => {
               const formattedUser = {
                    id: data.user._id,
                    login: data.user.login,
                    password: data.user.password,
                    name: data.user.name,
                    token: data.user.token,
                    status: 201,
               };
               user = formattedUser;
               token = formattedUser.token;
               return formattedUser;
          })
          .catch(error => {
               console.error("Ошибка авторизации:", error);
               const errorResponse = {
                    status: 400
               };
               return errorResponse;
          })

}

// export async function getUsers() {
//      const response = await fetch(hostUsers, {
//           method: "GET",
//           body: JSON.stringify({
//                login: users.login,
//                name: users.name,
//                password: users.password,
//           })
//      });
//      if (response.status === 200) {
//           return response.json();
//      } else if (response.status === 401) {
//           password = prompt('Неверный пароль. Повторите попытку');
//           renderUsers();
//           throw new Error('Неверный пароль, нет авторизации');
//      }
// }

export function registration(login, password, name) {

     return fetch(hostUsers, {
          method: "POST",
          body: JSON.stringify({
               login: login,
               password: password,
               name: name,
          })
     })
          .then(response => {
               if (response.status === 201) {
                    return response.json();
               } else if (response.status === 400) {
                    throw new Error("Неверные логин и/или пароль");

               } else {
                    throw new Error(`Ошибка: ${response.statusText} `);
               }
          })
          .then(data => {
               const formattedUser = {
                    id: data.user._id,
                    login: data.user.login,
                    password: data.user.password,
                    name: data.user.name,
                    token: data.user.token,
                    status: 201,
               };
               user = formattedUser;
               token = formattedUser.token;
               return formattedUser;
          })
          .catch(error => {
               console.error("Такой человече уже есть:", error);
               const errorResponse = {
                    status: 400
               };
               return errorResponse;
          })
}

// export function authorization(login, password) {
//      fetch(hostAutorization, {
//           method: "POST",
//           body: JSON.stringify({
//                login: login,
//                password: password,
//           })
//      })
//           .then(response => {
//                if (response.status === 201) {
//                     const user = response.json();
//                     return {
//                          id: user.id,
//                          login: user.login,
//                          password: user.password,
//                          name: user.name,
//                          token: user.token,
//                     }
//                } else if (response.status === 400) {
//                     throw new Error("Неверные логин и/или пароль");
//                } else {
//                     throw new Error(`Ошибка: ${response.statusText} `);
//                }
//           })
//           .then(() => {
//                renderUsers(users);
//                getCommentsAndUpdate();
//           })
// }

export const renderLoginPage = () => {
     const appElement = document.getElementById('app');
     const loginHtml = `
     <h1>Страница входа</h1>
     <div class="form">
          <div class="form-row">
          <input type="text" id="add-form-login" class="input" placeholder="Логин" />
               <input type="text" id="add-form-name" class="input" placeholder="Имя" />
               <input type="text" id="add-form-password" class="input" placeholder="Пароль" />
          </div>
          <br />
          <button class="add-form-button" id="login-button">Войти</button>
          <button class="add-form-button" id="registration-button">Зарегестрироваться</button>
          <a href="index.html" id="link-to-tasks">Перейти на главную страницу</a>
     </div>`;

     appElement.innerHTML = loginHtml;

     const buttonElement = document.getElementById('login-button');
     const loginInputElement = document.getElementById('add-form-name');
     const passwordInputElement = document.getElementById('add-form-password');

     buttonElement.addEventListener("click", () => {
          login().then((responseData) => {

               if (responseData.status === 201) {
                    alert("Войти успешно");
                    token = responseData.token;
               } else if (responseData.status === 401) {
                    alert("Неверный пароль");
               }
               loginInputElement.value = "";
               passwordInputElement.value = "";
          });
     });
}