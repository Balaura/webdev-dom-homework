import { addEventListeners, setupEventListeners, textInputElement } from "./eventHandlers.js";
import { login, user, registration } from "./loginPage.js";
import { getCommentsAndUpdate } from "./main.js";


export function renderUsers(users) {
  const listCommentElement = document.getElementById('list-comment');
  const appElement = document.getElementById('app');
  const usersHtml = users.map((user, index) => {
    let activeLike = "";
    let commentContent;
    let editButton;
    if (user.isLiked) {
      activeLike = "-active-like";
    }
    if (user.isEdit) {
      // Если комментарий в режиме редактирования
      commentContent = `<textarea class="edit-textarea" data-index="${index}">${user.comment}</textarea>`;
      editButton = `<button class="save-button" data-index="${index}">Сохранить</button>`;
    } else {
      // Если комментарий в обычном режиме просмотра
      commentContent = `<div class="comment-text" data-index="${index}">${user.comment}</div>`;
      editButton = `<button class="edit-button" data-index="${index}">Редактировать</button>`;
      commentContent = commentContent.replaceAll("QUOTE_BEGIN", "<div class='quote'>").replaceAll("QUOTE_END", "</div>").replaceAll("\n", "</br>");
    }
    return `
        <li class="comment">
          <div class="comment-header">
            <div>${user.name}</div>
            <div>${user.date}</div>
          </div>
          <div class="comment-body">
              ${commentContent}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${user.likes}</span>
              <button class="like-button ${activeLike}" data-index="${index}"></button>
              ${editButton}
            </div>
          </div>
        </li>`;
  });
  listCommentElement.innerHTML = usersHtml.join('');
  setupEventListeners();
  addEventListeners();
}

export const renderHome = () => {
  const appElement = document.getElementById('app');
  const appHtml = `
    <div class="container">
      <div class="loading" id="loading-status">
        Загрузка комментариев ...
      </div>
      <ul class="comments" id="list-comment">
        <!-- Список рендерится из JS -->
      </ul>
      <div class="add-form">
        <input type="text" class="add-form-name" placeholder="Введите ваше имя" id="name-input" readonly/>
        <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4" id="text-input"></textarea>
          <div class="addComment" id="buttonAddComment">
            <div class="add-form-row">
              <button class="add-form-button" id="add-button">Написать</button>
            </div>
            <div class="add-form-row">
              <button class="add-form-button" id="delete-button">Удалить последний комментарий</button>
            </div>
            <div class="add-form-row">
              <button class="add-form-button button-guest" id="button-guest">Чтобы написать комментарий, авторизируйтесь пожалуйста</button>
            </div>
          </div>
      </div>
      <div class="addComment" id="addComment-status">

      </div>

    </div>
  `;
  appElement.innerHTML = appHtml;
  addEventListeners();
  getCommentsAndUpdate();


  const addButtonElement = document.getElementById('add-button');
  const deleteButtonElement = document.getElementById('delete-button');
  const buttonGuestElement = document.getElementById('button-guest');
  deleteButtonElement.addEventListener("click", () => {
    alert("Сервер пока что не поддерживает удаление комментариев. Приходите позже");
  });

  if (user !== undefined) {
    const textInputElement = document.getElementById('name-input');
    textInputElement.value = user.name;
    addButtonElement.style.display = 'inline-block';
    deleteButtonElement.style.display = 'inline-block';
    buttonGuestElement.style.display = 'none';
  } else {
    addButtonElement.style.display = 'none';
    deleteButtonElement.style.display = 'none';
    buttonGuestElement.style.display = 'inline-block';
    buttonGuestElement.addEventListener("click", () => {
      renderLoginPage();
    });
  }

}

export const renderLoginPage = (isRegistration) => {
  const appElement = document.getElementById('app');
  let pageName;
  let changeButton;
  let confirmButton;
  if (isRegistration === true) {
    pageName = "Регистрации";
    changeButton = "Уже зарегистрированы?";
    confirmButton = "Зарегистрироваться";
  } else {
    pageName = "Вход";
    changeButton = "Не зарегистрированы?";
    confirmButton = "Войти";
  }

  const loginHtml = `
  <h1>Страница ${pageName}</h1>
     <div class="form">
          <div class="form-row">
            <input type="text" id="add-form-name" class="input" placeholder="Имя человечье" />
            <input type="text" id="add-form-login" class="input" placeholder="Логин" />
            <input type="text" id="add-form-password" class="input" placeholder="Пароль" />
          </div>
          <br />
          <button class="add-form-button" id="login-button">${confirmButton}</button>
          <a href="#" id="change-mode-button">${changeButton}</button>
          <a href="#" id="link-to-home">Перейти на главную страницу</a>
     </div>`;

  appElement.innerHTML = loginHtml;

  const buttonElement = document.getElementById('login-button');
  const loginInputElement = document.getElementById('add-form-login');
  const passwordInputElement = document.getElementById('add-form-password');
  const nameInputElement = document.getElementById('add-form-name');
  const registrationButtonElement = document.getElementById('change-mode-button');
  const linkToHomeElement = document.getElementById('link-to-home');

  linkToHomeElement.addEventListener("click", () => {
    renderHome();
  });

  if (isRegistration === true) {
    nameInputElement.style.display = "inline-block";
    registrationButtonElement.addEventListener("click", () => {
      renderLoginPage(false);
    });
    buttonElement.addEventListener("click", () => {
      registration(loginInputElement.value, passwordInputElement.value, nameInputElement.value).then((responseData) => {
        if (responseData.status === 201) {
          alert("Зарегистрировано успешненько!");
          renderHome();
        } else if (responseData.status === 400) {
          alert("Юзвер c таким логином уже есть");
        }
        loginInputElement.value = "";
        passwordInputElement.value = "";
      });
    });
  } else {
    nameInputElement.style.display = "none";
    registrationButtonElement.addEventListener("click", () => {
      renderLoginPage(true);
    });
    buttonElement.addEventListener("click", () => {
      login(loginInputElement.value, passwordInputElement.value).then((responseData) => {
        if (responseData.status === 201) {
          alert("Войдено успешненько!");
          renderHome();
        } else if (responseData.status === 401) {
          alert("Неверный пароль");
        }
        // loginInputElement.value = "";
        passwordInputElement.value = "";
      });
    });
  }




}


export function updateButtonState() {
  const nameInputElement = document.getElementById('name-input');
  const textInputElement = document.getElementById('text-input');
  const buttonAddComment = document.getElementById('add-button');
  const nameValue = nameInputElement.value.trim();
  const textValue = textInputElement.value.trim();
  if (nameValue !== "" && textValue !== "") {
    buttonAddComment.disabled = false;
    buttonAddComment.classList.remove("button-error-grey");
  } else {
    buttonAddComment.disabled = true;
    buttonAddComment.classList.add("button-error-grey");
  }
}