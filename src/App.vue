
<template>
  <div id="app">
    <sidebar 
      v-show="showMenu" 
      :language="language"
      :orders="orders"/>
    <el-radio-group class="language-selection" size="mini" v-model="language">
      <el-radio-button label="chinese">中文</el-radio-button>
      <el-radio-button label="english">English</el-radio-button>
    </el-radio-group>
    <info
      @showMenu="(value) => this.showMenu = value"
      @passInfo="(value) => this.info = value"
      :language="language"
      :orders="orders"
      />
    <div v-show="showMenu">
      <template v-for="food in allFoods">
      <el-divider  :key="food.type.prop"/>
      <div :id="food.type.prop" class="category-title" :key="food.type.prop">
        <h4>{{ isEnglish ? food.type.english : food.type.chinese }}</h4>
      </div>
      <food-container 
        v-for="el in food.item"
        :key="el.id"
        :id="el.id"
        :language="language"
        @amountChange="handleAmountChange"
        />
      </template>
      
    </div>
    <div class="spacer"></div>
  </div>
</template>

<script>
import sidebar from '@/components/sidebar.vue'
import info from '@/components/info.vue'
import foodContainer from '@/components/food-container.vue'
import { foods } from  '@/constants/foods.js'
import { allFoodType } from  '@/constants/types.js'
export default {
  components: {
    sidebar,
    info,
    foodContainer,
  },
  data() {
    return {
      language: 'english',
      showMenu: true,
      allFoods: allFoodType,

      orders: [],
    }
  },
  methods: {
    handleAmountChange({id, name, amount}) {
      let alrdyHave = this.orders.findIndex(el => el.id == id) >= 0
      if (alrdyHave) {
        this.orders.map(el => {
          if (el.id == id) el.amount = amount
          return el
        })
      } else {
        this.orders.push({id, name, amount})
      }
    },
  },
  computed: {
    isEnglish() {return this.language == 'english'},
  },
  mounted() {
    this.allFoods.map(el => {
      el.item = foods.filter(food => food.type == el.type.prop)
      return el
    })
  },
};
</script>

<style lang="scss">
#app {
  font-size: 1.5rem;
  position: relative;
  .el-radio-group.language-selection {
    z-index: 999;
    position: fixed;
    bottom: 1rem;
    left: 1rem;
  }
  .category-title {
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 99;
    background-color: white;
    padding: 0.5rem;
  }
  .spacer {
    padding: 2rem;
  }
  button, input, select, textarea
  span  {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }
}
</style>