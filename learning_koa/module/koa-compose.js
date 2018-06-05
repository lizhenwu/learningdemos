'use strict'

module.exports = expose;

/**
 * write a koa-compose manually 
 * compose a collection of middlewares be passed
 * @param {Array} middlewares 
 * @param {Function} 
 */


function expose(middlewares) {
    if(!Array.isArray(middlewares)) throw new Error('middlewares must be an array');
    middlewares.forEach(func => {
        if(typeof func !== 'function') throw new Error('middleware must be composed of functions')
    })
    return function (ctx,next) {
        return runMiddlewares(0); 
        function runMiddlewares(index) {
            let fn = middlewares[index++];
            if(index === middlewares.length + 1) fn = next;
            if(!fn) {
                return Promise.resolve();
            }
            try{
                return Promise.resolve(fn(ctx,function next() {
                    console.log(`mid ${index} done`);
                    runMiddlewares(index);
                }))
            }catch(err) {
                return Promise.reject(err);
            }
        } 
    }
}