const Koa = require('koa');
const app = new Koa();
app.use(async (ctx,next) => {
    // console.log();
    console.log(ctx.originalUrl)
    await next();
    ctx.body = 'testing';
});
// app.use(async (ctx,next) => {
//     console.log('mid2 '+ new Date());
//     next();
// })
app.listen(3000)