<template>
  <div>
    <b-field label="Gender" 
      :type="{'is-danger': errors.gender}" 
      :message="errors.gender"
    >
      <b-radio v-model="gender" name="gender" native-value="M">Male</b-radio>
      <b-radio v-model="gender" name="gender" native-value="F">Female</b-radio>
      <b-radio v-model="gender" name="gender" native-value="O">Other</b-radio>
    </b-field>
    <client-only>
      <b-field label="Birthdate"
        :type="{'is-danger': errors.birthdate}" 
        :message="errors.birthdate"
      >
        <b-datepicker v-model="birthdate" ref="datepicker" :max-date="max" expanded placeholder="Select a date"></b-datepicker>
        <b-button @click="$refs.datepicker.toggle()" icon-left="calendar-today" type="is-primary" />
      </b-field>
    </client-only>
    <b-field label="Sexual Preferences"
      :type="{'is-danger': errors.interest}" 
      :message="errors.interest"
    >
      <b-radio v-model="interest" name="interest" native-value="M">Male</b-radio>
      <b-radio v-model="interest" name="interest" native-value="F">Female</b-radio>
      <b-radio v-model="interest" name="interest" native-value="B">Both</b-radio>
    </b-field>
    <b-field label="Biography"
      :type="{'is-danger': errors.bio}" 
      :message="errors.bio"
      >
      <b-input minlength="20" maxlength="200" type="textarea" v-model="bio" placeholder="Type a short Biography"></b-input>
    </b-field>
    <b-field label="Enter some tags"
      :type="{'is-danger': errors.tags}" 
      :message="errors.tags"
    >
      <b-taginput
        v-model="tags"
        :data="filteredTags"
        icon="label"
        allow-new
        autocomplete
        placeholder="Add a tag"
        :remove-on-keys="[]"
        @typing="getFilteredTags"
      ></b-taginput>
    </b-field>
  </div>
</template>
<script>
const tagsList = ["Test1", "test2", "test3"];
let lat,long
navigator.geolocation.getCurrentPosition((position) => {
  lat = position.coords.latitude
  long = position.coords.longitude
})
const validateGender = gender => {
  if (!gender) return { valid: false, error: "You must choose your gender" }
  return { valid: true, error: null }
}

const validateInterest = interest => {
  if (!interest)
    return { valid: false, error: "You must choose your Sexual orientation" }
  return { valid: true, error: null }
}

const validateBirthDate = date => {
  if (!date)
    return { valid: false, error: "You must choose your Birthday" }
  return { valid: true, error: null }
}

const validateBiography = bio => {
  if (!bio)
    return { valid: false, error: "You must type a short biography" }
  return { valid: true, error: null }
}

const validateTags = tags => {
  if (!tags[0])
    return { valid: false, error: "You must enter your interest tags" }
  return { valid: true, error: null }
}

export default {
  computed: {
    user () {
      return this.$store.state.userId
    }
  },
  data() {
    const maxYear = new Date();
    maxYear.setFullYear(maxYear.getFullYear() - 18)
    return {
      gender: null,
      interest: null,
      birthdate: null,
      bio: "",
      tags: [],
      filteredTags: tagsList,
      max: maxYear,
      valid: true,
      errors: {}
    };
  },
  methods: {
    getFilteredTags(text) {
      this.filteredTags = tagsList.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    },
    async setProfile() {
      this.errors = {}
      this.valid = true
      
      const validGender = validateGender(this.gender)
      this.errors.gender = validGender.error
      if (this.valid) this.valid = validGender.valid
      
      const validInterest = validateInterest(this.interest)
      this.errors.interest = validInterest.error
      if (this.valid) this.valid = validInterest.valid

      const validBirthDate = validateBirthDate(this.birthdate)
      this.errors.birthdate = validBirthDate.error
      if (this.valid) this.valid = validBirthDate.valid

      const validBiography = validateBiography(this.bio)
      this.errors.bio = validBiography.error
      if (this.valid) this.valid = validBiography.valid

      const validTags = validateTags(this.tags)
      this.errors.tags = validTags.error
      if (this.valid) this.valid = validTags.valid

      if(this.valid)
      {
        let res
        console.log(this.userId)
        const data = {gender:this.gender, birthdate: new Date(this.birthdate.toString()), interest:this.interest, bio:this.bio, tags:this.tags, lat, long}
        res = await this.$axios.$post('/account/setProfile', data)
        console.log(res)
        if(res)
          return true
        else
          return false
      }
      else
        return false
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
