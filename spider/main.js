const cheerio = require('cheerio');
const {getQuestionsFromTopic,getQuestionById} = require('./method');
const zhihu = require('zhihu');
const {Question,Answer,asyncSave} = require('./db');
const {topic_ids} = require('./user_data');

const getOffset = function(n) {
    return 4094.20021853 + Math.random()*n;
}
const questionProducer = function(topicID,n) {
    const promiseArr = [];
    while(n >0) {
        let offset = getOffset(n)
        promiseArr.push(getQuestionsFromTopic(topicID,offset));
        n--;
    }
    return promiseArr;
}
const cheerio_ques = function(html) {
    const $ = cheerio.load(html);
    let questions = [];
    Array.from($('.feed-item.feed-item-hook')).forEach((ele,idx) => {
        let quesData = {
            question_id: /\d+\b$/g.exec($(ele).find('.question_link').attr('href'))[0],
            title: $(ele).find('.question_link').text().trim(), 
            link:  `https://www.zhihu.com${$(ele).find('.question_link').attr('href')}`,
            answer_count: $(ele).children('meta[itemprop=answerCount]').attr('content')
        };
        let index = questions.findIndex(el => {
            return el.question_id === quesData.question_id
        });
        if(index < 0) {
            questions.push(quesData);
        }
    });
    return questions;
}

async function getQuestions(topicID) {
    let html = await Promise.all(questionProducer(topicID,5));
    const quesDataArr = cheerio_ques(html.join(''));
    const asyncActions = quesDataArr.map(data => 
        //在这个地方把topicid放进去
        asyncSave(Question,Object.assign({topic_id: topicID},data))
    )
    await Promise.all(asyncActions);
    console.log('done');
    process.exit()
}

getQuestions(topic_ids.javascript);
