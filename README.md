Atlasboard red6 Package
=======================

## Installation

From the root directory of your **recently created wallboard**, you just need to type:

    git submodule add https://github.com/red6/atlasboard-red6-package.git packages/red6

to import the package as **git submodule** and use any of the widgets and jobs in this package (check the example dashboard **red6** to see how).

See also: [Package-Atlassian](https://bitbucket.org/atlassian/atlasboard/wiki/Package-Atlassian)

## Available Widgets

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

![](screenshots/datetime.png?raw=true)

#### Configuration
Moment.js needs to included as custom JavaScript in your board configuration. Download [moment-with-locales.min.js](http://momentjs.com/downloads/moment-with-locales.min.js)
and place it in <code>assets/javascript</code>. See sample configuration below.

```JSON
  "layout": {
    "customJS" : ["moment-with-locales.min.js"],
  },
  "config" : {
    "datetime": {
      "interval": 1000,
      "lang": "en"
    }
  }
```

### Team Calendar
Shows a calendar of the current working week. A dashboard showing the calender should show no other
widget as the calendar needs the full space to be displayed propertly.

![](screenshots/team_calendar.png?raw=true)

#### Configuration
Moment.js needs to included as custom JavaScript in your board configuration. Download [moment-with-locales.min.js](http://momentjs.com/downloads/moment-with-locales.min.js)
and place it in <code>assets/javascript</code>. See sample configuration below.

```JSON
{
  "layout": {
      "title": false,
      "customJS" : ["moment-with-locales.min.js"],
      "widgets" : [
          {"row" : 1, "col" : 1, "width" : 6, "height" : 4, "widget" : "team-calendar", "job" : "team-calendar", "config": "team-calendar" }
     ]
  },

  "config" : {

      "team-calendar": {
          "calendarUrl": "http://mars/calendar.ics",
          "interval": 1000,
          "differenceUTC": 2,
          "lang": "de"
      }
  }
}
```


### Board Cycle
Cycles periodically through configured dashboards. After each interval the next board is shown. So you can show the builds dashboard
for 15 seconds, then the JIRA dashboard for 15 and so on.

You can configure any url as dashboard. You can cycle through dashboards created with atlasboard but you can also integrate
other dashboards. To show external urls you need to disable web security in the browser. In chrome or chromium you can do this
by starting chrome with <code>google-chrome --disable-web-security</code>.

The grid position does not matter for the widget as all cycled dashboards will take up the whole browser window.

#### Board and Configuration
```JSON
{
  "layout": {
    "title": false,
    "customJS": [],
    "widgets": [
      { "row": 1, "col": 1, "width": 6, "height": 4, "widget": "board-cycle", "job": "board-cycle", "config": "board-cycle" }
    ]
  },

  "config": {
    "board-cycle": {
      "interval": 15000,
      "boardUrls": [
        "/red6",
        "http://www.oxfam.org"
      ]
    }
  }
}
```

### SonarQube
Shows the following code metrics from [SonarQube](http://www.sonarqube.org):
* code coverage
* technical debt (squale index)
* blocker violations
* lines of code

![](screenshots/sonar.png?raw=true)

#### Configuration
```JSON
"sonar": {
  "interval": 6000,
  "serverUrl": "http://nemo.sonarqube.org",
  "resource": "org.codehaus.sonar:sonar",
  "credentials": "sonar" // Reference to globalAuth.json
}
```

### Milestone Countdown
Shows the name and remaining time to a project milestone.

![](screenshots/milestone_countdown.png?raw=true)

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

![](screenshots/project_header.png?raw=true)

#### Configuration
```JSON
"project-header": {
    "interval": 100000000,
    "widgetTitle": "red6",
    "logo": "/images/logo.png"
}
```
Put the image in the folder `assets/images` of your atlasboard project. Then you can configure the path
to your logo. Given the logo image is at `assets/images/logo.png` then you show it by configuring the path `/images/logo.png`.
