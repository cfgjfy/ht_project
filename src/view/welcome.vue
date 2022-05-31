<template>
  <div class="title">
    <h1>后台管理系统</h1>
  </div>
</template>

<script>
export default {
  name: "welcome"
}
</script>

<style lang='less' scoped>
body {
  background-color: #55a532;
}

.title {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-30%);
  width: 800px;

  h1 {
    font-size: 50px;
    text-align: center;
    letter-spacing: 0.2em;
    font-weight: 300;
    color: tomato;
    line-height: 300px;
    text-align: center;
    text-shadow: 2px 2px 0 tomato, -2px -2px 0 #f00;
  }
}
</style>
