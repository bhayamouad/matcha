<template>
  <draggable
    v-model="list"
    v-bind="dragOptions"
    @start="drag = true"
    @end="drag = false"
  >
    <transition-group type="transition" class="columns is-multiline" :name="!drag ? 'flip-list' : null">
      <div class="column is-4 " :class="{'draggable':image.url}" v-for="(image, index)  in list" :key="image.position">
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
const images = [null, null, null, null, null];
export default {
  display: "Transitions",
  components: {
    draggable
  },
  data() {
    return {
      list: images.map((url, index) => {
        return { url, position: index };
      }),
      imageUpload: null,
      drag: false,
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
      if ((index > 0 && this.list[index-1].url) || this.list[index].url){
        let fileInputElement = this.$refs.upload[index];
        fileInputElement.click();
        return
      }
    },
    onFilePicked(event,index) {
      const files = event.target.files;
      if (files.length) {
        let filename = files[0].name;
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.imageUrl = fileReader.result;
          this.list[index].url = this.imageUrl;
        });
        fileReader.readAsDataURL(files[0]);
      } 
      else this.list[index].url = null;
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