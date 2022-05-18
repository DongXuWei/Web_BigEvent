$(function() {
    initArtCateList();
    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                console.log(res)
                layui.layer.msg(res.message)
                let strHtml = template('tpl_table', res)

                $('#tb').html(strHtml);
            }
        })
    }

    let indexAdd = null;

    //为添加类别按钮添加点击事件
    $('#btn_AddCate').on('click', function() {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过事件委托为表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();

        //发起请求
        $.ajax({
            method: 'POST',
            url: '/my/cate/add',
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                console.log(res)
                initArtCateList();
                layui.layer.msg(res.message);
                //根据索引  关闭弹出层
                layui.layer.close(indexAdd);
            }
        })
    })


    let indexEdit = null;
    //为编辑分类绑定点击事件
    $('tbody').on('click', '#btn_edit', function() {
        //弹出一个修改文章的层
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        let id = $(this).attr('data-id')
        console.log(id)
            //发起请求获取对应的分类数据
        $.ajax({
            method: 'GET',
            url: '/my/cate/info?id=' + id,
            success(res) {
                layui.form.val('form-edit', res.data)
            }
        })
    })

    //通过事件委托 为修改分类的表单绑定submit时间
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "PUT",
            url: '/my/cate/info',
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                initArtCateList();
                layui.layer.close(indexEdit)
            }
        })
    })

    //通过事件委托为删除按钮绑定事件
    $('tbody').on('click', '#btn_del', function() {
        let id = $(this).attr('data-id')
            // console.log(id)
        layui.layer.confirm('确认删除', { icon: 3, title: '提示' },
            function(index) {
                $.ajax({
                    method: 'DELETE',
                    url: '/my/cate/del?id=' + id,
                    success(res) {
                        if (res.code !== 0) {
                            return layui.layer.msg(res.message)
                        }
                        //弹出消息
                        layui.layer.msg(res.message)
                            //关闭层
                        layui.layer.close(index)
                            //刷新数据
                        initArtCateList();
                    }
                })
            })
    })
})