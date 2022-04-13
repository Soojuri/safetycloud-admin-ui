<!-- 不需要验证码登录 -->
<template>
  <div class=''></div>
</template>

<script>
//import {} from '';
import { mapGetters } from "vuex"
export default {
  components: {},
  data () {
    return {
      loginForm: {
        username: "auto",
        password: "a111111",
        code: "",
        randomStr: "blockPuzzle",
        pass: 'true'
      },
    }
  },
  computed: {
    ...mapGetters(["tagWel"]),
  },
  watch: {},

  mounted () {
    this.autoLogin()
  },

  methods: {
    autoLogin () {
      this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
        this.$router.push({ path: this.tagWel.value })
      })
    },
  }
}
</script>
<style lang='scss' scoped>
</style>