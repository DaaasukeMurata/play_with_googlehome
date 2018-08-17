function doPost(e) {
  console.log("POST data = " + JSON.stringify(e));
  
  var url = getNgrokUrl();
  sendPost(url, e.postData.contents);
  
  return ContentService.createTextOutput("");
}

// read ngrok URL from GoogleSheets "google-home-notifiler_ngrok_url"
function getNgrokUrl() {
  var sheetId = "XXXXXXXXXXXXX";
  var sheetName = "Sheet1";
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  var url = sheet.getDataRange().getValues()[0][0];
  return url;
}

function sendPost(url, payload) {
  var options = {
    "method" : "post",
    "payload" : payload
  };
  UrlFetchApp.fetch(url, options);  
}
