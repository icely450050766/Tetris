/**
 * Created by Administrator on 2016/9/18.
 */
var index = ( function($){
    return {

        container : null,// 容器 jq对象
        currentBlocksThis : null,// 当前正在控制的 方块组 的this指针

        mapArr : [],// 方块图形 数组化 （1表示有方块，0表示没有）
        mapArrHeightLength : 0,// 数组的高度 长度
        mapArrWidthLength : 0,// 数组的 宽度 长度

        cellSize: 0,// 每个单元格长度

        init: function(){

            this.container = $('.container');

            this.initSceneAndMapArr();// 初始化 场景 和 mapArr[]
            this.initBlocksClassPrototype();// 初始化 方块组类 的 公共属性
            this.addKeyBoardEventListener();// 注册键盘事件
            this.addNextBlocksEventListener();// 注册 进入下一轮 生成方块组 事件

            $('.container').trigger('nextEvent'); // 游戏开始

        },

        // 初始化 mapArr[] 和 场景
        initSceneAndMapArr: function(){

            // 每行 12 个方块，一共24行
            this.mapArrWidthLength = 12;
            this.mapArrHeightLength = 24;
            this.cellSize = $(window).height() * 0.95 / this.mapArrHeightLength;// 根据屏幕高度 设置单元格长度。使得整个.container都能展现

            // 设置 .container 的宽高
            this.container.css({
                'height': this.mapArrHeightLength * this.cellSize + 'px',
                'width': this.mapArrWidthLength * this.cellSize + 'px',
            });

            // .container 的内容
            var _content = '';
            for( var i=0; i < this.mapArrHeightLength; i++ ){

                this.mapArr[i] = [];
                for( var j=0; j < this.mapArrWidthLength; j++ ){

                    this.mapArr[i].push(0);// 全部初始化为0

                    var _top = this.cellSize * i + 'px';
                    var _left = this.cellSize * j + 'px';
                    _content += '<img src="img/blank.png" style="top: ' + _top + '; left: ' + _left + '">';
                }
                _content += '<br/>';
            }
            var $_content = $( _content );
            this.container.html( $_content );

            // 设置 每张图片大小 为单元格 大小
            this.container.children('img').css({
                "width" : this.cellSize + 'px',
                "height" : this.cellSize + 'px',
            });

        },

        // 初始化 方块组类 的 公共属性
        initBlocksClassPrototype: function(){
            $.blocksClass.prototype.mapArr = this.mapArr;
            $.blocksClass.prototype.cellSize = this.cellSize;

            $.blocksClass.prototype.mapArrWidthLength = this.mapArrWidthLength;
            $.blocksClass.prototype.mapArrHeightLength = this.mapArrHeightLength;
        },

        // 注册键盘事件 ( this是 blocksClass对象 的this )
        addKeyBoardEventListener: function(){

            $(document).keydown( function(e){

                if( this.currentBlocksThis == null ) return;
                //console.log(e.keyCode);

                switch( e.keyCode ){
                    case 38:  this.currentBlocksThis.rotate(); break; // ↑ 旋转
                    case 37:  this.currentBlocksThis.moveHorizontal( false ); break; // ←
                    case 39:  this.currentBlocksThis.moveHorizontal( true ); break; // →
                }

            }.bind( this ));
        },

        // 注册 进入下一轮 生成方块组 事件
        addNextBlocksEventListener: function() {

            $('.container').on('nextEvent', function(){

                console.log( 'nextEvent' );

                // 创建一组 方块（4个一组）
                var _newBlock = new $.blocksClass();
                this.container.append( _newBlock.$blocks );

                this.currentBlocksThis = _newBlock;// 当前正在控制的 方块组 的this指针
                this.currentBlocksThis.commonFall();// 下落

            }.bind( this ));
        },
    }
})( jQuery );

var init = index.init.bind( index );