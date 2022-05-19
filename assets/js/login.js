// 登录的JS文件
$(function() {
    //点击去注册切换到注册页面
    $('#link_reg').on('click', function() {
        $('.login_box').hide();
        $('.reg_box').show();
    })
    $('#link_login').on('click', function() {
        $('.login_box').show();
        $('.reg_box').hide();
    })

    let url = 'http://www.liulongbin.top:3008';

    //校验表单
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致的规则
        repwd: function(value) {
            //通过形参拿到的是确认密码中的内容
            let pwd = $('.reg_box [name=password]').val();
            // console.log(pwd)
            //比较密码框中的内容
            //如果判断失败则return一个提示消息
            if (pwd !== value) {
                return '两次密码输入不一致!'
            }
        }
    })

    //注册
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: `/api/reg`,
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                //console.log(res)
                layui.layer.msg(res.message)
                setTimeout(() => {
                    $('#link_login').click();
                }, 2000)
            }
        })
    })

    //登录
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: `/api/login`,
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                    // console.log(res.token);
                    //存储token 用于访问有权限的接口
                localStorage.setItem('token', res.token);
                location.href = './index.html';
            }
        })
    })
})