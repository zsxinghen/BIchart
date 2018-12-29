/*
*数据配置---数据规则配置
*/
<template>
  <board-toast :config="dialogConfig" @cancel="close" @save="save" class="data-rule-config">
    <!-- 设置筛选 -->

    <h1>规则设置</h1>
    <div class="data-filter-top">
      <p v-for="(item,i) in setArr" :key="i">
        <el-select v-model="item.prop" placeholder="请选择" size="mini" style="margin:0 10px 0 20px">
          <el-option v-for="item in list" :key="item.alias" :label="item.remark" :value="item.alias" :disabled="item.disabled"></el-option>
        </el-select>
        <el-select v-model="item.symbol" placeholder="请选择" size="mini" style="margin:0 10px 0 20px">
          <el-option v-for="item in options.symbol" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input v-model="item.value" size="mini" style="width:200px"></el-input>
        <el-button type="text" icon="el-icon-delete" style="margin:0 10px" :disabled="setArr&&setArr.length<=1" @click="setArr.pop();"></el-button>
        <el-button type="text" icon="el-icon-plus" style="margin:0 10px" v-show="i==(setArr.length-1)" :disabled="setArr&&setArr.length>=10"
          @click="setArr.push({
          prop: '',
          symbol: '',
          value: ''
        })"></el-button>
      </p>
    </div>
    <!-- 过滤规则显示 -->
    <h1>数据规则显示</h1>
    <div class="data-filter-content">
      <p v-for="(item,index) in filterArr" :key="index">{{item}}</p>
    </div>
  </board-toast>
</template>
<script>
export default {
  data() {
    return {
      value: "",
      dialogConfig: {
        title: "过滤规则配置", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "800px", //弹窗宽
        btnData: ["cancel", "save"],
        appendToBody: true
      },
      setArr: [], // 配置数组
      filterArr: [], // 筛选数组
      options: {
        symbol: [
          {
            label: "大于",
            value: ">"
          },
          {
            label: "小于",
            value: "<"
          },
          {
            label: "不等于",
            value: "!="
          },
          {
            label: "大于等于",
            value: ">="
          },
          {
            label: "小于等于",
            value: "<="
          },
          {
            label: "等于",
            value: "="
          },
          {
            label: "包含",
            value: "in"
          }
        ]
      }
    };
  },
  watch: {
    setArr: {
      deep: true,
      handler() {
        this.filterArr = [];
        if (this.setArr) {
          this.setArr.forEach(v => {
            let str, value;
            if (v.symbol == "in") {
              str = v.prop + " like concat('%' ," + v.value + " , '%')";
            } else {
              if (v.value) {
                value = " '" + v.value + "'";
              } else {
                value = "";
              }
              str = v.prop + " " + v.symbol + value;
            }
            this.filterArr.push(str);
          });
          this.list.forEach(v => {
             v.disabled = false;
            let flag = this.setArr.findIndex(k => k.prop == v.alias);
            console.log(flag);
            if (flag != -1) {
              v.disabled = true;
            }
          });
        }
      }
    }
  },
  props: {
    dataConfig: {
      type: Object,
      default: () => null
    },
    config: {
      type: Object,
      default: () => null
    },
    ruleForm: {
      type: Object,
      default: () => null
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    show() {
      this.filterArr = this.ruleForm.findCondJson || [];
      this.setArr = this.ruleForm.findCond || [
        {
          prop: "",
          symbol: "",
          value: ""
        }
      ];
      this.dialogConfig.dialogVisible = true;
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    save() {
      this.$set(this.ruleForm, "findCond", this.setArr);
      this.$set(this.ruleForm, "findCondJson", this.filterArr);
      this.dialogConfig.dialogVisible = false;
    }
  }
};
</script>
<style lang="less">
.data-rule-config {
  .data-filter-top {
    width: 100%;
    min-height: 100px;
    margin-bottom: 20px;

    ul {
      li {
        height: 40px;
        line-height: 40px;
      }
    }
  }

  .data-filter-content {
    width: 100%;
    min-height: 100px;
    overflow-y: auto;
    box-sizing: border-box;
    word-break: break-all;
    margin-bottom: 20px;
    padding: 5px 10px;
    border: 1px solid #d1d3d5;
  }

  h1 {
    // margin-left: 25px;
    margin-bottom: 10px;
    font-size: 16px;
  }

  h1:before {
    content: " ";
    border: 2px solid #000;
    margin-right: 10px;
  }
}
</style>
