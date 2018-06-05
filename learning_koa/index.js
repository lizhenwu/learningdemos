const Koa = require('koa');
const app = new Koa();
const parseURL = require('parseurl');
const url = require('url');
const fs = require('fs'); 
const koa_static = require('koa-static');
const path = require('path')
// console.log(path.basename('/foo/bar/baz/asdf/quux.html','.html'))
console.log(path.extname(path.basename('/foo/bar/baz/asdf/quux.html')))
// const debug = require('debug')('my_koa')
// // debug('listen')
// console.log(debug)

// app.use(async(ctx) => {
//     debug(ctx.method + ' ' + ctx.url)
// })
// app.listen(3000,() => {
//     debug('listening')
// })
// console.log(app)
app.use(koa_static('.'))
app.use(async ctx => {
    console.log(ctx.req.socket.remoteAddress);
    console.log(url.parse(ctx.req.url).href)
})

app.listen(3000);
