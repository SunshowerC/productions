/**
 * Created by hunterter on 2016/5/17.
 * 答题数据展示组件
 */
var papersPath = 'paperMsg';
var data = JSON.parse(localStorage.getItem(papersPath))


function DataShow (data, container, callback) {
    this.activeId = Number(localStorage.getItem('activeResearchId'));
    this.data = data[this.activeId-1];
    this.rightContents = [];
    this.container = container;
    this.fragment = document.createDocumentFragment();

    this.init();
    this.renderData();
    this.addCharts();

    if(Object.prototype.toString.call(callback) == '[object Function]') {
        callback();
    }
}



DataShow.prototype.init = function () {
    var titleBar = this.container.querySelector('.titleBar'),
        content = this.container.querySelector('.content'),
        footer = this.container.querySelector('.footer');

    titleBar.querySelector('.title').innerHTML = this.data.researchTitle;
    titleBar.querySelector('.description').innerHTML = this.data.description;
};

DataShow.prototype.renderData = function () {
    var self = this;

    self.data.questionTeam.forEach(function (questionObj, index) {
        var questionBar = document.createElement('div'),
            leftContent = document.createElement('div'),
            questionTitle = document.createElement('p'),
            questionIndex = document.createElement('span'),
            leftList = document.createElement('ul'),
            rightContent = document.createElement('div'),
            questionTypes = ['', '单选题', '多选题', '文本题'];

        questionBar.className = 'question';
        leftContent.className = 'leftContent';
        rightContent.className = 'rightContent';
        questionIndex.className = 'index';
        leftList.className = 'options';

        questionIndex.innerHTML = 'Q' + (index + 1);
        questionTitle.appendChild(questionIndex);
        questionTitle.innerHTML += questionTypes[questionObj.questType];
        if(questionObj.questType == 1 || questionObj.questType == 2) {
            questionObj.questOption.forEach(function (option, index) {
                var anwser = document.createElement('li');
                anwser.innerHTML = option;
                leftList.appendChild(anwser);
            });
        }

        questionBar.appendChild(leftContent);
        questionBar.appendChild(rightContent);
        leftContent.appendChild(questionTitle);
        leftContent.appendChild(leftList);
        self.rightContents.push(rightContent);
        self.fragment.appendChild(questionBar);
    });

    this.container.querySelector('.content').appendChild(this.fragment);
};

DataShow.prototype.addCharts = function () {
    var self = this;
    this.data.questionTeam.forEach(function (questionObj, index) {
        var rightContent = self.rightContents[index];
        var dataEchart = echarts.init(rightContent),
            config = {},
            data = [];

        switch(Number(questionObj.questType)) {
            case 1:
            case 2:
                questionObj.questOption.forEach(function (option, i) {
                    data.push({
                        value: questionObj.answerNum[i],
                        name: option
                    });
                });
                config = {
                    title: {
                        subtext: questionObj.questTitle
                    },
                    series: [
                        {
                            name: questionObj.questTitle,
                            type: 'pie',
                            radius: "80%",
                            data: data,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 100,
                            shadowColor: 'rgba(255, 255, 0, 0.5)'
                        }
                    }
                };
                break;
            case 3:
                config = {
                    top: 'middle',
                    title: {
                        subtext: '有效回答人数'
                    },
                    xAxis: {},
                    yAxis: {
                        data: []
                    },
                    series: [
                        {
                            name: '有效回答人数',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [questionObj.answerValidNum]
                        },
                        {
                            name: '无效回答人数',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [questionObj.anwserSumNum - questionObj.answerValidNum]
                        }
                    ]
                };
                break;
            default:
                console.log('questType错误');
                break;
        }
        dataEchart.setOption(config);
    });
};

(function () {
    var container = document.querySelector('#container');
    var dataShow = new DataShow (data, container);
    window.onresize = function () {
        var content = container.querySelector('.content');
        content.innerHTML = '';
        var dataShow = new DataShow (data, container);
    }
})();
