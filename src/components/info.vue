<template>
  <div id="info">
    <el-card>
      <img class="logo" src="@/assets/gnw-logo.png"/>
      <el-steps :active="active" finish-status="success">
        <el-step :title="isEnglish ? 'Step 1' : '步骤 1'"></el-step>
        <el-step :title="isEnglish ? 'Step 2' : '步骤 2'"></el-step>
      </el-steps>
      <!-- Step 1 -->
      <el-row class="action" type="flex" :justify="active != 0 ? 'space-between' : 'end'">
        <el-button v-show="active != 0" @click="handleStep('back')">
          {{ isEnglish ? 'Back' : '上一步' }}
        </el-button>
        <el-button v-show="active != 1" @click="handleStep('next')">
          {{ isEnglish ? 'Next' : '下一步' }}
        </el-button>
      </el-row>
      <el-divider class="horizontal"></el-divider>
      <el-card v-if="active == 1" class="order-basic-info">
        <el-row type="flex" justify="center">
          <el-radio-group v-model="type" size="large">
            <el-radio-button label="dine in">{{ isEnglish ? 'Dine-in' : '堂食' }}</el-radio-button>
            <el-radio-button label="takeaway">{{ isEnglish ? 'Takeaway' : '打包' }}</el-radio-button>
            <el-radio-button label="delivery">{{ isEnglish ? 'Delivery' : '外送' }}</el-radio-button>
          </el-radio-group>
        </el-row>
        <el-col>
          <div class="label">{{ isEnglish ? 'Date' : '日期' }}</div>
          <el-date-picker
            v-model="date"
            type="date"
            format='yyyy-MMM-dd'
            :placeholder="isEnglish ? 'Select date' : '请选择日期'">
          </el-date-picker>
        </el-col>
        <el-col>
          <el-time-select
            v-model="time"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '22:30'
            }"
            :placeholder="isEnglish ? 'Select time' : '请选择时间'">
          </el-time-select>
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
            ({{ isEnglish ? 'while communicating with our captain' : '当和我们的Captain沟通时用的语言' }})
          </div>
          <el-radio-group v-model="languagePreference" size="large">
            <el-radio-button label="chinese">中文</el-radio-button>
            <el-radio-button label="english">English</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-divider></el-divider>
        <h4>{{ isEnglish ? 'Please confirm the order below' : '请确定以下的订单' }}</h4>
        <el-table
          :empty-text="isEnglish ? 'No order added' : '没有食物'"
          :data="orders">
          <el-table-column :label="isEnglish ? 'Food Added' : '订单'">
            <template slot-scope="scope">
              {{ isEnglish ? scope.row.name.english : scope.row.name.chinese}}
            </template>
          </el-table-column>
          <el-table-column prop="amount" width="50"/>
        </el-table>
        <el-button v-if="!showLink" @click="handleConfirm">{{ isEnglish ? 'Confirm' : '确定' }}</el-button>
        <a v-else :href="getLink()">{{ isEnglish ? 'Open Whatsapp and send order' : '按我打开Whatsapp然后交订单' }}</a>
      </el-card>
      <!-- Step 2 (choose meals) -->
      <!-- Step 3 (send to Whatsapp) -->
      
    </el-card>
    <!-- FIXME: remind user to have whatsapp -->
  </div>
</template>

<script>
import moment from 'moment'
import { foods } from  '@/constants/foods.js'

export default {
  props: {
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
      active: 0,
      type: 'dine in',
      date: null,
      time: null,
      name: '',
      numOfPpl: 0,
      languagePreference: 'chinese',

      showLink: false,
    }
  },
  methods: {
    handleConfirm() {
      if (this.active == 1) {
        if (this.haveInvalidField()){
          this.$message.error(this.isEnglish ? 'Oops, Please key in all field.' : '请填写所有资料' )
          this.showLink = false
        } else {
          this.showLink = true
        }
      }
    },
    haveInvalidField() {
      if (this.date == null) return true
      if (this.time == null) return true
      if (this.name == null || this.name == '') return true
      if (this.numOfPpl == 0) return true
      return false
    },
    handleStep(direction) {
      if (direction == 'back') {
        this.$emit('showMenu', true)
        this.active--
      }
      if (direction == 'next') {
        // if (this.orders.length == 0) {
          // this.$confirm(
          //   this.isEnglish ? 'No food was added. You want to proceed to next step?' 
          //     : '您还未添加任何食物，确定下一步？'
          // , 'Warning', {
          //   confirmButtonText: 'OK',
          //   cancelButtonText: 'Cancel',
          //   type: 'warning',
          //   center: true,
          // }).then(() => {
            this.$emit('showMenu', false)
            this.active++
          // });
        // }
      }
    },
    getLink() {
      return `https://wa.me/60126549696?text=${this.getWhatsappMsg()}`
    },
    getWhatsappMsg() {
      const nextLine="%0A"
      let result = `你好 Madam Tan, 我是${this.name}. 这是从网站order：`
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
      this.orders.forEach(order => {
        let found = foods.find(el => el.id == order.id)
        result += `${order.amount} -> ${found.name.chinese}`
        result += nextLine
      })
      console.log(result, this.time)
      return result
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