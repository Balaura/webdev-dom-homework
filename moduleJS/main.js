import { getComments } from './api.js';
import { renderUsers, renderHome, renderLoginPage } from './render.js';
import { format } from "date-fns";
export let users = [];
// renderLoginPage();
// .then((status) => {
//      if (status === 201) {
//           renderHome();
//      }
// });

renderHome();

// const options = {
//      year: '2-digit',
//      month: 'numeric',
//      day: 'numeric',
// };
// const optionsTime = {
//      hour: 'numeric',
//      minute: 'numeric',
// };
// const dateTime = `${date.toLocaleDateString('ru-RU', options)} ${date.toLocaleTimeString('ru-RU', optionsTime)}`;

export function getCommentsAndUpdate() {
     getComments()
          .then((responseData) => {
               let usersComments = responseData.comments.map((comment) => {
                    const date = new Date(comment.date);
                    const dateTime = format(date, "yyyy-MM-dd hh.mm.ss");;
                    return {
                         name: comment.author.name,
                         date: dateTime,
                         comment: comment.text,
                         likes: comment.likes,
                         isLiked: false,
                    }
               });
               users = usersComments;
               renderUsers(usersComments);
               document.getElementById('loading-status').textContent = "";
          })
          .catch(error => {
               console.error("Ошибка загрузки комментариев:", error);
               document.getElementById('loading-status').textContent = "Ошибка загрузки комментариев.";
          });
}

// getCommentsAndUpdate();
