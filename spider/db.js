const mongoose = require('mongoose');
//根据官网提示的一些必要配置
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/zhihu',{
     useMongoClient: true
});
//问题的存储格式
const Question = mongoose.model('Question',{
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
const asyncSave = function(Scheme,data) {
    let toSave = new Scheme(data);
    return toSave.save();
}

module.exports = {
    Question,
    Answer,
    asyncSave
}