var Yii = Yii || {}
Yii.app = {scriptUrl: null, baseUrl: null,
    hostInfo: ""};

test("Create URL with path format", function () {
    var rules = {
        "article\/<id:\\d+>": "article\/read",
        "article\/<year:\\d{4}>\/<title>\/*": "article\/read",
        "a\/<_a>\/*": "article",
        "register\/*": "user",
        "home\/*": "",
        "ad\/*": "admin\/index\/list",
        "<c:(post|comment)>\/<id:\\d+>\/<a:(create|update|delete)>": "<c>\/<a>",
        "<c:(post|comment)>\/<id:\\d+>": "<c>\/view",
        "<c:(post|comment)>s\/*": "<c>\/list",
        "http:\/\/<user:\\w+>.example.com\/<lang:\\w+>\/profile": "user\/profile",
        "currency\/<c:\\p{Sc}>": "currency\/info"
    };

    var entries = [
        {"scriptUrl": "\/apps\/index.php", "url": "\/apps\/index.php\/post\/123?name1=value1", "url2": "\/apps\/post\/123?name1=value1", "url3": "\/apps\/post\/123.html?name1=value1", "route": "post\/view", "params": {"id": "123", "name1": "value1"}},
        {"scriptUrl": "\/apps\/index.php", "url": "\/apps\/index.php\/post\/123\/update?name1=value1", "url2": "\/apps\/post\/123\/update?name1=value1", "url3": "\/apps\/post\/123\/update.html?name1=value1", "route": "post\/update", "params": {"id": "123", "name1": "value1"}},
        {"scriptUrl": "\/apps\/index.php", "url": "\/apps\/index.php\/posts\/page\/123", "url2": "\/apps\/posts\/page\/123", "url3": "\/apps\/posts\/page\/123.html", "route": "post\/list", "params": {"page": "123"}},
        {"scriptUrl": "\/apps\/index.php", "url": "\/apps\/index.php\/article\/123?name1=value1", "url2": "\/apps\/article\/123?name1=value1", "url3": "\/apps\/article\/123.html?name1=value1", "route": "article\/read", "params": {"id": "123", "name1": "value1"}},
        {"scriptUrl": "\/index.php", "url": "\/index.php\/article\/123?name1=value1", "url2": "\/article\/123?name1=value1", "url3": "\/article\/123.html?name1=value1", "route": "article\/read", "params": {"id": "123", "name1": "value1"}},
        {"scriptUrl": "\/apps\/index.php", "url": "\/apps\/index.php\/article\/2000\/the_title\/name1\/value1", "url2": "\/apps\/article\/2000\/the_title\/name1\/value1", "url3": "\/apps\/article\/2000\/the_title\/name1\/value1.html", "route": "article\/read", "params": {"year": "2000", "title": "the_title", "name1": "value1"}},
        {"scriptUrl": "\/index.php", "url": "\/index.php\/article\/2000\/the_title\/name1\/value1", "url2": "\/article\/2000\/the_title\/name1\/value1", "url3": "\/article\/2000\/the_title\/name1\/value1.html", "route": "article\/read", "params": {"year": "2000", "title": "the_title", "name1": "value1"}},
        {"scriptUrl": "\/apps\/index.php", "url": "\/apps\/index.php\/post\/edit\/id\/123\/name1\/value1", "url2": "\/apps\/post\/edit\/id\/123\/name1\/value1", "url3": "\/apps\/post\/edit\/id\/123\/name1\/value1.html", "route": "post\/edit", "params": {"id": "123", "name1": "value1"}},
        {"scriptUrl": "\/index.php", "url": "http:\/\/admin.example.com\/en\/profile", "url2": "http:\/\/admin.example.com\/en\/profile", "url3": "http:\/\/admin.example.com\/en\/profile.html", "route": "user\/profile", "params": {"user": "admin", "lang": "en"}},
        {"scriptUrl": "\/index.php", "url": "\/en\/profile", "url2": "\/en\/profile", "url3": "\/en\/profile.html", "route": "user\/profile", "params": {"user": "user", "lang": "en"}},
        {"scriptUrl": "\/index.php", "url": "\/index.php\/currency\/%EF%BC%84", "url2": "\/currency\/%EF%BC%84", "url3": "\/currency\/%EF%BC%84.html", "route": "currency\/info", "params": {"c": "\uff04"}}
    ];

    Yii.app.hostInfo = "http://user.example.com";
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        for (var matchValue = 0; matchValue < 2; matchValue++) {
            Yii.app.scriptUrl = entry.scriptUrl;
            Yii.app.baseUrl = Yii.app.scriptUrl.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');

            var um = new UrlManager({rules: rules, matchValue: (matchValue !== 0), urlFormat: 'path'});
            var url = um.createUrl(entry['route'], entry['params']);
            strictEqual(entry.url, url);

            var um2 = new UrlManager({rules: rules, matchValue: (matchValue !== 0), urlFormat: 'path', showScriptName: false});
            var url2 = um2.createUrl(entry['route'], entry['params']);
            strictEqual(entry.url2, url2);

            um2.opts.urlSuffix = '.html';
            var url3 = um2.createUrl(entry['route'], entry['params']);
            strictEqual(entry.url3, url3);
        }
    }
});

test("Create URL with get format", function () {
    var entries = [
        {"scriptUrl": "\/apps\/index.php", "url": "\/apps\/index.php?route=article\/read&name=value&name1=value1", "url2": "\/apps\/?route=article\/read&name=value&name1=value1", "route": "article\/read", "params": {"name": "value", "name1": "value1"}},
        {"scriptUrl": "\/index.php", "url": "\/index.php?route=article\/read&name=value&name1=value1", "url2": "\/?route=article\/read&name=value&name1=value1", "route": "article\/read", "params": {"name": "value", "name1": "value1"}}
    ];

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        for (var matchValue = 0; matchValue < 2; matchValue++) {
            Yii.app.scriptUrl = entry.scriptUrl;
            Yii.app.baseUrl = Yii.app.scriptUrl.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');

            var um = new UrlManager({
                urlFormat: 'get',
                routeVar: 'route'
            });

            var url = um.createUrl(entry['route'], entry['params'], '&');
            strictEqual(entry.url, url);

            var um2 = new UrlManager({
                urlFormat: 'get',
                routeVar: 'route',
                showScriptName: false
            })

            var url2 = um2.createUrl(entry['route'], entry['params'], '&');
            strictEqual(entry.url2, url2);
        }
    }
});

test("Create URL default params", function () {
    Yii.app.scriptUrl = '/apps/index.php';
    Yii.app.baseUrl = Yii.app.scriptUrl.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');

    var rules = {"": {"0": "site\/page", "defaultParams": {"view": "about"}},
        "posts": {"0": "post\/index",
            "defaultParams": {"page": 1}},
        "<slug:[0-9a-z-]+>": {"0": "news\/list", "defaultParams": {"page": 1}}};

    var um = new UrlManager({rules: rules, urlFormat: 'path'});

    var url = um.createUrl('site/page', {view: "about"});
    var expected = '/apps/index.php/';
    strictEqual(url, expected);

    var url2 = um.createUrl('post/index', {page: 1});
    var expected2 = '/apps/index.php/posts';
    strictEqual(url2, expected2);

    var url3 = um.createUrl('news/list', {slug: 'example', page: 1});
    var expected3 = '/apps/index.php/example';
    strictEqual(url3, expected3);
});