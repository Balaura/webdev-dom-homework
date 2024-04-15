export function safeHTML(text) {
     return text
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;");
}

export function delay(interval = 300) {
     return new Promise((resolve) => {
          setTimeout(() => {
               resolve();
          }, interval);
     });
}
