module.exports = only;
// 可以修改为支持第一个参数为对象，后面接受任意数量的字符串参数（key值）
function only(obj,keys) {
    if(typeof keys == 'string') {
        keys = keys.split(/\s+/);
    }
    return keys.reduce(function(res,key) {
        if(obj[key] == null) return res;
        res[key] = obj[key];
        return res;
    },{})
    let res = {};
    keys.forEach(key => {
        if(obj[key] != null) {
            res[key] = obj[key]
        }
    })
    return res;
}