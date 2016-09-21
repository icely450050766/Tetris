/**
 * Created by Administrator on 2016/9/20.
 */

( function( $ ){

    // 方块组的类型（5种）
    var allBlocksType = [
        {  blocksArr0: [], blocksArr90: [], blocksArr180: [], blocksArr270: [] },
        {  blocksArr0: [], blocksArr90: [], blocksArr180: [], blocksArr270: [] },
        {  blocksArr0: [], blocksArr90: [], blocksArr180: [], blocksArr270: [] },
        {  blocksArr0: [], blocksArr90: [], blocksArr180: [], blocksArr270: [] },
        {  blocksArr0: [], blocksArr90: [], blocksArr180: [], blocksArr270: [] },
    ];

    // 0:
    allBlocksType[0].blocksArr0[0] = [1,0,0];
    allBlocksType[0].blocksArr0[1] = [1,1,0];
    allBlocksType[0].blocksArr0[2] = [1,0,0];

    allBlocksType[0].blocksArr90[0] = [1,1,1];
    allBlocksType[0].blocksArr90[1] = [0,1,0];
    allBlocksType[0].blocksArr90[2] = [0,0,0];

    allBlocksType[0].blocksArr180[0] = [0,0,1];
    allBlocksType[0].blocksArr180[1] = [0,1,1];
    allBlocksType[0].blocksArr180[2] = [0,0,1];

    allBlocksType[0].blocksArr270[0] = [0,0,0];
    allBlocksType[0].blocksArr270[1] = [0,1,0];
    allBlocksType[0].blocksArr270[2] = [1,1,1];

    // 1:
    allBlocksType[1].blocksArr0[0] = [1,1,0];
    allBlocksType[1].blocksArr0[1] = [0,1,0];
    allBlocksType[1].blocksArr0[2] = [0,1,0];

    allBlocksType[1].blocksArr90[0] = [0,0,1];
    allBlocksType[1].blocksArr90[1] = [1,1,1];
    allBlocksType[1].blocksArr90[2] = [0,0,0];

    allBlocksType[1].blocksArr180[0] = [0,1,0];
    allBlocksType[1].blocksArr180[1] = [0,1,0];
    allBlocksType[1].blocksArr180[2] = [0,1,1];

    allBlocksType[1].blocksArr270[0] = [0,0,0];
    allBlocksType[1].blocksArr270[1] = [1,1,1];
    allBlocksType[1].blocksArr270[2] = [1,0,0];

    // 2:
    allBlocksType[2].blocksArr0[0] = allBlocksType[2].blocksArr90[0] = allBlocksType[2].blocksArr180[0] = allBlocksType[2].blocksArr270[0] = [1,1];
    allBlocksType[2].blocksArr0[1] = allBlocksType[2].blocksArr90[1] = allBlocksType[2].blocksArr180[1] = allBlocksType[2].blocksArr270[1] = [1,1];

    // 3:
    allBlocksType[3].blocksArr0[0] =  allBlocksType[3].blocksArr180[0] = [1,0,0];
    allBlocksType[3].blocksArr0[1] =  allBlocksType[3].blocksArr180[1] = [1,1,0];
    allBlocksType[3].blocksArr0[2] =  allBlocksType[3].blocksArr180[2] = [0,1,0];

    allBlocksType[3].blocksArr90[0] = allBlocksType[3].blocksArr270[0] = [0,1,1];
    allBlocksType[3].blocksArr90[1] = allBlocksType[3].blocksArr270[1] = [1,1,0];
    allBlocksType[3].blocksArr90[2] = allBlocksType[3].blocksArr270[2]=  [0,0,0];

    // 4:
    allBlocksType[4].blocksArr0[0] = allBlocksType[4].blocksArr180[0] = [0,1,0,0];
    allBlocksType[4].blocksArr0[1] = allBlocksType[4].blocksArr180[1] = [0,1,0,0];
    allBlocksType[4].blocksArr0[2] = allBlocksType[4].blocksArr180[2] = [0,1,0,0];
    allBlocksType[4].blocksArr0[3] = allBlocksType[4].blocksArr180[3] = [0,1,0,0];

    allBlocksType[4].blocksArr90[0] = allBlocksType[4].blocksArr270[0] = [0,0,0,0];
    allBlocksType[4].blocksArr90[1] = allBlocksType[4].blocksArr270[1] = [1,1,1,1];
    allBlocksType[4].blocksArr90[2] = allBlocksType[4].blocksArr270[2]=  [0,0,0,0];
    allBlocksType[4].blocksArr90[3] = allBlocksType[4].blocksArr270[3]=  [0,0,0,0];

    $.allBlocksType = allBlocksType;

})( jQuery );
