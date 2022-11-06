function download() {
  function addSource(markdown) {
    return `# ${document.title}\n>\n> [${document.URL}](${document.URL})\n>\n\n${markdown}`;
  }

  var documentClone = document.cloneNode(true);
  let reader = new Readability(documentClone);
  let article = reader.parse();

  var turndownService = new TurndownService();
  var markdown = turndownService.turndown(article.content);

  urls = XRegExp.matchChain(markdown, [
    { regex: /\!\[\]\(([^"]+?)\)/i, backref: 1 },
  ]);

  var zip = new JSZip();

  // get title
  title = document.title;

  Promise.all(urls.map((u) => fetch(u)))
    .then((responses) => Promise.all(responses.map((res) => res.blob())))
    .then((blobs) => {
      for (var i = 0; i < blobs.length; i++) {
        markdown = markdown.replace(urls[i], `images/${i}`);
        zip.file(`images/${i}`, blobs[i]);
      }

      zip.file("index.md", addSource(markdown));

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
      });
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "SaveAsMarkdown") {
    download();
  }
});
