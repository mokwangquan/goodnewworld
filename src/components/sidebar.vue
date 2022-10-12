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
          <el-badge v-if="getBadgeValue(food.item) > 0" :value="getBadgeValue(food.item)"/>
        </el-menu-item>
        
      </el-menu>
      <el-divider></el-divider>
      <div class="orders">
        <el-table
          :data="orders">
          <el-table-column :label="isEnglish ? 'Food Added' : '订单'">
            <template slot-scope="scope">
              {{ isEnglish ? scope.row.name.english : scope.row.name.chinese }}
              ({{ parseSize(scope.row.size) }})
            </template>
          </el-table-column>
          <el-table-column width="30">
            <template slot-scope="scope">
              <el-row class="cart-action" type="flex" justify="space-between" align="center">
                <i class="el-icon-remove-outline" @click="handleDelete(scope.row.id)"></i>
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
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    handleScrolling(id) {
      window.scrollTo({
        top: 0,
        behavior: "auto"
      })
      // setTimeout(() => document.getElementById(id).scrollIntoView(true), 2);
      setTimeout(() => {
        const box = document.getElementById(id).getBoundingClientRect()
  
        const body = document.body
        const docElem = document.documentElement
  
        const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
        const clientTop = docElem.clientTop || body.clientTop || 0
  
        const top = box.top + scrollTop - clientTop
        console.log(box.top, scrollTop, clientTop)
        console.log(top)
        window.scrollTo({
          top,
          behavior: "smooth"
        })
      }, 10);
    },
    handleDelete(id) {
      this.$emit('remove', id)
    },
    parseSize(size) {
      if (size == 'small') return this.isEnglish ? 'S' : '小'
      else if (size == 'medium') return this.isEnglish ? 'M' : '中'
      else if (size == 'big') return this.isEnglish ? 'B' : '大'
      else return this.isEnglish ? 'Y' : '要'
    },
    getBadgeValue(item) {
      let retrievedList = item.filter(el => {
        return this.orders.findIndex(orderItem => orderItem.id == el.id) >= 0
      })
      return retrievedList.length
    }
  },
  computed: {
    isEnglish() { return this.language == 'english' },
  },
  watch: {
  }
}
</script>

<style lang="scss">
#sidebar {
  .el-button {
    z-index: 1000;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
  }
  a {
    text-decoration: none;
    color: black;
  }
  .el-badge {
    float: right;
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