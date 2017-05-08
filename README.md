Yii-EJSUrlManager
=================

Yii extension providing a Javascript implementation of the UrlManager.

When developing apps in Yii I found that there's no elegant way to use the Yii CreateUrl function when making AJAX requests.

The JSUrlManager extension allows you to call "Yii.app.createUrl()" from Javascript code in a similar fashion to how you would call "Yii::app()->createUrl" from PHP code, whilst maintaining almost complete compatibility with rules set in your configuration file.

Installation
============

To install the JSUrlManager, clone this respository into a new folder named "JSUrlManager" under your applications "extensions" folder.

Add the EJSUrlManager component to your application config, and add the component to the list of preloaded compnents.
E.G.
```php
'preload' => array('EJSUrlManager'),
'components' => array(
  'EJSUrlManager' => array(
      'class' => 'ext.JSUrlManager.src.EJSUrlManager'
  ),
)
```

OR if you are using composer you should add this into your composer.json :
```
{
    "repositories": [
        {
            "type": "package",
            "package": {
                "name": "ains/Yii-JSUrlManager",
                "version": "master-dev",
                "source": {
                    "url": "https://github.com/ains/Yii-JSUrlManager.git",
                    "type": "git",
                    "reference": "master"
                }
            }

        },
    ],
    "require": {
        "ains/Yii-JSUrlManager": "dev-master",
    }
}
```
Then type on terminal: php composer.phar install
and add to your main.php:
```
return array(
    ...
    'preload' => array('log', 'EJSUrlManager'),
    'components' => array(
        'EJSUrlManager' => array(
            'class' => 'application.vendor.ains.Yii-JSUrlManager.src.EJSUrlManager'
        ),
    ),
    ...
);
```
That's it, no further changes are required to your application or configuration.

Usage
======
The API is almost identical to the "Yii::app()->createUrl()" method.

Examples:

**PHP**
```php
Yii::app()->createUrl('user/view');
```

**Javascript**

```javascript
Yii.app.createUrl('user/view');
```
-----------------

**PHP**
```php
Yii::app()->createUrl('user/view', array('id' => 1));
```

**Javascript**
```javascript
Yii.app.createUrl('user/view', {id: 1});
```

Browser Compatibility
========
Browser support is currently **"Internet Explorer 8+, Firefox 3.1+, Safari 4+, Chrome 3+, and Opera 10.5+"**. This is due to a dependency on JSON parse/stringify being present. If requested the code can be refactored for wider browser support.

Compatibility with Yii Framework
=========

Be aware that any rules which use regular expressions that aren't compatible with the default Javascript libraries will not function as expected. Potentially in the future a more robust Regex library will be used for 100% compatibility, but would introduce an additional dependency.

This code has been tested against the same test suite as the CUrlManager and CUrlRule in the Yii Framework, which has been ported to javascript. The JSUrlManager extension has 96% compatbility with the Yii Test Suite. Currently only a single test fails due to Javascript not supporting \P for unicode code points.
