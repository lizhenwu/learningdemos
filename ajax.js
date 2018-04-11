//封装一个通用的ajax方法,requirejs模块
define(function(){
    const request = function(){
        if(window.XMLHttpRequest){
            return new XMLHttpRequest();
        }else {
            return new ActiveXObject('Microsoft.XMLHTTP')                                                                                                                                          
        }
    }
    const dataTransfer = function(data){
        let res = [];
        for(let i in data){
            res.push(`${encodeURIComponent(i)}=${encodeURIComponent(data[i])}`);
        }
        return res.join('&');
    }
    const myAjax = function(options,callback){
        let xhr = request(),
            method = options.method,
            url = options.url,
            data = options.data || null,
            isAsync = options.isAsync || true;
        if(isAsync){
            xhr.onreadystatechange=function()
            {
            if (xhr.readyState==4 && xhr.status==200)
              {
                  return callback(xhr.responseText);
                }
            }
        }
        if(method.toLowerCase() == 'post'){
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            data = dataTransfer(data);
        }
        xhr.open(method,url,isAsync);
        xhr.send();
        if(!isAsync){
            callback(xhr.responseText)
        }
    }
    
    return myAjax;
})


