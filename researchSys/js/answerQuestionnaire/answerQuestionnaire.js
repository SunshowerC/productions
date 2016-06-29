/**
 * Created by MaxWell on 2016/5/8.
 */

//未对answerTeam 初始化


(function(){

    var  unfilledQuests = [];  //未点击的题目组成的数组

    function addEvent(ele,type,handle) {
        if(ele.addEventListener){
            ele.addEventListener(type,handle);
        }else if(ele.attachEvent){
            ele.attachEvent('on' + type, handle);
        }else{
            ele['on'+ type] = handle;
        }
    }

    function getElementChildTeam(parentElement){
        var elementChildTeam = [];
        for(var i = 0 , len = parentElement.childNodes.length; i < len ; i++){
            if(parentElement.childNodes[i].nodeType == 1 ) {
                elementChildTeam.push(parentElement.childNodes[i]);
            }
        }
        return elementChildTeam;
    }

    function trim(str) {
        return str.replace(/^\s+/,'').replace(/\s+$/,'');
    }




    //单选题需要找到之前选择的是哪一道，更改选择的选项后须先对之前选项计数-1，然后对新选项计数+1
    //多选题只需要判断更改后当前选项是true或false,true表示之前未选当前选项，对当前选项计数+1,,false表示之前已选,对当前选项计数-1
    /*
    文本题需要判断之前是否已填写有意义答案,
    之前有意义，之后有意义，不变(已经计数)
    之前无意义，之后有意义,加1
    之前无意义，之后无意义，不变
    之前有意义，之后无意义，减1
    所以需要对文本题添加一个属性用来判断是否已经填写有效答案,为临时属性，问卷填写完成后，就需要删除
    */



    var body = document.getElementsByTagName("body")[0];



    var activeResearchId = localStorage.activeResearchId;

    var paperMsg = JSON.parse(localStorage.paperMsg);


    for(var i = 0 , len = paperMsg.length ; i < len ; i++) {
        if(activeResearchId == paperMsg[i].researchId) {
            break;  //跳出循环，i保存活动问卷的下标
        }
    }
    var currentResearch = paperMsg[i];


    console.log(paperMsg[i]);


    //事件委托给body
    addEvent(body,'change',function(event){


        switch(event.target.type){

            case "radio" : {


                //每道单选题设置临时属性selectedOption

                var selectOption = event.target;  //此次选择的选项

                var elementNodesTeam = getElementChildTeam(selectOption.parentNode.parentNode); //选项label集合


                //存在缺陷,对类名严格要求
                var selectwhichQuest = selectOption.name.substring(selectOption.name.length - 1,selectOption.name.length);  //选中第几题,从1开始

                /*alert('选择了第' + selectwhichQuest + '题');*/



                // i 为选中的选项下标，从0开始
                for(var i = 0 , len = elementNodesTeam.length; i < len ; i++ ) {
                    
                    if(selectOption.parentNode == elementNodesTeam[i] ) {
                        /*alert( '选中了第' + ( i+1 ) + "项" );*/
                        break;
                    }
                }


                //selectwhichQuest从1开始,对应localStorage中数据需要减一


                if(currentResearch.questionTeam[selectwhichQuest - 1 ].selectedOption == undefined) {  //第一次点击该题目
                    currentResearch.questionTeam[selectwhichQuest - 1 ].selectedOption =  i ;
                    currentResearch.questionTeam[selectwhichQuest - 1].answerNum[i]++;  //当前选择项加1


                } else {  //之前已经选过当前单选题

                    currentResearch.questionTeam[selectwhichQuest - 1].answerNum[currentResearch.questionTeam[selectwhichQuest - 1 ].selectedOption]--;  //之前选择的-1
                    currentResearch.questionTeam[selectwhichQuest - 1].answerNum[i]++;  //当前选择的加1
                    currentResearch.questionTeam[selectwhichQuest - 1].selectedOption = i; //将当前点击的设置为已选选项
                }

                /*console.log(currentResearch);*/
                break;
            }

            case "checkbox" : {
                //根据event.target.name来获取点击的选项有关信息
                var selectOption = event.target;

                var selectwhichQuest = selectOption.name.substring(selectOption.name.length - 3,selectOption.name.length - 2);  //选中第几题,从1开始

                var selectwhichOpt = selectOption.name.substring(selectOption.name.length - 1,selectOption.name.length );  //选中第几个选项,从1开始

/*
                alert('选择了第' + selectwhichQuest + '道题');

                alert('选择了第' + selectwhichOpt + '个选项');

                alert('选中当前选项?' + selectOption.checked);
*/

                if(selectOption.checked === true ) {

                    currentResearch.questionTeam[selectwhichQuest - 1].answerNum[selectwhichOpt - 1 ]++;  //之前没选过,点击后加1

                    /*console.log(currentResearch);*/
                }
                if(selectOption.checked === false) {
                    currentResearch.questionTeam[selectwhichQuest - 1].answerNum[selectwhichOpt - 1 ]--; //之前选过，这次给取消了，减1

                    /*console.log(currentResearch);*/
                }

                break;
            }

            case 'textarea' : {

                var textbox = event.target;

                var text = trim(textbox.value);

                var selectwhichQuest = textbox.name.substring(textbox.name.length - 1,textbox.name.length );  //选中第几题,从1开始




                //beforeAnswerValid
                //筛选有效答案

                if(currentResearch.questionTeam[selectwhichQuest - 1].questType == 3 ) {

                if(currentResearch.questionTeam[selectwhichQuest - 1].beforeAnswerValid == undefined ) { //之前未回答过
                    if(text.length == 0 ) {  //trim后长度为0，此次输入无效
                        currentResearch.questionTeam[selectwhichQuest - 1].beforeAnswerValid = false; //回答无效
                    } else {
                        currentResearch.questionTeam[selectwhichQuest - 1].beforeAnswerValid = true;  //之前未回答过且回答有效
                        /*console.log(currentResearch.questionTeam[selectwhichQuest - 1].answerValidNum);*/
                        currentResearch.questionTeam[selectwhichQuest - 1].answerValidNum++;
                        /*console.log(currentResearch.questionTeam[selectwhichQuest - 1].answerValidNum);*/
                    }
                } else {   //之前已经回答过
                    if(currentResearch.questionTeam[selectwhichQuest - 1].beforeAnswerValid) {
                        if(text.length == 0) {  //之前有效回答，此次更改为无效回答
                            currentResearch.questionTeam[selectwhichQuest - 1].answerValidNum--;
                        } //之前有意义，之后也有意义,不做操作
                    } else {
                        if(text.length != 0) {  //之前无效，此时有效
                            currentResearch.questionTeam[selectwhichQuest - 1].answerValidNum++;
                        }   //之前无效,此时也无效,不做操作
                    }

                }

                } else {
/*                    alert('数据和视图对应错误');*/
                }

                console.log(currentResearch);

                break;
            }

            default : {
                //不做处理，其实能触发change事件的只有input元素
            }

        }
            
    },false);




    for(var j = 0 , leng = currentResearch.questionTeam.length ; i < leng ; i++ ) {  //循环遍历所有问题
        if(currentResearch.questionTeam[i].questType === 3) {  //选择文字题
            currentResearch.questionTeam[i].anwserSumNum++;
        }
    }

    

    //前面对每道题的选择然后计数有个遗漏的地方就是,只有用户做过的题目才会计数,如果用户没做的题目,selectedOption和beforeAnswerValid为undefined,而对于多选项，同样的方法无法试用，因为多选项可以撤销之前选择的选项，除非统计选择的选项数组


    var btn = document.getElementById('submit');

    //获取题目集合，作为外部循环，
    //外部循环里添加对当前题目isMust的判断,true则进行内部循环，否则continue到下次循环
    //获取选项集合，作为内部循环,
    //单选遍历判断是否存在选项被勾选，false进行下次内部循环，true跳出内部循环
    //多选同上,
    //文字题判断input的trim(value)长度是否大于0，true则有效，false无效


    addEvent(btn,'click',function(event){   //验证提交


        var questionTeam = getElementChildTeam(document.getElementsByClassName("questionTeam")[0]); //获取题目集合

        for(var i = 0 ; i < questionTeam.length ; i++) {  //外循环，题目循环
            


            if(currentResearch.questionTeam[i].isMust) {
                //获取第i题的选项集合

                var optTeam =  getElementChildTeam(getElementChildTeam(questionTeam[i])[1]);  //问题元素下的共两个元素，下标为1为表示选项容器元素(文本框容器),然后再通过容器再获取选项数组

                unfilledQuests = [];

                for(var j = 0 ; j < optTeam.length ; j++) {   //内循环，选项循环

                    //单选复选存在value值，所以需要将选择和文本题的检验分开

                    var opt = getElementChildTeam(optTeam[j])[0];



                    if(opt.type == 'textarea') {   //文本题
                        if(trim(opt.value).length > 0 ) {  //去除前后空白后，有非空白字符未有效回答
                            /*alert(opt.value);*/
                            break;
                        } else {  //无效输入
                            /*alert(opt.value);*/
                            unfilledQuests.push(i+1) ; //压入当前题目
                        /*    alert('存在未填写的必选题或填写无效');*/
                        }
                    } else {
                        if(opt.checked) {  //存在选项被选中,跳过内 选项循环
                            break;
                        }
                        if(j == optTeam.length-1 ) {  //所有选项都未选择
                            unfilledQuests.push(i+1);
                        /*    alert('存在未填写的必选题或填写无效');*/
                        }
                    }
                }
            }
            continue;  //非必做题,跳过次次外部题目循环
        }



        if(unfilledQuests.length != 0 ) {

            $('#dialog-modal').dialog({
                title: '系统提示',
                content : '有题目未填选',
                height: 200,
                button:{
                    '确定' : function () {},
                    '关闭' : function() {}
                }
            });
        } else {
            for(var i = 0 , len =  currentResearch.questionTeam.length ; i < len ; i++) {  //遍历所有题目
                delete currentResearch.questionTeam[i].selectedOption;  //删除属性
                delete currentResearch.questionTeam[i].beforeAnswerValid;

            }
        }

        event.preventDefault();
        event.stopPropagation();

        for( i = 0 , len = paperMsg.length ; i < len ; i++) {
            if(activeResearchId == paperMsg[i].researchId) {
                break;  //跳出循环，i保存活动问卷的下标
            }
        }

        paperMsg[i] = currentResearch;

        localStorage.setItem('paperMsg',JSON.stringify(paperMsg));

        window.open('questList.html','_self');



    },false);
    //判断临时属性是否删除
/*    for(var i = 0 , len =  data.questionTeam.length ; i < len ; i++) {
        alert(data.questionTeam[0].selectedOption);
        alert(data.questionTeam[i].beforeAnswerValid);
    }*/

})();



