<template>
  <div id="food-container">
    <el-card :body-style="{ padding: '0px' }"  :class="{'have-ordered': size != 'none'}">
      <el-row type="flex" justify="space-between" align="center">
        <el-col v-if="haveImage(id)">
          <div class="image-wrapper">
            <img fit="contain" :src="getImgUrl(id)"
              class="image"/>
          </div>
        </el-col>
        <el-divider class="vertical" direction="vertical"></el-divider>
        <el-col v-if="foodDetails.id" class="food-info">
          <el-divider class="horizontal"></el-divider>
          <h4 class="title">{{ isEnglish ? foodDetails.name.english : foodDetails.name.chinese }}</h4>
          <el-divider class="horizontal"></el-divider>
          <el-row class="price" v-if="foodDetails.price" type="flex" justify="center">
            <div>{{ isEnglish ? 'Small' : '小' }}<br/>{{ foodDetails.price.small }}</div>
            <div>{{ isEnglish ? 'Medium' : '中' }}<br/>{{ foodDetails.price.medium }}</div>
            <div>{{ isEnglish ? 'Big' : '大' }}<br/>{{ foodDetails.price.big }}</div>
          </el-row>
          <!-- no price -->
          <el-row v-else class="price" type="flex" justify="center">
            <div>{{ isEnglish ? 'Market Price' : '时价' }}</div>
          </el-row>
          <el-divider class="horizontal"></el-divider>
          <!-- <p class="description">{{ foodDetails.name.english }}</p> -->
          <el-row type="flex" justify="center">
            <el-select class="size" v-model="size" placeholder="Select">
              <el-option :label="isEnglish ? 'None' : '不要'" value="none"/>
              <el-option v-if="!foodDetails.price" :label="isEnglish ? 'Yes' : '要'" value="yes"/>
              <el-option v-if="foodDetails.price && foodDetails.price.small != '-'" 
                :label="isEnglish ? 'Small' : '小'" value="small"/>
              <el-option v-if="foodDetails.price && foodDetails.price.medium != '-'" 
                :label="isEnglish ? 'Medium' : '中'" value="medium"/>
              <el-option v-if="foodDetails.price && foodDetails.price.big != '-'" 
                :label="isEnglish ? 'Big' : '大'" value="big"/>
            </el-select>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { foods } from  '@/constants/foods.js'
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    language: {
      type: String,
      required: true,
    },
    remove: {
      type: Number,
    }
  },
  data() {
    return {
      foodDetails: {},
      size: 'none',
    }
  },
  methods: {
    getImgUrl(id) {
      let images = require.context('../assets/foods/', false, /\.jpeg$/)
      return images('./' + id + ".jpeg")
    },
    haveImage() {
      // const url = `../assets/foods/${id}.jpeg`
      // var req = new XMLHttpRequest();
      // req.open('HEAD', url, false);
      // req.send();
      // return req.status==200;
      return true
    },
  },
  computed: {
    isEnglish() {return this.language == 'english'},
  },
  mounted() {
    this.foodDetails = foods.find(el => el.id == this.id)
  },
  watch: {
    size() {
      this.$emit('sizeChange', {
        id: this.id,
        name: this.foodDetails.name,
        size: this.size
      })
    },
    remove(newValue) {
      if (newValue && newValue == this.id) {
        this.size = 'none'
      }
    },
  }
}
</script>

<style lang="scss">
#food-container {
  .have-ordered {
    background-color: rgba(129, 0, 0, 0.3);
  }
  .image-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    .image {
      width: 100%;
    }
  }

  .title {
    margin: 0;
    text-align: center;
  }

  .description {
    margin: 0 0.5rem;
  }

  .el-divider {
    &.horizontal {
      margin: 0.3rem auto;
      width: 9rem;
    }
    &.vertical {
      margin: auto 0.3rem;
      height: 9rem;
      }
  }
  
  .food-info {
    margin: auto 0;
  }

  .price {
    font-size: 0.8rem;
    div {
      width: 3rem;
      margin: 0 0.2rem;
      text-align: center;
    }
  }

  .size {
    width: 80%;
    margin: 1rem 0;
  }
}
</style>