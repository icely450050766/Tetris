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
        score: 0,// 得分

        init: function(){

            this.container = $('.container');

            this.initSceneAndMapArr();// 初始化 场景 和 mapArr[]
            this.initBlocksClassPrototype();// 初始化 方块组类 的 公共属性
            this.addKeyBoardEventListener();// 注册键盘事件
            this.addNextBlocksEventListener();// 注册 进入下一轮 生成方块组 事件

            $('.container').trigger('nextEvent'); // 游戏开始

            // 监听游戏结束事件
            $('.container').on('gameOver', function(){
                alert('游戏结束！');
                $(this).off().empty();
            })

        },

        // 初始化 mapArr[] 和 场景
        initSceneAndMapArr: function(){

            // 每行 12 个方块，一共24行
            this.mapArrWidthLength = 12;
            this.mapArrHeightLength = 24;
            this.cellSize = $(window).height() * 0.9 / this.mapArrHeightLength;// 根据屏幕高度 设置单元格长度。使得整个.container都能展现

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
                console.log(e.keyCode);

                switch( e.keyCode ){
                    case 38:  this.currentBlocksThis.rotate(); break; // ↑ 旋转
                    case 37:  this.currentBlocksThis.moveHorizontal( false ); break; // ←
                    case 39:  this.currentBlocksThis.moveHorizontal( true ); break; // →
                    case 40:  this.currentBlocksThis.fall( true ); break; // ↓
                }

            }.bind( this ));
        },

        // 注册 进入下一轮 生成方块组 事件
        addNextBlocksEventListener: function() {

            $('.container').on('nextEvent', function(){

                //console.log( 'nextEvent' );

                // 不是游戏开始
                if( this.currentBlocksThis ){

                    // 查看是否要移除行
                    var _startRow = this.currentBlocksThis.blocksPos.top;
                    var _length = this.currentBlocksThis.blocksArr.length;
                    //console.log( _startRow );
                    //console.log( _length );
                    for( var i=_startRow; i < _startRow + _length; i++ ){
                        this.isRemoveRow( i ); // 判断是否 移除一行（参数：行号，从0开始）若是则移除
                    }
                }

                // 创建一组 方块（4个一组）
                var _newBlock = new $.blocksClass();
                this.container.append( _newBlock.$blocks );

                this.currentBlocksThis = _newBlock;// 当前正在控制的 方块组 的this指针
                this.currentBlocksThis.fall( false );// 下落

            }.bind( this ));
        },

        // 判断是否 移除一行（参数：行号，从0开始）若是则移除
        isRemoveRow: function( rowIndex ){

            if( rowIndex >= this.mapArrHeightLength ) return;

            var _isRemove = true;// 是否移除该行
            for( var j=0; j < this.mapArrWidthLength; j++ ){
                if( !this.mapArr[rowIndex][j] ) _isRemove = false;
            }

            // 要移除
            if( _isRemove ){

                // 修改 this.mapArr[]

                // 整体下移
                for( var i = rowIndex-1; i >= 0; i-- ){
                    this.mapArr[i+1] = this.mapArr[i].concat();
                }

                // 第一行 全部初始化为0
                this.mapArr[0] = [];
                for( var i=0; i < this.mapArrWidthLength; i++ ) {
                    this.mapArr[0].push(0);
                }
                //console.log( this.mapArr );

                // 修改 html （删除本行，下移）
                var blocksArr = $('.container').find('img.block');
                var shouldBeMovedBlocksArr = [];// 要被 下移一格的 方块数组

                // 删除本行
                for( var i=0; i < blocksArr.length; i++ ){

                    var $block = blocksArr.eq(i);

                    if( Math.abs( $block.position().top - rowIndex * this.cellSize ) <= this.cellSize * 0.1 ){ // 就是在rowIndex行（有一定误差）
                        $block.remove();// 移除

                    }else if( rowIndex * this.cellSize - $block.position().top >= this.cellSize * 0.8 ){ // rowIndex行 上面
                        shouldBeMovedBlocksArr.push( $block );// 压入 jq对象
                    }
                }
                //console.log( shouldBeMovedBlocksArr );

                // 下移
                for( var i=0; i < shouldBeMovedBlocksArr.length; i++ ){
                    shouldBeMovedBlocksArr[i].css( 'top', '+=' + this.cellSize + 'px' );
                }


                // 加分
                this.score += 10;
                $('.score').text( this.score );
            }
        },
    }
})( jQuery );

var init = index.init.bind( index );