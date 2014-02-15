# Coral

A Bower registry for Steel Thread project

[View all packages in coral](http://coralreef.herokuapp.com)

## What Is Bower

Bower is a package manager for the web. It offers a generic, unopinionated
solution to the problem of **front-end package management**, while exposing the
package dependency model via an API that can be consumed by a more opinionated
build stack. There are no system wide dependencies, no dependencies are shared
between different apps, and the dependency tree is flat.

Bower runs over Git, and is package-agnostic. A packaged component can be made
up of any type of asset, and use any type of transport (e.g., AMD, CommonJS,
etc.).

[View all packages available through Bower's registry](http://bower.io/search/).

Checkout the Bower Readme for more instructions.
[Checkout Bower](http://bower.io/).

## Setup
Create a .bowerrc file in your application and point the registry to coralreef.
```json
{"registry": "http://coralreef.herokuapp.com"}
```

When registering packages use this format in order to use private repositories:
```
ssh://git@github.com/[user]/[repo].git
```

Make sure to clear cache if package url is updated by:
```bash
bower cache clean
```

## Useful Bower Registry Commands

### Search
To search for packages registered with Bower:

```
bower search [<name>]
```

Using just `bower search` will list all packages in the registry.

### Registering packages

To register a new package:

* There **must** be a valid manifest JSON in the current working directory.
* Your package should use [semver](http://semver.org/) Git tags. [HowTo](https://help.github.com/articles/creating-releases)
* Your package **must** be available at a Git endpoint (e.g., GitHub); remember
  to push your Git tags!

Then use the following command:

```
bower register <my-package-name> <git-endpoint>
```

### Registering packages via commandline
```bash
curl http://coralreef.herokuapp.com/packages -v -F 'name=jquery' -F 'url=git://github.com/jquery/jquery.git'
```

### Find package
```bash
curl http://coralreef.herokuapp.com/packages/jquery
```
Response
```json
{"name":"jquery","url":"git://github.com/jquery/jquery.git"}
```
