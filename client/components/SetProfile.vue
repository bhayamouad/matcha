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
      <b-field label="Birthdate">
        <b-datepicker ref="datepicker" :max-date="max" expanded placeholder="Select a date"></b-datepicker>
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
    <b-field label="Biography">
      <b-input minlength="20" maxlength="200" type="textarea" v-model="bio"></b-input>
    </b-field>
    <b-field label="Enter some tags">
      <b-taginput
        v-model="new_tags"
        :data="filteredTags"
        icon="label"
        autocomplete
        placeholder="Add a tag"
        :remove-on-keys="[]"
        @typing="getFilteredTags"
      ></b-taginput>
    </b-field>
    <b-button @click="setProfile" type="is-primary" expanded>Set Profile</b-button>
  </div>
</template>
<script>
const tags = ["Test1", "test2", "test3"];
const validateGender = gender => {
  if (!gender) return { valid: false, error: "You must choose your gender" };
  return { valid: true, error: null };
};
const validateInterest = interest => {
  if (!interest)
    return { valid: false, error: "You must choose your Sexual orientation" };
  return { valid: true, error: null };
};
export default {
  data() {
    const maxYear = new Date();
    maxYear.setFullYear(maxYear.getFullYear() - 18);
    return {
      gender: null,
      interest: null,
      bio: "",
      new_tags: [],
      filteredTags: tags,
      max: maxYear,
      valid: true,
      errors: {}
    };
  },
  methods: {
    getFilteredTags(text) {
      this.filteredTags = tags.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    },
    setProfile() {
      this.errors = {}
      this.valid = true
      
      const validGender = validateGender(this.gender)
      this.errors.gender = validGender.error
      if (this.valid) this.valid = validGender.valid
      
      const validInterest = validateInterest(this.interest)
      this.errors.interest = validInterest.error
      if (this.valid) this.valid = validInterest.valid
      
      if(this.valid)
        return true
      else
        return false
      // navigator.geolocation.getCurrentPosition(position => {
      //   console.log(position.coords.latitude)
      //   console.log(position.coords.longitude)
      // })
      // this.errors = {}
      // this.valid = true
      // const validgender = validateGender(this.user.fname)
      // this.errors.fname = validFname.error
      // if (this.valid) this.valid = validFname.valid
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
