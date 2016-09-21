/**
 * Created by Administrator on 2016/9/19.
 */

/* 方块组 类 */

;( function(){

    // 构造函数
    var blocksClass = function(){

        this.type = -1;// 方块组类型
        this.isRight = true;// 是否右转（只对4、5类型的方块组有效）

        this.fallInterval = null;// 下落 setInterval 句柄
        this.blocksArr = [];// 存放 方块组 的状态数组（1表示有方块，0表示没有）（正方形）
        this.blocksPos = { left: 0, top: 0 }; // 方块组数组 左上角（0,0）在 mapArr[] 中的位置（单元格为单位）

        this.$blocks = this.createBlocks();// 存放 方块组 的jq对象

        //console.log( blocksClass.prototype.mapArr );
    };

    // 公共属性
    blocksClass.prototype.mapArr = null;
    blocksClass.prototype.cellSize = null;
    blocksClass.prototype.mapArrWidthLength = null;
    blocksClass.prototype.mapArrHeightLength = null;


    // 创建 一组方块 （返回 img 的jq对象）
    blocksClass.prototype.createBlocks = function(){

        var colorArr = [ 'red', 'green', 'yellow', 'blue' ];
        var typeArr = [ 1, 2, 3, 4, 5 ];

        var _color = colorArr[ parseInt( Math.random() * 4 ) ];// 方块组 的颜色
        this.type = typeArr[ parseInt( Math.random() * 5 ) ];// 方块组 的类型 （下标 [0,4]）

        //this.type = 5;////////////////////////

        // 根据 方块组类型，初始化 blocksArr[]
        switch( this.type ){
            case 1:{
                this.blocksArr[0] = [0,1,0];
                this.blocksArr[1] = [1,1,0];
                this.blocksArr[2] = [0,1,0];
                break;
            }
            case 2:{
                this.blocksArr[0] = [1,1,0];
                this.blocksArr[1] = [0,1,0];
                this.blocksArr[2] = [0,1,0];
                break;
            }
            case 3:{
                this.blocksArr[0] = [1,1];
                this.blocksArr[1] = [1,1];
                break;
            }
            case 4:{
                this.blocksArr[0] = [1,0,0];
                this.blocksArr[1] = [1,1,0];
                this.blocksArr[2] = [0,1,0];
                break;
            }
            case 5:{
                this.blocksArr[0] = [0,1,0,0];
                this.blocksArr[1] = [0,1,0,0];
                this.blocksArr[2] = [0,1,0,0];
                this.blocksArr[3] = [0,1,0,0];
                break;
            }
        }


        // 方块组数组 左上角（0,0）在 mapArr[] 中的位置（单元格为单位）
        this.blocksPos.left = parseInt( ( blocksClass.prototype.mapArrWidthLength - this.blocksArr.length ) / 2 );
        this.blocksPos.top = -this.blocksArr.length;


        // 对象数组，存放 所有 为1的元素 所在的 横、纵下标
        var objArr = this.find_1_pos( this.blocksArr );
        //console.log( objArr );

        // 生成 html元素
        var _content = '';
        for( var i=0; i < objArr.length; i++ ){

            var _left = ( objArr[i].left + this.blocksPos.left ) * this.cellSize;
            var _top = ( objArr[i].top + this.blocksPos.top ) * this.cellSize;

            _content += '<img class="block" src="img/' + _color + 'Block.png" style="top: ' + _top + 'px; left: ' + _left + 'px;">';
        }
        var $_content = $( _content );// 方块组 的jq对象

        // 设置 每个方块 图片的宽高
        $_content .css({
            "width" : this.cellSize + 'px',
            "height" : this.cellSize + 'px',
        });

        return $_content; // 返回jq对象
    };

    // 旋转 ( 每调用一次，只能右转 )
    blocksClass.prototype.rotate = function(){

        if( this.type <= 3 ) this.isRight = true;// 1/2/3 类型的 方块组，只能右转 ( 是否右转，只对 4、5类型 的方块组有效 )

        var _arrLength = this.blocksArr.length;// 数组长度，宽和高 相等的 二维数组
        //console.log( _arrLength );
        //this.showBlocksArr();

        // 复制数组（ 二维数组不能直接用 concat() 复制 ）
        var _tempArr = concatTwoDimensionalArray( this.blocksArr );
        //console.log( _tempArr );


        // 数组旋转，修改 this.blocksArr
        if( this.isRight ){ // 右转

            for( var i=0; i < _arrLength; i++ ){ // 行
                for( var j=0; j < _arrLength; j++ ){ // 列
                    var m = _arrLength - 1 - i;
                    this.blocksArr[j][m] = _tempArr[i][j];
                }
            }
        }else { // 左转

            for( var i=0; i < _arrLength; i++ ){ // 行
                for( var j=0; j < _arrLength; j++ ){ // 列
                    var m = _arrLength - 1 - j;
                    this.blocksArr[m][i] = _tempArr[i][j];
                }
            }
        }

        // 判断 新位置是否能通过、是否超出边界
        canPassObj = this.isAllCanPass( this.blocksPos.left, this.blocksPos.top );
        if( !canPassObj.canPass ){ // 旋转后 整个方块组 （某些方块 不能通过）

             // 原因：1）超出边界（水平方向不通过可以移动，垂直方向不通过直接不能旋转） 2）新位置已有方块了

            // 超出边界
            if( canPassObj.leftOverFlow  ||  canPassObj.rightOverFlow  ||  canPassObj.topOverFlow  ||  canPassObj.bottomOverFlow ){

                // 复制 方块组的当前位置（因为后面 数组水平平移 会修改 位置）
                var _blockPost = {};
                _blockPost.top = this.blocksPos.top;
                _blockPost.left = this.blocksPos.left;

                // 超出 上/下 边界， 不能通过，无法移动，无法旋转
                if( canPassObj.topOverFlow  ||  canPassObj.bottomOverFlow ){
                    this.blocksArr = concatTwoDimensionalArray( _tempArr ); return;// 无法旋转，恢复 this.blocksArr[]，不旋转
                }

                // 超出 左/右 边界
                if( canPassObj.leftOverFlow ){ // 超出左边界，右移
                    do{
                        canPassObj = this.isAllCanPass( ++_blockPost.left, _blockPost.top );
                        if( canPassObj.rightOverFlow ){ // 无法右移
                            this.blocksArr = concatTwoDimensionalArray( _tempArr ); return;// 无法旋转，恢复 this.blocksArr[]，不旋转
                        }
                    }while( canPassObj.leftOverFlow ); // 超出左边界（不再 超出左边界 跳出）

                }else if( canPassObj.rightOverFlow ) { // 超出右边界，左移
                    do {
                        canPassObj = this.isAllCanPass(--_blockPost.left, _blockPost.top);
                        if ( canPassObj.leftOverFlow ) { // 无法左移
                            this.blocksArr = concatTwoDimensionalArray(_tempArr);  return;// 无法旋转，恢复 this.blocksArr[]，不旋转
                        }
                    } while ( canPassObj.rightOverFlow ); // 超出右边界（不再 超出右边界 跳出）
                }
            }

            // 没有超出边界，判断是否可通过（新位置是否已经存在方块了）
            if( !canPassObj.canPass ){
                this.blocksArr = concatTwoDimensionalArray(_tempArr);  return;// 无法旋转，恢复 this.blocksArr[]，不旋转

            }else{// 可以通过：修改位置，html 旋转

                this.blocksPos.left = _blockPost.left;
                this.blocksPos.top = _blockPost.top;
                htmlRotate.call( this ); // html 旋转
            }

        }else{ // 能通过
            htmlRotate.call( this ); // html 旋转
        }

        // （辅助函数）二维数组 的复制（不能直接使用concat）
        function concatTwoDimensionalArray( arr ){
            var _tempArr = [];
            for( var i=0; i < arr.length; i++ ){
                _tempArr[i] = arr[i].concat();
            }
            return _tempArr;
        }

        // （辅助函数） 可以旋转，html 旋转成 this.blocksArr[] （this 是 blocksClass类对象 ）
        function htmlRotate(){

            this.isRight = !this.isRight; // 旋转后 取反
            //this.showBlocksArr();

            // html元素 旋转（设置每个方块的位置）
            var obj = this.find_1_pos( this.blocksArr );// 获取每个方块 相对于 this.blocksPos 的 left、top（单元格为单位）
            //console.log( obj );

            for( var i=0; i < obj.length; i++ ){
                this.$blocks.eq(i).css({
                    "top" : ( obj[i].top + this.blocksPos.top ) * this.cellSize + 'px',
                    "left" : ( obj[i].left + this.blocksPos.left ) * this.cellSize + 'px',
                })
            }
        }

    };

    // 下落（ 是否快速下落）
    blocksClass.prototype.fall = function( isQuick ){

        var speed = isQuick ? 10 : 500; // 下落速度

        if( this.fallInterval ){ // 原本已经在下落
            clearInterval( this.fallInterval);// 取消原本的下落
        }

        // 下落过程
        this.fallInterval = setInterval( function(){

            fallOneStep.call( this ); //  下落一步

        }.bind( this ), speed );


        // （辅助函数） 下落一步（ this 是 blocksClass类对象）
        function fallOneStep(){

            var canPassObj = this.isAllCanPass( this.blocksPos.left, this.blocksPos.top + 1);

            // 不能通过，则停下
            if( !canPassObj.canPass ){

                clearInterval( this.fallInterval );// 停止下落

                // 更新 mapArr
                var obj = this.find_1_pos( this.blocksArr );// 获取每个方块 相对于 this.blocksPos 的 left、top（单元格为单位）
                for( var i=0; i < obj.length; i++ ){ // 把 4个方块的位置 更新到数组

                    var left = this.blocksPos.left + obj[i].left;
                    var top = this.blocksPos.top + obj[i].top;

                    if( top < 0 ) this.$blocks.eq(0).trigger('gameOver');// top比顶部还高，游戏结束
                    blocksClass.prototype.mapArr[top][left] = 1;
                }
                //console.log( blocksClass.prototype.mapArr );

                this.$blocks.eq(0).trigger('nextEvent');// 触发事件 进入下一轮
                return;
            }

            // 方块组 到达新位置
            for( var i=0; i < this.$blocks.length; i++ ){
                this.$blocks.eq(i).css( "top" , '+=' + this.cellSize + 'px' );
            }
            this.blocksPos.top ++;// 方块组位置 整体 改变
        }

    };

    // 水平移动
    blocksClass.prototype.moveHorizontal = function( isRight ) {

        var _newBlocksPos = { left: this.blocksPos.left, top: this.blocksPos.top };
        if( isRight ) _newBlocksPos.left ++;
        else _newBlocksPos.left --;

        // 整个方块组 都可通过
        if( this.isAllCanPass( _newBlocksPos.left, _newBlocksPos.top).canPass ){

            // 方块组 到达新位置
            for( var i=0; i < this.$blocks.length; i++ ){

                if( isRight ) this.$blocks.eq(i).css( "left" , '+=' + this.cellSize + 'px' );
                else this.$blocks.eq(i).css( "left" , '-=' + this.cellSize + 'px' );
            }
            this.blocksPos.left = _newBlocksPos.left;// 方块组位置 整体 改变

        }
    };


    // 判断 整个方块组是否可以通过（参数：整个方块组的 新的位置）返回一个对象，有以下属性：是否能通过、哪个方向不能通过（左、右、上、下）
    blocksClass.prototype.isAllCanPass = function( blocksPosLeft, blocksPosTop ){

        // 返回的对象（上下左右 4个方向是否能通过，主要是旋转的时候有用。下落的时候只要判断canPass即可）
        var returnObj = { canPass: true, leftOverFlow: false, rightOverFlow: false, bottomOverFlow: false, topOverFlow: false };

        var obj = this.find_1_pos( this.blocksArr );// 获取每个方块 相对于 this.blocksPos 的 left、top（单元格为单位）

        // 判断 4个方块 是否 都能到达 新位置
        for( var i=0; i < obj.length; i++ ){

            if( !isCanPass.call( this, blocksPosLeft + obj[i].left, blocksPosTop + obj[i].top ) ){
                returnObj.canPass = false;
            }
        }
        //console.log( returnObj );
        return returnObj;


        // （辅助函数）某个方块 是否能通过新位置
        function isCanPass( posX, posY ){

            // 超出 左右边界、下边界
            if( posX < 0 ){ returnObj.leftOverFlow = true;  return false; }
            if( posX >= this.mapArrWidthLength ){ returnObj.rightOverFlow = true;  return false; }
            if( posY >= this.mapArrHeightLength ){ returnObj.bottomOverFlow = true;  return false; }

            if( posX >= 0  &&  posY >= 0  ){

                // 已经有方块在 新位置了
                if( blocksClass.prototype.mapArr[posY][posX] ) return false;
            }
            return true;
        }

    };


    // 寻找 二维数组中 为“1”的元素 的横、纵下标，返回一个数组
    blocksClass.prototype.find_1_pos = function( arr ){

        var _arr = [];
        for( var i=0; i < arr.length; i++ ){ // 行
            for( var j=0; j < arr[i].length; j++ ){ // 列
                if( arr[i][j] ) _arr.push( { left: j, top: i } );
            }
        }
        return _arr;
    };

    // 输出 blocksArr[]
    blocksClass.prototype.showBlocksArr = function(){
        for( var i=0; i < this.blocksArr.length; i++ ){
            console.log( this.blocksArr[i][0] + ' ' + this.blocksArr[i][1] + ' ' + this.blocksArr[i][2] + ' ' + this.blocksArr[i][3] )
        }
        console.log('\n');
    };

    // 添加到jquery
    $.blocksClass = blocksClass;

})( jQuery );