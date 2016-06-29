/**
 *
 * Created by haiku on 2016/5/20.
 */
define(['jquery'], function ($) {
    var wrap = $("#question-list"),
        addBtn = $(".question-kind");
    function nextIndex() {
        return wrap.find('.each-question-wrap').length+1;
    }
    function wrapLength() {
        return wrap.find('.each-question-wrap').length;
    }
    function ltTen() {
        if(wrap.find('.each-question-wrap').length>=10) {
            return false;
        }else{
            return true;
        }
    }
    function wrapClickIndex(ths) {
        return ths.parents('.each-question-wrap').index();
    }
    var obj  = {
        addSingle:function () {
            $(document).on("click",".add-dan",function () {
                if(ltTen()) {
                    addBtn.before("<div class='each-question-wrap'>" +
                        "<p class='q-top'>Q"+nextIndex()+" <span class='xx-ct'>单选题</span></p>" +
                            "<input type='hidden' name='questType' value='1'>"+
                        "<p class='each-option-single'><span class='xx-ct'>选项一</span><i class='cha'>x</i></p>" +
                        "<p class='each-option-single'><span class='xx-ct'>选项二</span><i class='cha'>x</i></p>" +
                        "<p class='each-option-single'><span class='xx-ct'>选项三</span><i class='cha'>x</i></p>" +
                        "<p id='add-question-op'>+</p>"+
                        "<span class='bottom-handler' style='display: none;'>" +
                        "<span class='up btn'>上移</span>" +
                        "<span class='down btn'>下移</span>" +
                        "<span class='repeat btn'>复用</span>" +
                        "<span class='delete btn'>删除</span>" +
                        "</span>" +
                        "</div>");
                }

            });
            },
        addMultiple:function () {
            $(document).on("click",".add-duo",function () {
                if(ltTen()) {
                    addBtn.before("<div class='each-question-wrap'>" +
                        "<p class='q-top'>Q"+nextIndex()+" <span class='xx-ct'>多选题</span></p>" +
                        "<input type='hidden' name='questType' value='2'>"+
                        "<p class='each-option-multiple'><span class='xx-ct'>选项一</span><i class='cha'>x</i></p>" +
                        "<p class='each-option-multiple'><span class='xx-ct'>选项二</span><i class='cha'>x</i></p>" +
                        "<p class='each-option-multiple'><span class='xx-ct'>选项三</span><i class='cha'>x</i></p>" +
                        "<p id='add-question-op'>+</p>"+
                        "<span class='bottom-handler' style='display: none;'>" +
                        "<span class='up btn'>上移</span>" +
                        "<span class='down btn'>下移</span>" +
                        "<span class='repeat btn'>复用</span>" +
                        "<span class='delete btn'>删除</span>" +
                        "</span>" +
                        "</div>");
                }

            });
        },
        addText:function () {
            $(document).on("click",".add-textrea",function () {
                if(ltTen()) {
                    addBtn.before("<div class='each-question-wrap'>" +
                        "<p class='q-top'>Q"+nextIndex()+" <span class='xx-ct'>文本题</span></p>" +
                        "<input type='hidden' name='questType' value='3'>"+
                        "<span id='isMustWrapper'>"+
                        "<input type='checkbox' id='isMust'/><label for='isMust'>是否必填</label>"+
                        "</span>"+
                        "<textarea class='text-input' name=''></textarea>" +
                        "<span class='bottom-handler' style='display: none;'>" +
                        "<span class='up btn'>上移</span>" +
                        "<span class='down btn'>下移</span>" +
                        "<span class='repeat btn'>复用</span>" +
                        "<span class='delete btn'>删除</span>" +
                        "</span>" +
                        "</div>");
                }

            });
        },
        Up:function () {
            $(document).on("click", '.up', function () {
                if (wrapLength() != 1) {
                    var p = $(this).parents(".each-question-wrap"),
                        p_content = "<div class='each-question-wrap'>" + p.html() + '</div>',
                        curInd = p.index();
                    p.remove();
                    $(".each-question-wrap").eq(curInd - 1).before(p_content);
                }
            });
        },
        Down:function () {
            $(document).on("click", '.down', function () {
                //当length为1，或者点击最后那个时不触发
                if (wrapLength() != 1 && wrapLength()-1 != wrapClickIndex($(this))) {
                    var p = $(this).parents(".each-question-wrap"),
                        p_content = "<div class='each-question-wrap'>" + p.html() + '</div>',
                        curInd = p.index();
                    p.remove();
                    $(".each-question-wrap").eq(curInd).after(p_content);
                }
            });
        },
        Repeat:function () {
            $(document).on("click", '.repeat', function () {
                if(wrapLength()==10)return;
                    var p = $(this).parents(".each-question-wrap"),
                        p_content = "<div class='each-question-wrap'>" + p.html() + '</div>',
                        curInd = p.index();

                    $(".each-question-wrap").eq(curInd).after(p_content);

            });
        },
        delete:function () {
            $(document).on("click", '.delete', function () {

                var p = $(this).parents(".each-question-wrap");
                p.remove();
            });
        },
        getQuestionArr:function () {
            var questions = [];
            $('.each-question-wrap').each(function (index, element) {
                var obj = {},
                    options = [],
                    answers = [];
                var ths = $(element);
                
                obj.questTitle = ths.find('.q-top .xx-ct').text();
                obj.questType = ths.find('[name=questType]').val();
                if(ths.find(".text-input").length!=0) {//文本题
                    /*options.push(ths.find('.text-input').val());
                    answers.push(0);*/
                    obj.answerValidNum = 0;
                    //set json's isMust
                    if(ths.find('#isMust').is(':checked')) {
                        obj.isMust=true;
                    }else{
                        obj.isMust=false;
                    }
                }else{//单选题，双选题
                    //each options
                    ths.find('[class^=each-option]')
                        .each(function (optInd,optEle) {
                            var optThs = $(optEle);
                            var current = optThs.find('.xx-ct').text();
                            options.push(current);
                            answers.push(0);
                        });
                    obj.isMust=true;
                }

                obj.questOption = options;

                obj.answerNum=answers;
                questions.push(obj);
            });
            return questions;
        },
        getResearchId:function () {
            var lt = window.localStorage;
            var val = lt.getItem('paperMsg');
            if(val==null||val=="") {
                return 1;
            }else{
                var afterParse = JSON.parse(val);
                var max = afterParse[afterParse.length-1].researchId;
                return max+1;
            }
        },
        initLg:function () {
            var currentMsg = window.localStorage.getItem('paperMsg');
            if(currentMsg==null) {
                window.localStorage.setItem('paperMsg',JSON.stringify([{"researchId":1,"researchTitle":"title","deadline":"","state":1,"description":"我是描述","questionTeam":[{"questTitle":"多选题","questType":"2","isMust":true,"questOption":["选项一","选项二","选项三"],"answerNum":[0,0,0]},{"questTitle":"单选题","questType":"1","isMust":true,"questOption":["选项一","选项二","选项三"],"answerNum":[0,0,0]}]}]));
            }
        },
        getActiveResearch:function () {
            var lg = window.localStorage,
                activeId = lg.getItem('activeResearchId');
            return activeId;
        },
        getPaperMsg:function () {
            var lg = window.localStorage,
                before = lg.getItem('paperMsg');
            return JSON.parse(before);
        },
        getCurrentTime:function () {
            var date = new Date(),
                y = date.getFullYear(),
                m = date.getMonth()+1,
                d = date.getDate();
            var currentTime = y +'-'+m+'-'+d;
            return currentTime;
        }
    }
    
    return obj;
});
