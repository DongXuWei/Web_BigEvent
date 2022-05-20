$(function() {
    initCate();
    initEditor();

    //1、动态渲染文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                let strHtml = template('tpl-pub', res);
                $('[name=cate_id]').html(strHtml);
                //记得调用form.render()方法
                layui.form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮添加点击事件
    $('#btn_choose').on('click', function() {
        $('#coverFile').click(); //模拟点击上传文件按钮
    })

    $('#coverFile').on('change', function(e) {
        //1. 拿到用户选择的文件
        let files = e.target.files;
        if (files.length === 0) {
            return
        }
        //2. 根据选择的文件， 创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(files[0]);
        //3. 先销毁旧的裁剪区域， 再重新设置图片路径， 之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //发布文章
    let art_state = '已发布';
    //点击存草稿的时候  将状态改为草稿
    $('#btn_save2').on('click', function() {
        art_state = '草稿';
    })

    //编辑文章 点击编辑的时候
    // 拿到缓存中的数据
    let result = JSON.parse(localStorage.getItem('result'))
    console.log(result);
    $('#main').html(result.content);
    //* id：文章 id
    //* title:标题
    //* content：内容
    //* cover_img:封面url地址
    // pub_date：发表时间
    //* state：状态
    // cate_id：所属id分类


    //渲染数据
    layui.form.val('formData', result);
    console.log(result.cate_name);
    //根据获取到的分类id让其选中
    let optionId = result.cate_id;
    console.log(optionId)
    $("#selectId option[value=" + optionId + "]").attr("selected", true);

    //定义更新文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'PUT',
            url: '/my/article/info',
            //如果向服务器提交formData数据
            //必须添加以下两个配置项
            data: fd,
            contentType: false,
            processData: false,
            success(res) {
                console.log('------------')
                console.log(res)
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message);
                //跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }

    //监听表单的提交事件
    $('#pubart').on('submit', function(e) {
        e.preventDefault();
        //基于form表单快速创建一个form对象
        let fd = new FormData($(this)[0]);
        fd.append('state', art_state);

        //将封面裁剪后的图片转化为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将文件对象存储到fd中
                fd.append('cover_img', blob);
                //发起请求
                publishArticle(fd);
            })
    });

})