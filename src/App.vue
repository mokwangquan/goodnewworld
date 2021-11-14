
<template>
  <div id="app">
    <sidebar 
      v-show="active == 0" 
      @remove="handleDeleteFromCart"
      :language="language"
      :orders="orders"/>
    <el-row class="action" type="flex" justify="start">
      <el-radio-group class="language-selection" size="mini" v-model="language">
        <el-radio-button label="chinese">中文</el-radio-button>
        <el-radio-button label="english">English</el-radio-button>
      </el-radio-group>
      <el-button v-if="active == 1" @click="handleStep('back')" type="primary" size="large" style="color:white;">
        {{ isEnglish ? 'Back' : '上一步' }}
      </el-button>
      <el-button v-else @click="handleStep('next')" type="primary" size="large" style="color:white;">
        {{ isEnglish ? 'Next' : '下一步' }}
      </el-button>
    </el-row>
    <info
      @passInfo="(value) => this.info = value"
      :active="active"
      :language="language"
      :orders="orders"
      />
    <div v-show="active == 0">
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
        :remove="removeId"
        @sizeChange="handleSizeChange"
        />
      </template>
      
    </div>
    <div class="spacer"></div>
    <div class="block-access" v-show="blockAccess">
      <div>Currently only works for mobile. Sorry for the inconveniences</div>
    </div>
  </div>
</template>

<script>
import sidebar from '@/components/sidebar.vue'
import info from '@/components/info.vue'
import foodContainer from '@/components/food-container.vue'
import { foods } from  '@/constants/foods.js'
import { allFoodType } from  '@/constants/types.js'

const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  components: {
    sidebar,
    info,
    foodContainer,
  },
  data() {
    return {
      blockAccess: false,
      language: 'english',
      showMenu: true,
      allFoods: allFoodType,
      active: 0,

      orders: [],
      removeId: null,
    }
  },
  methods: {
    handleSizeChange({id, name, size}) {
      if (size == 'none') return
      let alrdyHave = this.orders.findIndex(el => el.id == id) >= 0
      if (alrdyHave) {
        this.orders.map(el => {
          if (el.id == id) el.size = size
          return el
        })
      } else {
        this.orders.push({id, name, size})
      }
    },
    handleDeleteFromCart(id) {
      this.removeId = id
      this.orders = this.orders.filter(el => el.id != id)
    },
    isMobile() {
      const rect = document.body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    handleStep(direction) {
      if (direction == 'back') this.active--
      if (direction == 'next') this.active++
    }
  },
  computed: {
    isEnglish() {return this.language == 'english'},
  },
  mounted() {
    this.allFoods.map(el => {
      el.item = foods.filter(food => food.type == el.type.prop)
      return el
    })
    if (!this.isMobile()) this.blockAccess = true
  },
  watch: {
  },
};
</script>

<style lang="scss">
#app {
  font-size: 1.5rem;
  position: relative;
  .action {
    z-index: 999;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 1rem;
    background-color: white;
    width: 100%;
    * {
      margin: auto 0;
      margin-left: 0.25rem;
    }
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
  // button, input, select, textarea  {
  //   font-family: inherit;
  //   font-size: inherit;
  //   line-height: inherit;
  //   color: inherit;
  // }
  .block-access {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    bottom: 0;
    color: white;
    background-color: rgba(0,0,0,0.5);
    z-index: 9999999;
    >div {
      position: relative;
      top: 50vh;
      left: 30vw;
    }
  }
}
</style>