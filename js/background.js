chrome.contextMenus.create(
  {
    type: "normal",
    title: "MDReader",
    id: "download",
  },
  function () {}
);
chrome.contextMenus.create(
  {
    type: "normal",
    id: "saveAsMarkdown",
    title: "Save as Markdown",
    visible: true,
    parentId: "download",
  },
  function () {}
);

chrome.contextMenus.onClicked.addListener(function (OnClickData, tab) {
  if (OnClickData.menuItemId === "saveAsMarkdown") {
    console.log(tab);
    chrome.tabs.sendMessage(
      tab.id,
      { msg: "SaveAsMarkdown" },
      function (response) {
        console.log(response);
      }
    );
  }
});
