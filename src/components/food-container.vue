<template>
  <div id="food-container">
    <el-card :body-style="{ padding: '0px' }">
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
          <!-- <p class="description">{{ foodDetails.name.english }}</p> -->
          <el-row type="flex" justify="center">
            <el-input-number :min="0" class="amount" size="large" v-model="amount"></el-input-number>
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
    }
  },
  data() {
    return {
      foodDetails: {},
      amount: 0,
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
    amount() {
      this.$emit('amountChange', {
        id: this.id,
        name: this.foodDetails.name,
        amount: this.amount
      })
    }
  }
}
</script>

<style lang="scss">
#food-container {
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

  .amount {
    margin-top: 2rem;
  }
}
</style>