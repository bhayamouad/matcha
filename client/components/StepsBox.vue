<template>
  <div id="steps-id">
    <b-steps :type="stepType" size="is-medium" v-model="active">
      <b-step-item label="Account" icon="account-key" :clickable="isStepsClickable">
        <set-profile ref="setProfileChild" />
      </b-step-item>
      <b-step-item label="Pictures" icon="image" :clickable="isStepsClickable">
          <image-upload ref="imageUploadChild"></image-upload>
      </b-step-item>
      <b-step-item label="Profile" icon="account" :clickable="isStepsClickable">
        <div class>
          <div class>
            <span id="lstep-title">Our Commitment To You</span>
            <br />
            <br />
            <span>
              At Matcha, your privacy is a top priority. Your privacy is at the core of the way we design and build the services and products you know and love, so that you can fully trust them and focus on building meaningful connections.
              We appreciate that you put your trust in us when you provide us with your information and we do not take this lightly.
              We do not compromise with your privacy. We design all of our products and services with your privacy in mind. We involve experts from various fields, including legal, security, engineering, product design and others to make sure that no decision is taken without respect for your privacy.
              We strive to be transparent in the way we process your data. Because we use many of the same online services you do, we know that insufficient information and overly complicated language are common issues in privacy policies. We take the exact opposite approach: we have written our Privacy Policy and related documents in plain language. We actually want you to read our policies and understand our privacy practices!
              We work hard to keep your information secure We have teams dedicated to keeping your data safe and secure. We constantly update our security practices and invest in our security efforts to enhance the safety of your information.
            </span>
            <b-field label="Privacy Policy" :type="{'is-danger': errorCheck}" :message="errorCheck">
              <b-checkbox v-model="check">I accept</b-checkbox>
            </b-field>
          </div>
        </div>
      </b-step-item>
      <template slot="navigation" slot-scope="{previous, next}">
        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <a
              class="button is-light"
              @click.prevent="previous.action"
              :disabled="previousDisable"
            >Back</a>
          </p>
          <p class="control">
            <a class="button is-primary" @click.prevent="send(next.action)">{{nextValue}}</a>
          </p>
        </div>
      </template>
    </b-steps>
  </div>
</template>

<script>
import SetProfile from "@/components/SetProfile.vue";
import Account from "@/components/Account.vue";
import ImageUpload from "@/components/ImageUploadBox.vue";

export default {
  components: {
    SetProfile,
    Account,
    ImageUpload
  },
  head() {
    return {
      title: "Matcha"
    };
  },
  computed: {
    nextValue() {
      return this.active === 2 ? "Finish" : "Next";
    },
    previousDisable() {
      return this.active === 0 ? true : false;
    },
    stepType() {
      if (this.error !== true) return "";
      else return "is-danger";
    }
  },
  data() {
    return {
      active: 0,
      isStepsClickable: false,
      check: false,
      error: null,
      errorCheck: ""
    };
  },
  methods: {
    async send(next) {
      if (this.active === 0) {
        const check = await this.$refs.setProfileChild.setProfile()
        if (check) {
            this.error = false
            next();
        }
        else
          this.error = true
      }
      if (this.active === 1) {
        const check = await this.$refs.imageUploadChild.saveImages()
        if (check) {
          this.error = false
          next()
        }
        else
          this.error = true
      }
      if (this.active === 2) {
        if (!this.check) this.errorCheck = "You must accept our privacy policy";
        else {
          const res = await this.$axios.$get("/account/acceptPrivacy");
          if (!res.error) this.$router.go();
        }
      }
    }
  }
};
</script>

<style src="@/style/steps.css">

</style>