<template>
  <div id="food-container">
    <el-card :body-style="{ padding: '0px' }"  
      :class="getContainerClass">
      <el-row type="flex" justify="space-between" align="center">
        <el-col v-if="haveImage(id)">
          <div class="image-wrapper">
            <el-image 
              fit="contain" 
              :src="getImgUrl(id)"
              class="image"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-food"/>
              </div>
            </el-image>
          </div>
        </el-col>
        <el-divider class="vertical" direction="vertical"></el-divider>
        <el-col v-if="foodDetails.id" class="food-info">
          <el-divider class="horizontal"></el-divider>
          <h4 class="title">{{ isEnglish ? foodDetails.name.english : foodDetails.name.chinese }}</h4>
          <el-divider class="horizontal"></el-divider>
          <el-row class="price" v-if="foodDetails.price" type="flex" justify="center">
            <div v-show="foodDetails.price.small">{{ isEnglish ? 'Small' : '小' }}<br/>{{ foodDetails.price.small }}</div>
            <div v-show="foodDetails.price.medium">{{ isEnglish ? 'Medium' : '中' }}<br/>{{ foodDetails.price.medium }}</div>
            <div v-show="foodDetails.price.big">{{ isEnglish ? 'Big' : '大' }}<br/>{{ foodDetails.price.big }}</div>
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
              <el-option v-if="foodDetails.price && foodDetails.price.small" 
                :label="isEnglish ? 'Small' : '小'" value="small"/>
              <el-option v-if="foodDetails.price && foodDetails.price.medium" 
                :label="isEnglish ? 'Medium' : '中'" value="medium"/>
              <el-option v-if="foodDetails.price && foodDetails.price.big" 
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
      try {
        let images = require.context('../assets/foods/', false, /\.jpeg$/)
        return images('./' + id + ".jpeg")
      } catch (e) { }
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
    getContainerClass() {
      return {
        'have-ordered': this.size != 'none',
        small: this.size == 'small', 
        medium: this.size == 'medium', 
        big: this.size == 'big', 
      }
    }
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
    &.small { background-color: rgba(255, 235, 175, 0.2); }
    &.medium { background-color: rgba(255, 235, 175, 0.4); }
    &.big { background-color: rgba(255, 235, 175, 0.8); }
    background-color: rgba(255, 235, 175, 0.4);
  }
  .image-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    .image {
      width: 100%;
    }
    .image-slot {
      display: flex;
      justify-content: center;
    }
    .el-icon-food {
      font-size: 3rem;
    }
  }

  .title {
    margin: 0;
    text-align: center;
    font-size: 15px;
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