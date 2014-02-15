var packages = {};
var storage = process.argv[2] || './package-data.json';

exports.listPackages = function (request, response) {
    var result = [];
    for (var name in packages) {
        result.push({
            name: name,
            url: packages[name]
        });
    }
    response.send(result);
}

exports.addPackage = function (request, response) {
    packages[request.body.name] = request.body.url;
    fs.writeFile(storage, JSON.stringify(packages), function (err) {
        if (err) {
            console.log('Failed to write the package data to disk!');
            console.log(err);
        }
    });
    response.send(201);
}

exports.getPackage = function (request, response) {
    var name = request.params.name;

    if (!packages[name]) {
        response.send(404);
    } else {
        response.send({
            name: name,
            url: packages[name]
        });
    }
}

exports.searchPackages = function (request, response) {
    var results = Object.keys(packages).filter(function (pkgName) {
        return pkgName.indexOf(request.params.name) !== -1;
    }).map(function (pkgName) {
        return {
            name: pkgName,
            url: packages[pkgName]
        };
    });
    response.send(results);
}

exports.arrayPackages = function () {
    var result = [];
    for (var name in packages) {
        result.push({
            name: name,
            url: packages[name]
        });
    }
    return result;
}