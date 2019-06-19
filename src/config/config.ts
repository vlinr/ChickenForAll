const config:any={
   sex:1,   //用户的性别
   openId:'',   //用户的openId
   bannerAd:null,
   userInv:0,
   userPage:1,
   fromChannel:'keen',
   upUserInfoId:0,   //上层用户ID
   cookie:'',
   userMaxScore:1, //最大成绩
   lookNum:0,   //看视频次数
   shareText:['这吃鸡，也太简单了吧！'],
   getGift:false,  //当天是否已领取签到
   audio:false,//音效关闭
   sound:false, //背景音乐关闭
   openSuccess:true ,
   invArray:[30,30,30,50,50,50,80,80,80,100,100,100,200,200,200],
   bossHpArr:[1000,1500,1500,2000,2000],
   userHp:1000, //用户血量，满血
   userNowHp:1000,   //用户当前血量
   userUpArr:[],  //用户的存档
   useUpLevel:false, //是否使用存档
   getDayGift:false, //是否领取每日礼包
   nowLevel:0, //当前关卡
   passLevel:0,//下一关的目标
   passOk:false,//是否过关
   showTxt:false,//是否显示过关提示
   prop:{  //四种道具的数量
    'cz':1, 'pen':1, 'resetImg':1, 'bomb':1
   },
   zsNum:0,   //钻石的个数
   confirmBS:0, //是否确认使用笔刷
   levelGetNum:1,   //每局的第一次领取是免费，其余的看广告拉取
   loginData:{},    //登录的数据
   authorize:false,   //是否授权
   nickName:'无名',
   userImg:'jiazai/d.png',
   shareNum:0,
   shareSuccess:false,
   saveLevelInfo:null,//存档信息
   gameOver:false,  //是否走的游戏结束
   wqPZ:[],
   gone:[
       {
           name:'sgone', //枪名称
            zdNum:2,  //需要子弹数
            level:1,   //等级
            upMoney:100,  //升级所需
            sh:20,  //基础伤害
        },
        {
            name:'cgone',
             zdNum:4,
             level:1,
             upMoney:100,
             sh:40,
         },{
            name:'dgone',
             zdNum:10,
             level:1,
             upMoney:100,
             sh:100,
         }
         ,{
            name:'bgone',
             zdNum:6,
             level:1,
             upMoney:100,
             sh:60
         },{
            name:'jgone',
             zdNum:8,
             level:1,
             upMoney:100,
             sh:80
         }
   ],
   testHp:10000,
   btPlay:false,//变态开始？
}
export default config;