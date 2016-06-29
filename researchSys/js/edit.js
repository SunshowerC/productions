/**
 *
 * Created by haiku on 2016/5/18.
 */
requirejs.config({
    paths: {
        "jquery": ["http://cdn.bootcss.com/jquery/3.0.0-beta1/jquery.min"],
        'underscore':"../node_modules/underscore/underscore-min"
    },
    shim:{
        'calendar':{
            deps:'jquery',
            exports:'calendar'
        }
    }
});
require(['jquery','editCommon','underscore'],function ($,common) {
    //当没有ls时，伪造数据
    common.initLg();

    var eachWrapper = '.each-question-wrap';
    //点添加问题
    $(".add-btn").bind('click', function () {
        $(".question-kind").fadeIn();
    });
    //上移下移等按钮的显示
    $(document).on('mouseenter', eachWrapper,function () {
        $(this).find('.bottom-handler').stop().fadeIn();
    }).on('mouseleave', eachWrapper,function () {
        $(this).find('.bottom-handler').stop().fadeOut();
    });
    //hover cha~
    $(document).on('mouseenter',eachWrapper+' p',function () {
        $(this).find('.cha').fadeIn();
    }).on('mouseleave',eachWrapper+' p',function () {
        $(this).find('.cha').fadeOut();
    });
    //remove cha<p
    $(document).on('click', '.cha', function () {
        var len = $(this).parents('.each-question-wrap')
            .find('[class^=each-option]').length;
        if(len==4) {
            $(this).parents('.each-question-wrap')
                .find('.bottom-handler')
                .before("<p id='add-question-op'>+</p>");
        }
        $(this).closest('p').remove();

    });
    //click became input
    $(document).on('click', eachWrapper+' .xx-ct', function () {
        var content = $(this).text();
        $(this).replaceWith("<input type='text' class='option-ip' value='" + content + "'>");
        $(this).find('input').focus();
    });
    //blur bacame font
    $(document).on('blur', '.option-ip', function () {
        var content = $(this).val();
        $(this).replaceWith("<span class='xx-ct'>"+content+"</span>");
    });
    //click add option
    $(document).on('click', '#add-question-op', function () {
        var ths = $(this);
        var len = ths.prevAll('p[class^=each]').length;
        //count gt 3,not add
        if(len>3){$(this).remove();return;}

        if(ths.prev().hasClass('each-option-single')) {// is single option
            $(this).before("<p class='each-option-single'><span class='xx-ct'>选项</span><i class='cha'>x</i></p>");
        }else if(ths.prev().hasClass('each-option-multiple')) { // is multiple option
            $(this).before("<p class='each-option-multiple'><span class='xx-ct'>选项</span><i class='cha'>x</i></p>");
        }
        //if optionCount eq 3,remove addBtn
        len==3&&$(this).remove();

    });
        common.addSingle();
        common.addMultiple();
        common.addText();
        common.Up();
        common.Down();
        common.Repeat();
        common.delete();
    //日历
    $('#end-date').calendar({
        yearRange: [1900, 2100],
        defaultDate: common.getCurrentTime(),
        isSelectRange: false    //选择时间点
    });
    /*save paper*/
    $(document).on("click",'#save',function () {

        var is = confirm('你确定保存吗');
        if(!is) return false;


            var lgObj = window.localStorage,
                papers = lgObj.getItem('paperMsg');

        var newObj={};
        var paperJson;

        function getBaseInfo() {
            newObj.researchTitle=$("#paper-title").text();
            newObj.deadline = $("#end-date").val();
            newObj.state = 1;
            newObj.description = "我是描述";
            newObj.questionTeam = common.getQuestionArr();
        }
        if(papers==null) {//问卷为空时
            var arr = [];
            newObj.researchId=1;
            getBaseInfo();

            arr.push(newObj);

            paperJson = JSON.stringify(arr);
        }else if(lgObj.getItem('activeResearchId')!=""){//点击编辑后做增删改处理
            var beforeLs = JSON.parse(papers),
                activeId = common.getActiveResearch();
            $.each(beforeLs, function (ind, ths) {
                if(ths.researchId == activeId) {
                    ths.researchTitle = $.trim($("#paper-title").text());
                    ths.deadline = $("#end-date").val();
                    ths.questionTeam = common.getQuestionArr();
                }
            });
            paperJson = JSON.stringify(beforeLs);

        }else{//新增时
            var beforeLs = JSON.parse(papers);

            newObj.researchId=common.getResearchId();
            getBaseInfo();

            beforeLs.push(newObj);

            paperJson = JSON.stringify(beforeLs);

        }
        lgObj.setItem('paperMsg', paperJson);
        alert('保存成功');
        //set current'id,prevent create's bug
        window.localStorage.activeResearchId=common.getResearchId()-1;
        window.location.reload();
    });
    /*发布问卷*/
    $("#announce").click(function () {
        var is = confirm('你确定发布该问卷吗');
        if(!is) return;
        var lg = window.localStorage,
            activeId = common.getActiveResearch(),
            paper = lg.getItem('paperMsg'),
            after = JSON.parse(paper),
            currentId;
        $.each(after, function (ind, ele) {
            currentId = ele.researchId;
            if (currentId == activeId) {
                ele.state = 2;//调整为发布状态
                alert('发布问卷成功');
                return false;
            }else if(ind==after.length-1){
                alert('请先保存问卷再发布问卷');
            }
        });
        lg.setItem('paperMsg', JSON.stringify(after));
    });

    //get localstorge's paperMsg JSON
    var papersCompiled = _.template(document.getElementById('hasQuests').innerText);
    var existQuest = papersCompiled(papers);
    $(".question-kind").before(existQuest);
    //title
    var titleCpd = _.template($('#researchTitle').text());
    var existTitle = titleCpd(papers);
    $("#paper-title").html(existTitle);
    //deadline
    var deadlineCpd = _.template($('#deadline').text());
    var existDate = deadlineCpd(papers);
    $("#end-date").val($.trim(existDate));
    
    
});