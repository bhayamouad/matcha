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
                  @click="deleteImage(index)"
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
      <div>
        <cropper
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

function srcToFile(src, fileName, mimeType){
    return (fetch(src)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], fileName, {type:mimeType});})
    );
}

let images = [null, null, null, null, null];
const formData = new FormData();
export default {
  display: "Transitions",
  components: {
    Cropper,
    draggable
  },
  data() {
    return {
      uploadImages: images.map((url, index) => {
        return { url, position: index, file: null };
      }),
      drag: false,
      isImageModalActive: false,
      openModal: null
    };
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
      if (
        (index > 0 && this.uploadImages[index - 1].url) ||
        this.uploadImages[index].url
      ) {
        let fileInputElement = this.$refs.upload[index];
        fileInputElement.click();
        return;
      }
    },
    deleteImage(index) {
      this.$delete(this.uploadImages, index);
      this.uploadImages.forEach((image, i) => {
        image.position = i;
      });
      this.uploadImages.push({ url: null, position: 4, file: null });
    },
    onFilePicked(event, index) {
      const files = event.target.files;
      if (files.length) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", e => {
          this.uploadImages[index].url = e.target.result;
          this.uploadImages[index].file = event.target.files[0];
          this.isImageModalActive = true;
          this.openModal = index;
        });
        fileReader.readAsDataURL(event.target.files[0]);
      } else {
        this.uploadImages[index].url = null;
        this.uploadImages[index].file = null;
      }
    },
    async saveImages() {
      this.uploadImages.forEach((image, index) =>
        formData.append("images", image.file)
      );
      const res = await this.$axios.$post("/account/saveImages", formData, {
        headers: { "content-Type": "multipart/form-data" }
      });
      formData.delete("images");
      if (res.error) return false;
      return true;
    },
    crop(index) {
      const { canvas } = this.$refs.cropper.getResult();
      this.uploadImages[index].url = canvas.toDataURL();
      this.isImageModalActive = false
      const mimeType = this.uploadImages[index].url.split(':')[1]
      const ext = mimeType.split(';')[0]
      srcToFile(
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
</style>