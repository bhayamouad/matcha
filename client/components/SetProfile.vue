<template>
  <div>
    
    <b-field v-if="!(parent=='steps')" label="First Name"
      :type="{'is-danger': errors.fname}" 
      :message="errors.fname"
    >
      <b-input v-model="user.fname" placeholder="First Name"></b-input> 
    </b-field>
    <b-field v-if="!(parent=='steps')" label="Last Name"
      :type="{'is-danger': errors.lname}" 
      :message="errors.lname"
    >
      <b-input v-model="user.lname" placeholder="Last Name"></b-input> 
    </b-field>
    <b-field v-if="!(parent=='steps')" label="Email"
      :type="{'is-danger': errors.email}" 
      :message="errors.email"
    >
      <b-input v-model="user.email" placeholder="Email"></b-input> 
    </b-field>
    <b-field v-if="isLogin || !(parent=='steps') "  label="Username"
      :type="{'is-danger': errors.login}" 
      :message="errors.login"
    >
      <b-input v-model="user.login" placeholder="Username"></b-input> 
    </b-field>
    
    <b-field label="Gender" 
      :type="{'is-danger': errors.gender}" 
      :message="errors.gender"
      
    >
      <b-radio v-model="user.gender" name="gender" native-value="M">Male</b-radio>
      <b-radio v-model="user.gender" name="gender" native-value="F">Female</b-radio>
      <b-radio v-model="user.gender" name="gender" native-value="O">Other</b-radio>
    </b-field>
    <client-only>
      <b-field label="Birthdate"
        :type="{'is-danger': errors.birthdate}" 
        :message="errors.birthdate"
      >
        <b-datepicker v-model="user.birthdate" ref="datepicker" :max-date="max" placeholder="Select a date"></b-datepicker>
        <b-button @click="$refs.datepicker.toggle()" icon-left="calendar-today" type="is-primary" />
      </b-field>
    </client-only>
    <b-field label="Sexual Preferences"
      :type="{'is-danger': errors.interest}" 
      :message="errors.interest"
    >
      <b-radio v-model="user.interest" name="interest" native-value="M">Male</b-radio>
      <b-radio v-model="user.interest" name="interest" native-value="F">Female</b-radio>
      <b-radio v-model="user.interest" name="interest" native-value="B">Both</b-radio>
    </b-field>
    <b-field label="Biography"
      :type="{'is-danger': errors.bio}" 
      :message="errors.bio"
      >
      <b-input minlength="20" maxlength="200" type="textarea" v-model="user.bio" placeholder="Type a short Biography"></b-input>
    </b-field>
    <b-field label="Enter some tags"
      :type="{'is-danger': errors.tags}" 
      :message="errors.tags"
    >
      <b-taginput
        v-model="user.tags"
        :data="filteredTags"
        icon="label"
        allow-new
        :confirm-keys = "['Enter']"
        placeholder="ex: #vegan, #geek, #piercing etc..."
        :before-adding="tagValidate"
        :remove-on-keys="[]"
        @typing="getFilteredTags"
      ></b-taginput>
    </b-field>
  </div>
</template>
<script>
let tagsList = null
let lat=null, lng=null
let dataUser = {}

const validateFname = (fname) => {
    if (!fname) return { valid: false, error: "The First name is required" };
    if (fname.length < 3)
      return {
        valid: false,
        error: "The First name must have more than 2 characters",
      };
    return { valid: true, error: null };
  };
  const validateLname = (lname) => {
    if (!lname) return { valid: false, error: "The Last name is required" };
    if (lname.length < 3)
      return {
        valid: false,
        error: "The Last name must have more than 2 characters",
      };
    return { valid: true, error: null };
  };
  const validateEmail = (email) => {
    if (!email) return { valid: false, error: "The Email is required" };
    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      return { valid: false, error: "Please enter a valid email" };
    return { valid: true, error: null };
  };

