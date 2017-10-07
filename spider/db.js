const mongoose = require('mongoose');
//根据官网提示的一些必要配置
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/zhihu',{
     useMongoClient: true
});
//问题的存储格式
const Question = mongoose.model('Question',{
    question_id: String,
    topic_id: Number,
    title: String,
    link: String,
    answer_count: Number,
    answers: Array
})
//回答的存储格式
const Answer = mongoose.model('answer',{
    surpport: Number,
    against: Number,
    content: String
})
//promisefy的存储行为
const asyncSave = function(Schema,data) {
        //第二个属性是问题的唯一id
        let key = Object.keys(data)[1];
        let value = data[key];
        //Schema的方法不加callback的话不会立即执行而是返回promise
        return Schema.findOneAndUpdate({[key]: value},data,{upsert: true})
}

module.exports = {
    Question,
    Answer,
    asyncSave
}