/**
 * Created by 1 on 2017/3/20.017/3/20.
 */
//1.兼容放在头部里面用（能在网页还没执行完毕就用）
function domReady(fn) {
    //功能性检测
    if(document.addEventListener){
        //意味着你是现代浏览器
        document.addEventListener("DOMContentLoaded",fn,false);
    }else {
        //只执行一次fn()
        var flag=false;
        //在IE里面，如果用定义变量的形式定义函数，那么这个函数会立即执行，所以用以下函数
        function init() {
            if (!flag==true){
                fn();
                flag=true;
            }
        };
        //IE浏览器
        //严谨一点，并不是所有的网页都会触发onreadystatechange，因此我们要借助另外一个事件
        //特点：DOM没有加载完毕之前，你去调用滚动条，会报错
        //捕获异常（错误），我知道你这一段代码可能会报错，但是不想让他影响程序的运行
        (function () {
           try {
               document.documentElement.doScroll("left");   //DOM树是否加载完毕
           }catch (e){      //报错信息都会存在这个e里面
               //如果报错，就到这里来，不会终止程序的运行
               //再来一次，利用延迟
               setTimeout(arguments.callee,50);     //自己运行自己        清除延时器只能clear  return没用
               return;          //注意return  不加return的话延时的话会执行init()
           }
           init();
        })();

        //DOM加载是有过程的，每次过程的改变，都会触发这个函数
        //有四个步骤   最后一步是complete完成
        // document.onreadystatechange=function () {
        //     if (document.readyState=="complete"){
        //         init();
        //     }
        // }            现在这个document.readyState=="complete"和window.onload没区别了
    }
}




//2.获取id class tagname
function $(str) {
    var element;
    if (str.indexOf("#")==0){           //indexof获取索引下标
        element=document.getElementById( str.substring(1) );
    }else if(str.indexOf(".")==0){
        element=document.getElementsByClassName( str.substring(1) );
    }else {
        //暂留一下
        element=document.getElementsByTagName( str );
    }
    return element;
}


//3.获取外部样式
function getStyle(obj,attr) {               //两个参数标签，属性
    if(obj.currentStyle){
        //IE
        return obj.currentStyle[attr];
    }else {
        //firefox google
        return getComputedStyle(obj,false)[attr];
    }
}

//4.向下取节点
function get_next(n) {
    var x=n.nextSibling;
    while (x.nodeType!=1){
        x.nextSibling;
    }
    return x;
}

//向上取节点
function get_prev(n) {
    var x=n.previousNode;
    while (x.nodeType!=1){
        x=x.previousNode;
    }
    return x;
}




//封装事件相关的方法和属性
var eventUtil={
    //添加事件
    addEvent:function (element,type,fn) {
        if (elment.addEventListener){
            //兼容支持addEventListener这个方法的浏览器
            element.addEventListener(type,fn,false);
        }else if(elment.attachEvent){
            //兼容IE浏览器
            element.attachEvent("on"+type,fn);
        }else{
            //兼容低版本浏览器，因为低版本浏览器只支持xxx.onclick=xxx
            element["on"+type]=fn;
        }
    },
    //删除事件
    removeEvent:function (element,type,fn) {
        if (elment.removeEventListener){
            //兼容支持addEventListener这个方法的浏览器
            element.removeEventListener(type,fn,false);
        }else if(elment.detachEvent){
            //兼容IE浏览器
            element.detachEvent("on"+type,fn);
        }else{
            //兼容低版本浏览器，因为低版本浏览器只支持xxx.onclick=xxx
            element["on"+type]=null;
        }
    },
    //阻止事件冒泡
    stopPro:function (event) {
        if (event.stopPropagation){
            event.stopPropagation();
        }else {
            //兼容IE
            event.cancelBubble=true;
        }
    },
    //阻止浏览器的默认行为
    stopDefault:function (event) {
        if (event.preventDefault){
            event.preventDefault();
        }else {
            //兼容IE
            event.returnValue=false;
        }
    },
    //可以获取到触发这个事件的元素
    getElement:function (event) {
            //w3c                   ie
        return event.target || event.srcElement;
    }
};