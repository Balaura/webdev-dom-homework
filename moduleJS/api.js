
import { updateButtonState } from "./render.js";
import { nameInputElement, textInputElement } from './main.js';
import { safeHTML } from "./utils.js";
import { renderUsers } from './render.js';
import { delay } from './utils.js';
import { users } from './main.js';
import { getCommentsAndUpdate } from './main.js';

export function getComments() {
  return fetch("https://wedev-api.sky.pro/api/v1/dz-hv/comments", {
    method: "GET"
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Ошибка загрузки комментариев: ' + response.statusText);

      }
      return response.json();
    })
}

export function addComment(event, retryCount = 0) {
  nameInputElement.value = nameInputElement.value.trim();
  textInputElement.value = textInputElement.value.trim();

  if (nameInputElement.value.length < 3 || textInputElement.value.length < 3) {
    alert("Имя и комментарий должны быть не короче 3 символов");
    return;
  }

  const maxRetries = 3; // Максимальное количество попыток
  document.getElementById('addComment-status').textContent = "Добавление комментария ...";
  document.querySelector('.add-form').classList.add('hidden');

  getCommentsAndUpdate();

  fetch("https://wedev-api.sky.pro/api/v1/dz-hv/comments", {
    method: "POST",
    body: JSON.stringify({
      name: safeHTML(nameInputElement.value),
      text: safeHTML(textInputElement.value),
      // forceError: true,
    })
  })
    .then(response => {
      if (response.status === 201) {
        alert("Комментарий успешно добавлен");
        nameInputElement.value = "";
        textInputElement.value = "";
        renderUsers(users);
      } else if (response.status === 400) {
        throw new Error("Неверные данные в запросе");
      } else if (response.status === 500) {
        if (retryCount < maxRetries) {
          console.log(`Ошибка сервера. Повторная попытка ${retryCount + 1} из ${maxRetries}`);
          return delay(1000).then(() => addComment(event, retryCount + 1));
        } else {
          throw new Error('Сервер недоступен. Пожалуйста, попробуйте позже (500)');
        }
      } else {
        throw new Error(`Ошибка при добавлении комментария: ${response.statusText}`);
      }
    })
    .then(() => {
      renderUsers(users);
      getCommentsAndUpdate();
    })
    .catch(error => {
      console.error("Произошла ошибка при добавлении комментария:", error);
      alert("Произошла ошибка при добавлении комментария. Пожалуйста, попробуйте еще раз.");
    })
    .finally(() => {
      document.getElementById('addComment-status').textContent = "";
      document.querySelector('.add-form').classList.remove('hidden');
      updateButtonState();
    });
}
