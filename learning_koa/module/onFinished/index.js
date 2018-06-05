// 验证req对象上有一个complete属性，响应结束时为true
// which文档上却没发现有这个东西
const http = require('http');
const server = http.createServer((req,res) => {
    res.on('finish',() => {
        console.log(req.complete)
    })
    res.end('hehe');
})
server.listen(3000,() => {
    let req = http.request({
        port: 3000,
        hostname: 'localhost'
    });
    req.end()
})