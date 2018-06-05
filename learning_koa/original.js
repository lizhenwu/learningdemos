const http = require('http');

const app = http.createServer((req, res) => {
    let buf = [];
    req.on('data', data => {
        buf.push(data);
    })
    req.on('end', () => {
        console.log(Buffer.concat(buf).toString())
        res.end('done')
    })
})
app.listen(3000, () => {
    console.log('server running 3000')
})
const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

// 输出: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
console.log(buf.toString());