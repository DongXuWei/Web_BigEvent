//首页的JS文件
$(function() {
    getUserInfo();

    //退出功能
    $('#btn_exit').on('click', function() {
        layui.layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function(index) {
            //跳转
            location.href = './login.html';
            //清空token值
            localStorage.removeItem('token');
            //关闭提示框
            layer.close(index);
        });
    })
})

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success(res) {
            if (res.code !== 0) {
                return layui.layer.msg(res.message)
            }
            //layui.layer.msg(res.message)
            //调用函数渲染用户的头像
            renderAvatar(res.data);
        }
    })
}

//渲染用户头像
function renderAvatar(user) {
    //判断用户有没有昵称 没有就设置登录名
    let name = user.nickname || user.username;
    $('#user_name').html(name);
    //渲染用户头像
    if (user.user_pic !== null) {
        //有头像
        $('#layui-nav-img').attr('src', user.user_pic).show();
    } else {
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}