document.addEventListener('DOMContentLoaded', function() {
    var endPoint = document.URL + 'packages';
    var package_form = document.forms["form-add-package"];

    package_form.onsubmit = function() {
        if (validateForm()) {
            var new_package = {
                name: package_form.package_name.value,
                url: package_form.package_url.value
            }
            httpPost(endPoint, new_package, refreshPackages);
            package_form.package_name.value = '';
            package_form.package_url.value = '';
        }
        return false;
    };

    // Form Validation stuff
    function validateForm() {
        var nameElement = document.forms["form-add-package"]["package_name"];
        var urlElement = document.forms["form-add-package"]["package_url"]
        var name = nameElement.value;
        var url = urlElement.value;
        var error = false;
        if (name==null || name=="") {
            error = true;
        }
        if (url==null || url=="") {
            error = true;
        }
        if (error) {
            return false;
        }
        return true;
    }


    // Package stuff
    var packages = [];

    var addPackages = function(packages) {
        var theTableBody = document.getElementById('table-packages-body');
        var docFragment = document.createDocumentFragment();
        for (var i = 0; i < packages.length; i++) {
            (function () {
                console.dir(packages[i]);
                var name = packages[i].name;
                var url = packages[i].url;

                var tr = document.createElement('tr');

                // The Name
                var td_name = document.createElement('td');
                td_name.appendChild(document.createTextNode(name));
                
                // The URL
                var td_url = document.createElement('td');
                var a = document.createElement('a');
                a.href = url;
                a.appendChild(document.createTextNode(url));
                td_url.appendChild(a);

                // Delete
                var td_action = document.createElement('td');
                var delete_button = document.createElement('button');
                delete_button.className = 'button-small pure-button button-error';
                delete_button.addEventListener('click', function () {
                    console.log('button click: ' + name);
                    httpDelete(endPoint + '/' + name, {name: name, url: url}, refreshPackages);
                });
                delete_button.appendChild(document.createTextNode('delete'));
                td_action.appendChild(delete_button);

                
                tr.appendChild(td_name);
                tr.appendChild(td_url);
                tr.appendChild(td_action);
                docFragment.appendChild(tr);
            }());
        }
        theTableBody.appendChild(docFragment);
    }

    var httpGet = function(theUrl) {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false );
        xmlHttp.send( null );
        console.log('All Packages: ');
        console.log(xmlHttp.responseText);
        return xmlHttp.responseText;
    }

    var httpPost = function(theUrl, args, onSuccess) {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();

        xmlHttp.open( "POST", theUrl, false );
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlHttp.send("name=" +  encodeURIComponent(args.name) + "&url=" +  encodeURIComponent(args.url));
        console.log(xmlHttp.responseText);
        if (xmlHttp.status == 201) {
            console.log('successfully created: ' + args.name);
            onSuccess();
        }

    }

    var httpDelete = function(theUrl, args, onSuccess) {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        
        console.log('Sending request to delete: ' + args.name);
        xmlHttp.open( "DELETE", theUrl, false );
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlHttp.send("name=" +  encodeURIComponent(args.name) + "&url=" +  encodeURIComponent(args.url));
        console.log(xmlHttp.responseText);
        //200 = OK
        if (xmlHttp.status == 200) {
            console.log('successfully deleted: ' + args.name);
            onSuccess();
        }

    }

    //curl http://bower.herokuapp.com/packages -v -F 'name=jquery' -F 'url=git://github.com/jquery/jquery.git'
    
    var refreshPackages = function() {
        var theTableBody = document.getElementById('table-packages-body');
        theTableBody.innerHTML = '';
        packages = JSON.parse(httpGet(endPoint));
        addPackages(packages);
    }
    refreshPackages();

});