export default {
    //默认路由
    defaultView:'/blog',
    /*目录颜色*/
    colors: [
        '#2dd5eb',
        '#fcd692',
        '#f1aaff',
        '#1ed693',
        '#eeff2d',
        '#f6a51b',
        '#5ed5d1',
        '#ff6e97',
        '#f14a74',
        '#6cf0e5',
        '#c7ffec',
        '#00ff80',
        '#f56f59',
    ],
    /*Card的图片*/
    imgs: [
        'material1.png', 'material2.png', 'material3.png', 'material4.png',
        'material5.png', 'material6.png', 'material7.png', 'material8.png', 'material9.png',
        'spot1.jpg', 'spot2.jpg', 'spot3.jpg', 'spot4.jpg', 'spot5.jpg',
    ],
    /*博客日志的横幅图片*/
    blogBanners:["banner1.jpg","banner2.jpg","banner3.jpg","banner4.jpg","banner5.jpg","banner6.jpg","banner7.jpg"],
    /*侧边栏是否展开*/
    sideBarCollapse: true,
    /*顶部操作栏是否展开*/
    showTopOperationBar: true,
    /*默认Card多大(只能30% 50% 100%其中一个)*/
    cardPercent: sessionStorage.getItem('cardPercent') || "30%",
}
