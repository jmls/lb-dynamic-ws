'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
var path = require('path');

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

let config = {

  dataSources: {
    ds1: {
      name: "ds1",
      connector: "memory"
    },

    ds2: {
      name: "ds2",
      connector: "memory"
    }
  },

  modelSources: [path.resolve(path.join(__dirname,'mymodels'))]

};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, config, function(err) {

  Object.keys(app.dataSources).forEach((key) => {
    console.log("datasource:", app.dataSources[key].settings.name);
  });

  console.log("models folder is %s",config.modelSources);
  
  Object.keys(app.models).forEach((key) => {
    console.log("model:",app.models[key].modelName);
  });


  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
