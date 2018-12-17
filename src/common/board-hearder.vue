<template>
    <div class="board-hearder">
         <div class="board-header-account">
             <img :src="getAccountInfo.appLogo" class="board-header-logo">
             <div class="board-header-info">
                 <h3>{{getAccountInfo.accountName}}</h3>
                 <p>{{getAccountInfo.accountEnglist}}</p>
             </div>
         </div> 
         <div class="board-header-menu" @click.stop="selectMenu($event)">
              <div class="menu-item" data-index="1" :class="{'active':currentRouter==1}">{{$t('headrder.board')}}</div>
              <div class="menu-item" data-index="2" :class="{'active':currentRouter==2}">{{$t('headrder.layout')}}</div>
              <div class="menu-item" data-index="3" :class="{'active':currentRouter==3}">{{$t('headrder.chart')}}</div>
         </div>
    </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex'
export default {
    data () {
        return {
            currentRouter:1
        }
    },
    methods:{
        selectMenu($event){//tab切换
            // this.setCurrRouter($event.target.dataset.index-0);
            this.currentRouter=($event.target.dataset.index)
            if(this.currentRouter==1)
                this.$router.push('/')
            else if(this.currentRouter==2)
                this.$router.push('/layoutCenter')
            else 
                this.$router.push('/majorBorder')
        }
    },
    computed: {
        ...mapGetters(['getAccountInfo'])
    }
}
</script>
<style lang="less">
   .board-hearder{
       display: flex;
       height: 80px;
       background-color: #f0f2f3;
       box-shadow: 0px 3px 5px rgba(24, 27, 45, 0.2);
       .board-header-account{
           width: 300px;
           display: flex;
           box-sizing: border-box;
           padding: 20px 0 0 55px;
           background-color: #dee3e8;
       }
       .board-header-logo{
           width: 40px;
           height: 40px;
           margin-right: 15px;
       }
       .board-header-info{
           width: 170px;
           text-align: left;
           h3{
            font-size: 16px;
            color: #535353;
           }
           p{
            font-size: 9px;
            color: #535353;
            margin-top: 2px;
           }
           h3,p{
             white-space: nowrap;
             overflow: hidden;
             text-overflow: ellipsis;
           }
       }
       .board-header-menu{
           display: flex;
           line-height: 80px;
           color: #9798a5;
           font-size: 16px;
           .menu-item{
               width: 114px;
               text-align: center;
               cursor: pointer;
           }
           .menu-item:hover{
                background-color: white;
                color: #303133;
           }
           .menu-item.active{
               color: #409EFF;
               position: relative;
               background-color: white;
               &::after{
                   content: '';
                   position: absolute;
                   height: 2px;
                   width: 100%;
                   background-color: #409EFF;
                   bottom: 0;
                   left: 0;
               }
           }
       }
   }
</style>

