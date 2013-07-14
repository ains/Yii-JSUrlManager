<?php
class EJSUrlManager extends CApplicationComponent
{
    public function init()
    {
        parent::init();
        $managerVars = CJSON::encode(get_object_vars(Yii::app()->urlManager));

        $asset = Yii::app()->assetManager->publish(
            YiiBase::getPathOfAlias('ext.JSUrlManager.src.assets.js'),
            true,
            -1,
            YII_DEBUG
        );

        $cs = Yii::app()->getClientScript();

        $baseUrl = Yii::app()->getRequest()->getBaseUrl();
        $scriptUrl = Yii::app()->getRequest()->getScriptUrl();
        $hostInfo = Yii::app()->getRequest()->getHostInfo();

        $cs->registerScriptFile($asset . '/Yii.UrlManager.min.js', CClientScript::POS_HEAD);
        $cs->registerScript(
            "yiijs.create.js",
            "var Yii = Yii || {}; Yii.app = {scriptUrl: '{$scriptUrl}',baseUrl: '{$baseUrl}',
            hostInfo: '{$hostInfo}'};
            Yii.app.urlManager = new UrlManager({$managerVars});
            Yii.app.createUrl = function(route, params, ampersand)  {
            return this.urlManager.createUrl(route, params, ampersand);};"
            ,
            CClientScript::POS_HEAD
        );

    }

}