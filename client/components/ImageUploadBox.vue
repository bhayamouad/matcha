<template>
  <draggable
    v-model="upoloadImages"
    v-bind="dragOptions"
    @start="drag = true"
    @end="drag = false"
  >
    <transition-group type="transition" class="columns is-multiline" :name="!drag ? 'flip-list' : null">
      <div class="column is-4 " :class="{'draggable':image.url}" v-for="(image, index)  in upoloadImages" :key="image.position">
        <div class="card" aria-id="contentIdForA11y3" >
          <div class="card-header" role="button" aria-controls="contentIdForA11y3">
            <p class="card-header-title">
              <template>Photo {{image.position+1}}</template>
            </p>
          </div>
          <div class="card-content">
            <div class="content">
              <input
                type="file"
                style="display: none"
                multiple
                ref="upload"
                accept="image/*"
                @change="onFilePicked($event,index)"
              />
              <span class="material-icons" @click="uploadClick(index)">add_circle_outline</span>
              <img :src="image.url" alt />
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
let images = [null, null, null, null, null];
const formData = new FormData()
export default {
  display: "Transitions",
  components: {
    draggable
  },
  data() {
    return {
      upoloadImages: images.map((url, index) => {
        return { url, position: index };
      }),
      drag: false
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        draggable: '.draggable'
      };
    }
  },
  methods: {
    uploadClick(index) {
      if(index === 0)
      {
        let fileInputElement = this.$refs.upload[index];
        fileInputElement.click();
        return
        
      }
      if ((index > 0 && this.upoloadImages[index-1].url) || this.upoloadImages[index].url){ 
        let fileInputElement = this.$refs.upload[index];
        fileInputElement.click();
        return
      }
    },
    onFilePicked(event,index) {
      const files = event.target.files;
      if (files.length) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", (e) => {
          this.imageUrl = e.target.result;
          this.upoloadImages[index].url = this.imageUrl; 
        });
        images[index] = event.target.files[0]
        fileReader.readAsDataURL(event.target.files[0]);
      }
      else this.upoloadImages[index].url = null; 
    },
    async saveImages(){
      console.log(images)
      console.log(this.upoloadImages)
      //   images.forEach(image => formData.append("images", image)) 

      //   const res = await this.$axios.$post("/account/saveImages", formData ,{headers: {'content-Type': 'multipart/form-data' } })
      //   formData.delete("images");
      //   if(res.error)
      //     return false
      // return true
    }
  } 
};
</script>

<style lang="scss" scoped>
.card-content {
  background-color: transparent;
  padding: 1.5rem;
  height: 370px;
}
</style>