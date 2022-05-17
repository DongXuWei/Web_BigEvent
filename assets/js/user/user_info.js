$(function() {
    let form = layui.form;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })
    initUserInfo();

    //重置
    $('#btn_reset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })

    //表单更新用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'PUT',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                //重新渲染数据  必须要使用liveServer打开
                window.parent.getUserInfo();
            }
        })
    })
})

function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success(res) {
            if (res.code !== 0) {
                return layui.layer.msg(res.message)
            }
            // layui.layer.msg(res.message);
            // console.log(res);
            //调用form.val()快速为表单赋值
            layui.form.val('formUserInfo', res.data);
        }
    })
}