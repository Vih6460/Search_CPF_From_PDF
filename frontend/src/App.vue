<template>
    <div id="app">
      <FileUpload @pdfProcessed="updateHistory" />
      <CPFHistory ref="cpfHistory" />
    </div>
</template>
  
<script>
    import FileUpload from "./components/FileUpload.vue";
    import CPFHistory from "./components/CPFHistory.vue";

    export default {
        components: {
            FileUpload,
            CPFHistory
        },
        methods: {
            updateHistory() {
                this.$refs.cpfHistory.fetchAllCpfs();
            }
        }
    };
</script>
  
<style lang="scss">
    @import './assets/styles/styles.scss';
</style>  