// ajax每次发起请求都会先调用这个函数
//可以拦截到每次的ajax请求
$.ajaxPrefilter(function(options) {
    //统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3008' + options.url;
    console.log(options.url)
})