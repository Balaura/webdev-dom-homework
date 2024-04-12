import { addComment } from './api.js';
import { updateButtonState, renderUsers } from "./render.js";
import { users, nameInputElement, textInputElement } from './main.js';
import { delay } from './utils.js';


export function handleEnterKeyPress(event) {
     if (event.key === "Enter") {
          event.preventDefault();
          // Проверяем, что переменные определены и содержат элементы DOM
          if (nameInputElement && textInputElement) {
               addComment(nameInputElement, textInputElement);
          } else {
               console.error("Переменные nameInputElement и/или textInputElement не определены или не содержат элементы DOM.");
          }
     }
}
export function setupEventListeners() {
     const buttonAddComment = document.getElementById('add-button');
     buttonAddComment.addEventListener('click', addComment);
     nameInputElement.addEventListener('input', updateButtonState);
     textInputElement.addEventListener('input', updateButtonState);
     textInputElement.addEventListener('keypress', handleEnterKeyPress);
     nameInputElement.addEventListener('keypress', handleEnterKeyPress);
}

export function addEventListeners() {
     document.querySelectorAll('.like-button').forEach(button => {
          button.addEventListener('click', function () {
               const index = parseInt(this.dataset.index, 10);
               const comment = users[index];

               if (comment.isLikeLoading) return;

               comment.isLikeLoading = true;
               this.classList.add('-loading-like'); // Добавляем анимацию

               delay(2000).then(() => {
                    // Имитация изменения состояния лайка
                    comment.likes = comment.isLiked ? comment.likes - 1 : comment.likes + 1;
                    comment.isLiked = !comment.isLiked;
                    comment.isLikeLoading = false;
                    this.classList.remove('-loading-like');

                    renderUsers(users);
               });
          });
     });

     document.querySelectorAll('.comment-text').forEach(div => {
          div.addEventListener('click', function () {
               const index = this.dataset.index;
               textInputElement.value = "QUOTE_BEGIN " + users[index].name + "\n" + users[index].comment + " QUOTE_END";
          });
     });

     document.querySelectorAll('.edit-button').forEach(button => {
          button.addEventListener('click', function () {
               alert("Сервер пока что не поддерживает редактирование комментариев. Приходите позже");
          });
     });

     document.querySelectorAll('.save-button').forEach(button => {
          button.addEventListener('click', function () {
               const index = parseInt(this.dataset.index, 10);
               const newText = document.querySelector(`.edit-textarea[data-index="${index}"]`).value;
               users[index].comment = safeHTML(newText);
               users[index].isEdit = false;
               renderUsers(users);
          });
     });

     updateButtonState();
}