const validateLogin = (login) => {
    if (!login) return { valid: false, error: "The login is required" };
    if (login.length > 14)
      return { valid: false, error: "Login must have maximum 8 characteres" };
    return { valid: true, error: null };
  };

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
  props:['parent'],
  data() {
    const maxYear = new Date();
    maxYear.setFullYear(maxYear.getFullYear() - 18)
    return {
      user: {
        fname: null,
        lname: null,
        email: null,
        login: null,
        gender: null,
        interest: null,
        birthdate: null,
        bio: null,
        tags: [],
      },
      isLogin: true,
      filteredTags: tagsList,
      max: maxYear,
      valid: true,
      errors: {}
    };
  },
  async fetch() {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude
      lng = position.coords.longitude
    })
    const result = await this.$axios.$get('/account/getDataUser')
    tagsList = result.data.tagsList
    dataUser = result.data.user
    this.user.fname = dataUser.fname
    this.user.lname = dataUser.lname
    this.user.email = dataUser.email
    this.user.login = dataUser.login
    this.user.gender = (dataUser.gender === '0') ? null : dataUser.gender
    this.user.interest = dataUser.interest
    this.user.birthdate = (dataUser.birthdate) ? new Date(dataUser.birthdate) : null
    this.user.bio = dataUser.biography
    this.user.tags = result.data.userTags,
    this.isLogin = !!dataUser.oauth_id
  },
  methods: {
    tagValidate (tag) {
        return tag.match(/^#([A-Za-z0-9_]){3,25}$/);
    },
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
      
      const validFname = validateFname(this.user.fname)
      this.errors.fname = validFname.error
      if (this.valid) this.valid = validFname.valid
      
      const validLname = validateLname(this.user.lname)
      this.errors.lname = validLname.error
      if (this.valid) this.valid = validLname.valid

      const validEmail = validateEmail(this.user.email)
      this.errors.email = validEmail.error
      if (this.valid) this.valid = validEmail.valid

      const validLogin = validateLogin(this.user.login)
      this.errors.login = validLogin.error
      if (this.valid) this.valid = validLogin.valid

      const validGender = validateGender(this.user.gender)
      this.errors.gender = validGender.error
      if (this.valid) this.valid = validGender.valid
      
      const validInterest = validateInterest(this.user.interest)
      this.errors.interest = validInterest.error
      if (this.valid) this.valid = validInterest.valid

      const validBirthDate = validateBirthDate(this.user.birthdate)
      this.errors.birthdate = validBirthDate.error
      if (this.valid) this.valid = validBirthDate.valid

      const validBiography = validateBiography(this.user.bio)
      this.errors.bio = validBiography.error
      if (this.valid) this.valid = validBiography.valid

      const validTags = validateTags(this.user.tags)
      this.errors.tags = validTags.error
      if (this.valid) this.valid = validTags.valid

      if(this.valid)
      {
        const data = {
          fname:this.user.fname,
          lname:this.user.lname,
          email:this.user.email,
          login: this.user.login,
          gender:this.user.gender, 
          birthdate: new Date(this.user.birthdate.toString()),
          interest:this.user.interest, 
          bio:this.user.bio, 
          tags:this.user.tags, 
          lat, 
          lng
          }
        const res = await this.$axios.$post('/account/setProfile', data)
        if(res.emailerr)
        {
            this.valid = false;
            this.errors.email = "This email already exists"
        }
        if(res.loginerr)
        {
            this.valid = false;
            this.errors.login = "This username already exists"
        }
        if(res.message === 'success')
            return true
        if(!(res.message === 'success') && this.valid)
          this.$snoast.toast(this.$buefy, "Oups There is an Error", 'is-danger')
      }
      
        this.user = {
        fname: this.user.fname,
        lname: this.user.lname,
        email: this.user.email,
        login: this.user.login,
        gender: this.user.gender,
        interest: this.user.interest,
        birthdate: this.user.birthdate,
        bio: this.user.bio,
        tags: this.user.tags,
      }
        return false
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
