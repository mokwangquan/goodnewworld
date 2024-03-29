<template>
  <div id="info">
    <el-card>
      <img class="logo" src="@/assets/gnw-logo.png"/>
      <p class="credit">Designed and built by Mok Wang Quan :)</p>
      <p class="instruction" v-if="active == 0">
        {{ isEnglish ? 'Welcome !' : '欢迎！' }}<br/>
        {{ isEnglish ? "Please add the required foods below and proceed by tapping on 'Next'" 
        : "请选择您要的食物，然后点'下一步'" }}
      </p>
      <!-- Step 1 -->
      <el-card v-if="active == 1" class="order-basic-info">
        <template slot="header">
          <el-row type="flex" justify="center">
            <el-radio-group v-model="type" size="mini">
              <el-radio-button label="Dine-in">{{ isEnglish ? 'Dine-in' : '堂食' }}</el-radio-button>
              <el-radio-button label="Takeaway">{{ isEnglish ? 'Takeaway' : '打包' }}</el-radio-button>
              <el-radio-button label="Delivery">{{ isEnglish ? 'Delivery' : '外送' }}</el-radio-button>
            </el-radio-group>
          </el-row>
        </template>
        <el-col>
          <div class="label">{{ isEnglish ? 'Date' : '日期' }}</div>
          <el-date-picker
            v-model="date"
            type="date"
            format='yyyy-MMM-dd'
            :placeholder="isEnglish ? 'Select date' : '请选择日期'"
            @focus="e => e.blur()"
          />
        </el-col>
        <el-col>
          <el-time-select
            v-model="time"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '22:30'
            }"
            :placeholder="isEnglish ? 'Select time' : '请选择时间'"
            @focus="e => e.blur()"
          />
        </el-col>
        <el-col>
          <div class="label">{{ isEnglish ? 'Name' : '名字' }}</div>
          <el-input :placeholder="isEnglish ? 'Please key in your name' : '如何称呼您？'" 
            v-model="name"></el-input>
        </el-col>
        <el-col>
          <div class="label">{{ isEnglish ? 'Number of people' : '人数' }}</div>
          <el-input-number :min="0" class="num-of-ppl" size="large" v-model="numOfPpl"></el-input-number>
        </el-col>
        <el-col>
          <div class="label">
            {{ isEnglish ? 'Language preferences' : '语言' }}
            <br/>
            ({{ isEnglish ? 'while communicating with our person in charge' : '当和我们的负责人沟通时用的语言' }})
          </div>
          <el-radio-group v-model="languagePreference" size="large">
            <el-radio-button label="Chinese">中文</el-radio-button>
            <el-radio-button label="English">English</el-radio-button>
          </el-radio-group>
        </el-col>
        <h4>{{ isEnglish ? 'Please confirm the order below' : '请确定以下的订单' }}</h4>
        <el-table
          :empty-text="isEnglish ? 'No order added' : '没有食物'"
          :data="orders">
          <el-table-column :label="isEnglish ? 'Food Added' : '订单'">
            <template slot-scope="scope">
              {{ isEnglish ? scope.row.name.english : scope.row.name.chinese}}
              ({{ parseSize(scope.row.size) }})
            </template>
          </el-table-column>
          <el-table-column prop="amount" width="50"/>
        </el-table>
        <h5>{{ isEnglish ? 'Total' : '总共' }} : {{ orders.length }}</h5>
      
        <el-row type="flex" justify="center">
          <div>
            {{ isEnglish ? 'Click below to open Whatsapp and send order' : '按下方打开Whatsapp然后交订单' }}
            <el-button  @click="getLink()"><img class="logo" src="@/assets/whatsapp-logo.png"/></el-button>
          </div>
        </el-row>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import { foods } from  '@/constants/foods.js'

export default {
  props: {
    active: {
      type: Number,
      required: true,
    },
    orders: {
      type: Array,
    },
    language: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      type: 'Dine-in',
      date: null,
      time: null,
      name: '',
      numOfPpl: 0,
      languagePreference: 'Chinese',

    }
  },
  methods: {
    haveInvalidField() {
      if (this.date == null) return true
      if (this.time == null) return true
      if (this.name == null || this.name == '') return true
      if (this.numOfPpl == 0) return true
      return false
    },
    getLink() {
      if (this.active == 1) {
        if (this.haveInvalidField()){
          this.$message.error(this.isEnglish ? 'Oops, Please key in all field.' : '请填写所有资料' )
          return
        }
        location.href = `https://wa.me/60126549696?text=${this.getWhatsappMsg()}`
      }
    },
    getWhatsappMsg() {
      const nextLine="%0A"
      let result = `您好 Madam Tan, 我是${this.name}. 这是从网站order：`
      result += nextLine
      result += `语言: ${this.languagePreference}`
      result += nextLine
      result += `种类: ${this.type}`
      result += nextLine
      result += `时间: ${moment(this.date).format('YYYY-MMM-DD (ddd)')} ${moment(this.time, 'HH:mm').format('hh:mma')}`
      result += nextLine
      result += `人数: ${this.numOfPpl}`
      result += nextLine
      result += `----- 菜单 -----`
      result += nextLine
      if (this.orders.length > 0) {
        this.orders.forEach(order => {
          let found = foods.find(el => el.id == order.id)
          let price = found.price ? found.price[order.size] : '时价'
          result += `${price} -> ${found.name.chinese}`
          result += nextLine
        })
      } else {
        result += `没添加任何食物`
      }
      return result
    },
    parseSize(size) {
      if (size == 'small') return this.isEnglish ? 'S' : '小'
      else if (size == 'medium') return this.isEnglish ? 'M' : '中'
      else if (size == 'big') return this.isEnglish ? 'B' : '大'
      else return this.isEnglish ? 'Y' : '要'
    }
  },
  computed: {
    isEnglish() {return this.language == 'english'},
  },
  watch: {
  },
}
</script>

<style lang="scss">
#info {
  img.logo {
    height: 5rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .credit {
    font-size: 0.5rem;
    text-align: center;
  }
  .instruction {
    font-size: 1.2rem;
    text-align: center;
  }
  .order-basic-info {
    .label {
      font-weight: bold;
    }
    .el-col {
      margin-bottom: 1rem;
      >* {
        margin-bottom: 0.5rem;
        float: right;
        &.label {
          float: left;
        }
      }
    }
    .el-row {
      margin: 0.5rem 0;
    }
    .num-of-ppl {
      margin-left: 0.5rem;
    }
    .el-date-editor {
      width: 100%;
    }
    h4 {
      padding-top: 4rem;
      text-decoration: underline;
    }
  }
  .active {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
  }
}
</style>