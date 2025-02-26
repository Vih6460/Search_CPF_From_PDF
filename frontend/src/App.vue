<template>
  <div id="app">
    <section id="newSearch">
      <h2>Buscar CPFs em um arquivo PDF</h2>
      
        <div id="btnUpload">
          <input type="file" id="fileInput" @change="onFileChange" accept=".pdf" hidden />
          <label for="fileInput" id="upload-button">Selecionar PDF</label>
          <span v-if="pdfFile" class="file-name">Arquivo selecionado: {{ pdfFile.name }}</span>
        </div>
  
        <button @click="uploadPDF">Enviar PDF</button>
    </section>
    <section id="historySearch">
      <h3>CPFs encontrados:</h3>

      <ul id="historyList">
        <li v-for="cpf in cpfs" :key="cpf">{{ cpf }}</li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      pdfFile: null,
      cpfs: []
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.pdfFile = file;
      } else {
        alert('Por favor, envie um arquivo PDF.');
      }
    },
    async uploadPDF() {
      if (!this.pdfFile) {
        alert('Por favor, selecione um PDF primeiro.');
        return;
      }

      const formData = new FormData();
      formData.append('pdf', this.pdfFile);

      try {
        const response = await axios.post('http://localhost:3333/upload-pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.cpfs = response.data.cpfs;
      } catch (error) {
        console.error(error);
        alert('Erro ao processar o PDF.');
      }
    }
  }
};
</script>

<style lang="scss">
  @import './assets/styles/styles.scss';
</style>
