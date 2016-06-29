/**
 * Created by MaxWell on 2016/5/21.
 */

var test = [];

var data = {
    // activeResearchId : 1 ,
    paperMsg :
    [
        {
            researchId: 1,
            researchTitle: '关于考研的调查问卷',
            deadline: '2016-05-21',
            state: 2,  // 1：未发布 2：发布中 3：已结束
            description: '考研的确是一件关系到大学生前程的事情，但是同学们也没必要考虑得太早了，从大三开始考虑完全来得及，考虑太早，最后变化也快，这个时代节奏太快，计划赶不上变化，等到大三了，学业各方面都差不多稳定了，这时候再考虑，对自己未来的定位会更准确。究竟该不该考研?该考哪个学校?一些人甚至从大一大二就开始考虑这个问题，确实对于这个大的问题，是否做，如何做，多花些时间来考虑是必要的。但在开始考虑这个问题时，你首先要知道的是考研的整个流程，它要经过哪些阶段，在什么时间要做什么事情，这些都要心中有数，以便及早安排，计划周详。考研大致要经过以下过程。',
            questionTeam: [
                {
                    isMust: true,
                    questType: 1,  //1 单选 2 多选 3 填空
                    questTitle: '您的年龄',
                    questOption: [
                        '18岁以下',
                        '18-25',
                        '25-35',
                        '35-50',
                        '50岁以上'
                    ],
                    answerNum: [
                        3,
                        4,
                        5,
                        1
                    ]
                },
                {
                    isMust: false,
                    questTitle: '您的爱好',
                    questType: 2,
                    questOption: [
                        '音乐',
                        '阅读',
                        '旅游',
                        '电影'
                    ],
                    answerNum: [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    questType: 3,
                    isMust: true,
                    questTitle: '您的职业是?',
                    answerValidNum: 12
                }
            ]
        },
        //下一个问卷
        {
            researchId: 2,
            researchTitle: '关于本天才的调查问卷',
            deadline: '2016-06-16',
            state: 1,  // 1：未发布 2：发布中 3：已结束
            description: '本天才才不是傻逼',
            questionTeam: [
                {
                    isMust: false,
                    questType: 1,  //1 单选 2 多选 3 填空
                    questTitle: '您的偶像',
                    questOption: [
                        '自己',
                        '没有偶像',
                        '关你屁事'
                        
                    ],
                    answerNum: [
                        3,
                        1,
                        21
                        
                    ]
                },
                {
                    isMust: false,
                    questTitle: '您觉得自己的标签',
                    questType: 2,
                    questOption: [
                        '智商很感人',
                        '智商非常感人',
                        '傻逼一个',
                        '哦'
                    ],
                    answerNum: [
                        1,
                        4,
                        3,
                        8
                    ]
                },
                {
                    questType: 3,
                    isMust: true,
                    questTitle: '您的职业是?',
                    answerValidNum: 12
                }
            ]
        },

        {
            researchId: 3,
            researchTitle: '关于尔等傻逼的调查问卷',
            deadline: '2016-03-11',
            state: 3,  // 1：未发布 2：发布中 3：已结束
            description: '简单关于傻逼的一些莫名其妙奇奇怪怪的调查',
            questionTeam: [
                {
                    isMust: true,
                    questType: 1,  //1 单选 2 多选 3 填空
                    questTitle: '您的性别',
                    questOption: [
                        '男',
                        '女',
                        '未知'
                    ],
                    answerNum: [
                        3,
                        4,
                        15
                    ]
                },
                {
                    isMust: false,
                    questTitle: '您的爱好',
                    questType: 2,
                    questOption: [
                        '音乐',
                        '阅读',
                        '旅游',
                        '电影'
                    ],
                    answerNum: [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    questType: 3,
                    isMust: true,
                    questTitle: '您的职业是?',
                    answerValidNum: 12
                }
            ]
        }  
    ]
};
