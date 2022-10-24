function download() {
  var documentClone = document.cloneNode(true);
  let reader = new Readability(documentClone);
  let article = reader.parse();
  console.log(article);

  var turndownService = new TurndownService();
  var markdown = turndownService.turndown(article.content);
  // console.log(markdown);

  urls = XRegExp.matchChain(markdown, [
    { regex: /\!\[\]\(([^"]+?)\)/i, backref: 1 },
  ]);
  console.log(urls);

  var zip = new JSZip();

  Promise.all(urls.map((u) => fetch(u)))
    .then((responses) => Promise.all(responses.map((res) => res.blob())))
    .then((blobs) => {
      for (var i = 0; i < blobs.length; i++) {
        markdown = markdown.replace(urls[i], `images/${i}`);
        zip.file(`images/${i}`, blobs[i]);
      }
      // console.log(blobs);

      zip.file("index.md", markdown);

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "example.zip");
      });
    });
}

// chrome.contextMenus.create(
//   {
//     type: "normal",
//     title: "Menu Demo",
//     id: "menuDemo",
//     contexts: ["all"],
//     onclick: download,
//   },
//   function () {}
// );

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: "Sample Context Menu",
    contexts: ["selection"],
  });
});