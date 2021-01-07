<template>
  <div>
    <b-steps type="is-success" v-model="active">
      <b-step-item label="Account" icon="account-key" :clickable="isStepsClickable">
        
      </b-step-item>
      <b-step-item label="Profile" icon="account" :clickable="isStepsClickable">
        <set-profile ref="child" />
      </b-step-item>
      <b-step-item label="Social" icon="account-plus" :clickable="isStepsClickable"></b-step-item>
      <template slot="navigation" slot-scope="{previous, next}">
        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <a class="button is-primary" @click.prevent="send(next.action)">Set Profile</a>
          </p>
          <p class="control">
            <a class="button is-light" @click.prevent="previous.action">Back</a>
          </p>
        </div>
      </template>
    </b-steps>
  </div>
</template>

<script>
import SetProfile from '@/components/SetProfile.vue';
import Account from '@/components/Account.vue';

export default {
  components: {
    SetProfile,
    Account
  },
  name: "HomePage",
  head() {
    return {
      title: "Matcha"
    }
  },
  data () {
    return {
      active:1,
      isStepsClickable: false,
    }
  },
  methods: {
    async send (next)
    {
      if(this.active === 1)
      {
        const check = await this.$refs.child.setProfile()
        if(check)
          next()
      }
      else
        next()
    }
  },
}
</script>

<style lang="scss" scoped>
</style>