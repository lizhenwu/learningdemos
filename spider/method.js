/**
 * created in 2017/10/6
 * @author windmill
 */

/**
 * @description dependencies and configurations for request headers
 */
const {base_url} = require('./user_data');
const request = require('superagent');
const postConfig = {
    'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
}
const getConfig = {
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
}
/**
 * @param {String} topicID
 * @param {Number} offset
 * @description get zhihu questions from given topicId,
 * can get dynamicly generated data by a post request with
 * formData like {start: 0,offset: 4090.20021853} which is
 * used in browsers. 
 */
function getQuestionsFromTopic(topicID,offset) {
    return new Promise((resolve,reject) => {
        request.post(`${base_url}/topic/${topicID}/hot`)
        .set(postConfig)
        .send({
            start: 0,
            offset: offset
        })
        .end((err,res) => {
            if(err) {
                reject(err);
            }
            //res.body的结构是{r: 0, msg: [number, html]}
            resolve(res.body.msg[1]);
        })
    });
}
function getQuestionById(id) {
    return new Promise((resolve,reject) => {
        request.get(`${base_url}/question/${id}`)
        .set(getConfig)
        .end((err,res) => {
            if(err) {
                reject(err);
            }
            resolve(res.text);
        })
    })
}

module.exports = {
    getQuestionsFromTopic,
    getQuestionById
}