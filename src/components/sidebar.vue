<template>
  <div id="sidebar">
    <el-button @click="openDrawer = true" type="primary" style="color: white;">
      <i class="el-icon-more"></i>
    </el-button>
    <el-drawer
      size="70%"
      :visible.sync="openDrawer"
      :with-header="false">
      <el-menu
        @select="handleSelect"
        class="el-menu-vertical-demo">
        <el-menu-item index="0">
          <i class="el-icon-top"></i>
          <a @click="handleGoTop()">{{ isEnglish ? 'Back to Top' : '回到最上' }}</a>
        </el-menu-item>
        <el-menu-item v-for="food in allFoodType" :key="food.type.prop" :index="food.type.prop">
          <i class="el-icon-food"></i>
          <a @click="handleScrolling(food.type.prop)">{{ isEnglish ? food.type.english : food.type.chinese}}</a>
        </el-menu-item>
        
      </el-menu>
      <el-divider></el-divider>
      <div class="orders">
        <el-table
          :data="orders">
          <el-table-column width="150" :label="isEnglish ? 'Food Added' : '订单'">
            <template slot-scope="scope">
              {{ isEnglish ? scope.row.name.english : scope.row.name.chinese }}
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-row class="cart-action" type="flex" justify="space-between" align="center">
                <i class="el-icon-remove-outline" @click="handleMinus(scope.row.id)"></i>
                <span>{{ scope.row.amount }}</span>
                <i class="el-icon-circle-plus-outline" @click="handleAdd(scope.row.id)"></i>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { allFoodType } from  '@/constants/types.js'

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
      openDrawer: false,
      allFoodType: allFoodType,
    }
  },
  methods: {
    handleSelect() {
      this.openDrawer = false
    },
    handleGoTop() {
      window.scrollTo(0, 0)
    },
    handleScrolling(id) {
      document.getElementById(id).scrollIntoView();
      window.scrollTo(0, 0)
      document.getElementById(id).scrollIntoView();
    },
    handleAdd(id) {
      this.$emit('changeAmount', {id, amount: 1})
    },
    handleMinus(id){
      this.$emit('changeAmount', {id, amount: -1})
    },
  },
  computed: {
    isEnglish() {return this.language == 'english'},
  },
  watch: {
  }
}
</script>

<style lang="scss">
#sidebar {
  .el-button {
    z-index: 999;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
  }
  a {
    text-decoration: none;
    color: black;
  }
  .orders {
    margin: 1rem;
  }
  .cart-action {
    * {
      margin: auto 0;
    }
  }
}
</style>