/**
 * Created by Administrator on 2016/6/4.
 */

require.config({
    paths: {
        "jquery": "http://cdn.bootcss.com/jquery/3.0.0-beta1/jquery.min",
        "underscore": "../../node_modules/underscore/underscore-min",
        "config": "../config"
    },
    shim: {
        'jq-drag': {
            deps: ['jquery']
        },
        'pop': {
            deps: ['jquery','jq-drag']
        },
        'config': {
            exports: 'data'
        },
        'delete': {
            deps: ['underscore', 'jquery', 'pop'],
            exports: 'initQuestList'
        }
    }
});


require(['config','delete','jquery'],function (data, initQuestList,$) {
    /*
     模拟数据
     */

    function init(data) {

        //如果localStorage.data 是空的，初始化赋值填充数据
        // console.log(localStorage.getItem('data'))
        if ( !localStorage.getItem('paperMsg')) {
            localStorage.setItem('paperMsg',JSON.stringify(data.paperMsg) ) ;
            console.log('set localStorage.paperMsg successfully')
        }

        var researchs = JSON.parse( localStorage.getItem('paperMsg') ) ;
//		console.log(researchs)
        initQuestList($('.questionnaireList'),researchs); //表格渲染
    }

    //没有模拟数据时，需要提供一个空的对象
//	console.log(typeof data)
    if (typeof data == 'undefined') {
        var data = {paperMsg:[]};
    }

    init(data);

//	 测试结果，有模拟数据，如config.js 时，加载模拟数据中的问卷。
//	 没有模拟数据时，问卷数为0
})

