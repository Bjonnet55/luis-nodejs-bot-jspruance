var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../luis-nodejs-bot-jspruance.zip');
var kuduApi = 'https://luis-nodejs-bot-jspruance.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$luis-nodejs-bot-jspruance';
var password = 'jQcrKkvYDitvyzEvT5mix1QJrc7oknKxEop7AnFskt9AxiB32xJFnhFtgb9g';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('luis-nodejs-bot-jspruance publish');
  } else {
    console.error('failed to publish luis-nodejs-bot-jspruance', err);
  }
});