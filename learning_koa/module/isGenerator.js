'use strict';

const isGeReg = /^\s*(?:function)?\*/;
const fnToStr = Function.prototype.toString;
const toStr = Object.prototype.toString;
const getProto = Object.getPrototypeOf;
// 判断是否支持Symbol
const hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
const getGeneratorFunc = function() {
    if(!hasToStringTag) return false;
    try{
        return new Function('return function* (){}')();
    }catch(e) {

    }
}
const generatorFunc = getGeneratorFunc();
const generatorProto = generatorFunc ? getProto(getGeneratorFunc) : {};
module.exports = isGenerator;
function isGenerator(fn) {
    // 是否函数
    if(typeof fn !== 'function') return false;
    // 用正则判断function.toString返回的函数源代码
    if(isGeReg.test(fnToStr.call(fn))) return true;
    // 用对象描述符判断
    // ???
    if(!hasToStringTag) {
        return toStr.call(fn) === '[object GeneratorFunction]';
    }
    return getProto(fn) === generatorProto;
}