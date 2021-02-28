<template>
  <div>
    <draggable v-model="uploadImages" v-bind="dragOptions" @start="drag = true" @end="drag = false">
      <transition-group
        type="transition"
        class="columns is-multiline"
        :name="!drag ? 'flip-list' : null"
      >
        <div
          class="column is-4"
          :class="{'draggable':image.url}"
          v-for="(image, index)  in uploadImages"
          :key="image.position"
        >
          <div class="card" aria-id="contentIdForA11y3">
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

                <span
                  v-if="image.url"
                  class="material-icons del-icons"
                  @click="deleteImage($event,index)"
                >clear</span>
                <span
                  v-else
                  class="material-icons up-icons"
                  @click="uploadClick(index)"
                >add_circle_outline</span>
                <img v-if="image.url" :src="image.url" :width="280" :height="380"/>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </draggable>
    <b-modal v-model="isImageModalActive" :can-cancel="['x', 'escape']" :on-cancel="cancel">
      <div id="thecroper">
        <cropper id="croper-cnt"
          ref="cropper"
          v-if="uploadImages[openModal]"
          :src="uploadImages[openModal].url"
          :auto-zoom="true"
          :stencil-props="{
		        aspectRatio: 2/3,
	        }"
          
        />
        <div class="button-wrapper">
          <span class="button" @click="crop(openModal)">Add Photo</span>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

function dataUriToFile(src, fileName, mimeType){
    return (fetch(src)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], fileName, {type:mimeType});})
    );
}

const formData = new FormData();
export default {
  display: "Transitions",
  components: {
    Cropper,
    draggable
  },
  data() {
    return {
      uploadImages: [],
      drag: false,
      isImageModalActive: false,
      openModal: null,
    };
  },
  async fetch() {
    const res = await this.$axios.$get('/account/getImages')
      res.images.forEach((url,index) => {
          dataUriToFile(url, `user-image${index}.png`, 'png')
            .then(file => {
                if(url)
                  this.uploadImages.push({url, position: index, file})
                else
                  this.uploadImages.push({url, position: index, file: null})
              })
      })
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        draggable: ".draggable"
      };
    }
  },
  methods: {
    uploadClick(index) {
      if (index === 0) {
        let fileInputElement = this.$refs.upload[index];
        fileInputElement.click();
        return;
      }
      if ((index > 0 && this.uploadImages[index - 1].url) || this.uploadImages[index].url) {
        let fileInputElement = this.$refs.upload[index];
        fileInputElement.click();
        return;
      }
    },
    deleteImage(event,index) {
      this.$refs.upload[index].value = null
      this.$delete(this.uploadImages, index);
      this.uploadImages.forEach((image, i) => {
        image.position = i;
      });
      this.uploadImages.push({ url: null, position: 4, file: null });
    },
    onFilePicked(event, index) {
      const files = event.target.files;
      console.log(files);
      if (files.length && files[0].type.match('image.*')) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", e => {
          let image = new Image()          
          let that = this
          image.onload = function (){
            that.uploadImages[index].url = e.target.result;
            that.uploadImages[index].file = event.target.files[0];
            that.isImageModalActive = true;
            that.openModal = index;
          }
          image.onerror = () => that.$snoast.toast(this.$buefy, "Please choose a valid image", 'is-danger')
          image.src = e.target.result
        });
        fileReader.readAsDataURL(event.target.files[0]);
      } 
      else {
        this.$snoast.toast(this.$buefy, "Please choose a valid image", 'is-danger')
        this.uploadImages[index].url = null;
        this.uploadImages[index].file = null;
      }
    },
    async saveImages() {
      this.uploadImages.forEach( (image, index) => formData.append("images", image.file) )
      const res = await this.$axios.$post("/account/saveImages", formData, {
        headers: { "content-Type": "multipart/form-data" }
      });
      formData.delete("images");
      if (!res.error) {
        if(this.uploadImages[0].url)
          document.querySelector('#lgo-img').innerHTML=`<img  class="profile-img" src="${this.uploadImages[0].url}"/>`
        else
          document.querySelector('#lgo-img').innerHTML=`<span class="icon profile-img"><i class="mdi mdi-account mdi-24px"></i></span>`
        return true;
      }
      else
          this.$snoast.toast(this.$buefy, "Oups There is an Error", 'is-danger')
      return false;
    },
    crop(index) {
      const { canvas } = this.$refs.cropper.getResult();
      this.uploadImages[index].url = canvas.toDataURL();
      this.isImageModalActive = false
      const mimeType = this.uploadImages[index].url.split(':')[1]
      const ext = mimeType.split(';')[0]
      dataUriToFile(
        this.uploadImages[index].url,
        this.uploadImages[index].file.name,
        ext
      ).then( (file) => this.uploadImages[index].file = file)
    },
    cancel(){
      this.uploadImages[this.openModal].url = null;
      this.uploadImages[this.openModal].file = null;
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

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 17px;
}
.content{
  margin-top: -10px;
}
.card-content{
  min-height: 427px!important;
}
#thecroper{
  height: 70vh;
}
#croper-cnt{
  height: 60vh;
}
@media (max-width: 800px)
{
  .card-content{
  min-height: 100px!important;
}
}
</style>