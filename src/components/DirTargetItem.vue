<template>
  <div class="targets">
    <h3>
      {{label}}
    </h3>
    <div>
      <v-text-field 
        type="number" 
        label="Month" 
        :value="item.month.range" 
        @input="(val) => onInput(val, 'month')"
      ></v-text-field>
      <v-text-field 
        type="number" 
        label="Year" 
        :value="item.year.range"
        @input="(val) => onInput(val, 'year')"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    label: String
  },
  methods: {
    onInput (val, type) {
      this.item[type].range = Number(val);
      this.item[type].target = Math.ceil(val / 2);
    }
  }
}
</script>

<style lang="scss" scoped>
.targets {
  display: flex;
  flex-direction: column;
  margin: 10px;

  &> div {
    display: flex;

    &> * {
      max-width: 150px;
      padding: 5px;
      box-sizing: border-box;
    }
  }
}
</style>