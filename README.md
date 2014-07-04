Atlasboard red6 Package
=======================

## Installation

From the root directory of your **recently created wallboard**, you just need to type:

    git submodule add https://github.com/red6/atlasboard-red6-package.git packages/red6

to import the package as **git submodule** and use any of the widgets and jobs in this package (check the example dashboard **red6** to see how).

See also: [Package-Atlassian](https://bitbucket.org/atlassian/atlasboard/wiki/Package-Atlassian)

## Available jobs/widgets

### Jenkins
Shows the latest build results from [Jenkins](http://jenkins-ci.org).

![](screenshots/jenkins.png?raw=true)

#### Configuration
```JSON
"jenkins-builds": {
  "serverUrl": "http://ci.jruby.org",
  "interval": 60000,
  "job": "jruby-dist-master",
  "lang": "en"
}
```

### Datetime
Shows the current time and date.

#### Configuration
```JSON
"datetime": {
  "interval": 1000,
  "lang": "en"
},
```

### SonarQube
Shows the following code metrics from [SonarQube](http://www.sonarqube.org):
* code coverage
* technical debt (squale index)
* blocker violations
* lines of code

#### Configuration
```JSON
"sonar": {
  "interval": 6000,
  "serverUrl": "http://nemo.sonarqube.org",
  "resource": "org.codehaus.sonar:sonar"
}
```

### Milestone Countdown

#### Configuration
```JSON
"milestone-countdown": {
    "interval": 60000,
    "name": "R1",
    "dueDate": "2014-09-31",
    "lang": "en"
}
```

### Project Header
Simple widget to display a project name and logo.

#### Configuration
```JSON
"project-header": {
    "interval": 100000000,
    "widgetTitle": "red6",
    "logo": "/images/logo.png"
}
```
To show a logo put the image in the folder `assets/images` of your atlasboard project. Then you can configure the path
to your logo. Given the logo image is at `assets/images/logo.png` then you show it by configuring the path `/images/logo.png`.
