<template>
  <div class="column is-4">
    <div class="card " aria-id="contentIdForA11y3">
      <div class="card-header" role="button" aria-controls="contentIdForA11y3">
        <p class="card-header-title">
          <template>Component</template>
        </p>
      </div>
      <div class="card-content">
        <div class="content">
          <template>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
            <a>#buefy</a>.
          </template>
        </div>
      </div>
      <footer class="card-footer">
        <a class="card-footer-item">
          <template>Save</template>
        </a>
        <a class="card-footer-item">
          <template>Edit</template>
        </a>
        <a class="card-footer-item">
          <template>Delete</template>
        </a>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
</style>