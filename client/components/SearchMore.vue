<template>
  <div style="padding:40px">
    <b-field class="filters">
      <b-slider
        v-model="ageGap"
        type="is-success"
        :min="18"
        :max="50"
        :custom-formatter=" val => (val===50)?val.toString()+'+':val.toString()"
        :step="1"
        rounded
        tooltip-always
      />
    </b-field>
    <b-field class="filters">
      <b-slider
        v-model="rateGap"
        type="is-success"
        :min="0"
        :max="5"
        :custom-formatter=" val => val+ '☆'"
        :step="1"
        rounded
        tooltip-always
        
      />
    </b-field>
    <b-field class="filters">
      <b-slider
        type="is-success"
        v-model="distance"
        :min="10"
        :max="200"
        :custom-formatter=" val => (val===200)?val.toString()+'+ Km':val.toString()+' Km'"
        :step="1"
        lazy
        rounded
        tooltip-always
      ></b-slider>
    </b-field>
    <b-field class="filters">
      <b-field label="Add some tags">
        <b-taginput
          v-model="tags"
          ellipsis
          icon="label"
          placeholder="Add a tag"
          aria-close-label="Delete this tag"
        ></b-taginput>
      </b-field>
    </b-field>
    <b-field>
      <button @click="search">Search</button>
    </b-field>
  </div>
</template>

<script>
export default {
  data() {
    return {
        ageGap: [18, 50],
        rateGap: [0, 5],
        distance: 200,
        tags:[]
    };
  },
  methods: {
    async search(){
      const data = await this.$axios.$post("/matcha/getMore",{ageGap:this.ageGap,rateGap: this.rateGap, distance: this.distance, tags:this.tags})
      this.$emit('clicked', data.users)
    }
  },
};
</script>

<style lang="scss" scoped>
.filters{
  margin-bottom: 60px;
}
</style>