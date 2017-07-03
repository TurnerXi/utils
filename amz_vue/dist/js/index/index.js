var app = new Vue({
      el:"#top",
      data:{
        is_show_more_list:false,
        banners:[ ],
        icons:[ ]
      },
      computed:{
        icons_sort:function(){
          return this.icons.sort(function(a,b){
            return a.order - b.order;
          });
        }
      },
      watch:{
        banners:function(val){
          this.$nextTick(function () {
            $(".am-slider").flexslider();
          });
        } 
      },
      methods:{
        show_more:function(){
            this.is_show_more_list = true;
        },
        open_page:function(url){
          window.location=url;
        },
        hide_more_list:function(){
          this.is_show_more_list = false;
        }
      }
});
$(function(){
    app.banners = [
       {pic:"img/fl01.png",emoji:" (╭￣3￣)╭♡   ",title:"“大白”有望成为现实：充气机器人研究取得进展"},
       {pic:"img/fl02.png",emoji:" []~(￣▽￣)~*　",title:"已然魔性的雪橇犬哈士奇 —《雪地狂奔》"},
       {pic:"img/fl03.png",emoji:" (｡・`ω´･)　"    ,title:"《星际争霸2:虚空之遗》国服过审!"},
       {pic:"img/fl02.png",emoji:" []~(￣▽￣)~*　",title:"已然魔性的雪橇犬哈士奇 —《雪地狂奔》"},
    ];
    //模拟icon后台排序
  	app.icons.push({order:3,class:"pet_nav_kantuya",iconfont:"&#xe62c;",name:"阅读",url:"void();"});
  	app.icons.push({order:2,class:"pet_nav_zhangzhishi",iconfont:"&#xe607;",name:"趣闻",url:"void();"});
  	app.icons.push({order:1,class:"pet_nav_xinxianshi",iconfont:"&#xe61e;",name:"新鲜事",url:"void();"}) ;
  	app.icons.push({order:4,class:"pet_nav_mengzhuanti",iconfont:"&#xe622;",name:"专题",url:"void();"}) ;
  	app.icons.push({order:5,class:"pet_nav_meirong",iconfont:"&#xe629;",name:"订阅",url:"void();"}) ;
  	app.icons.push({order:6,class:"pet_nav_yiyuan",iconfont:"&#xe602;",name:"专栏",url:"void();"}) ;
  	app.icons.push({order:7,class:"pet_nav_dianpu",iconfont:"&#xe604;",name:"讨论",url:"void();"}) ;
        $.ajax({
          type:"get",
          url:"http://api.tianapi.com/social/?key=a343a3c5008d35a44102088aa2e057f9&num=10",
          dataType:"json",
          asyn:false,
          success:function(data){
            console.log(data);
          }
        });
});

$(function(){
   // 动态计算新闻列表文字样式
    auto_resize();
    $(window).resize(function() {
        auto_resize();
    });
    $('.am-list-thumb img').load(function(){
        auto_resize();
    });

    $('.am-list > li:last-child').css('border','none');

    function auto_resize(){
        $('.pet_list_one_nr').height($('.pet_list_one_img').height());
    }
    
    // $('.pet_nav_gengduo').on('click',function(){
    //       $('.pet_more_list').addClass('pet_more_list_show');
    // });
    // $('.pet_more_close').on('click',function(){
    //     $('.pet_more_list').removeClass('pet_more_list_show');
    // });
})