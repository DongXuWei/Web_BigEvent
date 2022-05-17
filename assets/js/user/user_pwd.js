$(function() {
    //校验规则
    let form = layui.form;

    form.verify({
        pwd: [/^[\S]{6,12}$/,
            '密码长度必须6-12位，且不能有空格'
        ],
        newPwd: function(value) {
            if (value === $('[name=old_pwd]').val()) {
                return '新旧密码不能一致'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=new_pwd]').val()) {
                return '两次密码不一致'
            }
        }
    })


    //监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'PATCH',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success(res) {
                //有问题
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                console.log(res)
                $('.layui-form')[0].reset();
            }
        })
    })
})