var packagesResource = require('../app/resources/packages');

module.exports = function (app) {
    app.get('/', function(req, res) {
        res.render('index.html');
    });


    // If a get request, send all in response
    app.get('/packages', packagesResource.listPackages);

    // Adding to the registry
    app.post('/packages', packagesResource.addPackage);

    // get specific
    app.get('/packages/:name', packagesResource.getPackage);

    // Searching
    app.get('/packages/search/:name', packagesResource.searchPackages);
};