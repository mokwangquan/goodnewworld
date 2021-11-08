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
          <a href="#">{{ isEnglish ? 'Back to Top' : '回到最上' }}</a>
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
          <el-table-column :label="isEnglish ? 'Food Added' : '订单'">
            <template slot-scope="scope">
              {{ isEnglish ? scope.row.name.english : scope.row.name.chinese }}
            </template>
          </el-table-column>
          <el-table-column prop="amount" width="50"/>
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
    handleScrolling(id) {
      window.scrollTo(0, 0)
      document.getElementById(id).scrollIntoView();
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
}
</style>