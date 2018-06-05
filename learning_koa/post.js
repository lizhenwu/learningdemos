const http = require('http')
const Koa = require('koa')
const app = new Koa()


app.use(async (ctx, next) => {
    ctx.set('X-author', 'windmill')
    await next()
    console.log(ctx.body)
})

app.use(async ctx => {
    if(ctx.method === 'POST') {
        ctx.body = await parsePostData(ctx)
    } else {
        let query = ctx.query
        let queryString = ctx.querystring
        ctx.body = {
            query,
            queryString
        }
    }
})

function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let data = ''
            ctx.req.on('data', chunk => {
                data += chunk
            })
            ctx.req.on('end', () => {
                let parseData = parseQueryStr(data)
                console.log(data)
                resolve(parseData)
            })
        } catch (error) {
            if(error) {
                reject(error)
            }
        }
    })
}

function parseQueryStr(str) {
    let res = {}
    str.split('&').forEach(i => {
        let items = i.split('=')
        res[items[0]] = decodeURIComponent(items[1])
    })
    return res
}

const server = http.createServer(app.callback())

server.listen(3000, () => {
    let info = server.address()
    console.log(`server running on ${info.address}:${info.port}`)
})

process.addListener('uncaughtException', err => {
    console.log(err.stack)
})