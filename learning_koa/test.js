const Koa = require('koa')
const app = new Koa()
const http = require('http')

app.use(async (ctx, next) => {
    console.log(Date.now())
    await next()
    ctx.body = Date.now()
})

app.use(async ctx => {
    await new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve()
        }, 1000)
    })
})


app.listen(3000, () => {
    console.log('server runnning on 3000')
})

function testPort() {
    http.get('http://localhost:3000', res => {
        let error
        if(res.statusCode !== 200) {
            error = new Error(`请求失败：${res.statusCode}`)
        }
        if(error) {
            res.resume()
            console.log(error.message)
            return
        }
        let data = ''
        res.on('data', chunk => {
            data += chunk
        }).on('error', (e) => {
            console.log(`错误: ${e.message}`)
        }).on('end', () => {
            console.log(data.toString())
        })
    })
}
testPort()
testPort()