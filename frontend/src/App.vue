<template>
  <div id="app">
    <section id="newSearch">
      <h2>Buscar CPFs em um arquivo PDF</h2>
      
      <div id="actionButtons">
        <div id="btnUpload">
          <input type="file" id="fileInput" @change="onFileChange" accept=".pdf" hidden />
          <label for="fileInput" id="uploadButton">Selecionar PDF</label>
        </div>

        <button id="btnSendPdf" @click="uploadPDF">Enviar PDF</button>
      </div>
      
      <div id="containerFileName">
        <span v-if="pdfFile" id="fileName">Arquivo selecionado: {{ pdfFile.name }}</span>
      </div>

      <div id="containerTxtArea">
        <textarea readonly v-model="cpfsFoundText" id="txtAreaCpfsFound"></textarea>
      </div>
    </section>
    <section id="historySearch">
      <h3>Histórico de CPFs encontrados:</h3>

      <ul id="historyList">
        <li v-for="cpf in allCpfs" :key="cpf">{{ cpf }}</li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      pdfFile: "",
      cpfs: [],
      allCpfs: [],
      cpfsFoundText: ""
    };
  },
  mounted() {
    this.fetchAllCpfs();
  },
  watch: {
    // Sempre que 'cpfs' for atualizado, atualizar o textarea
    cpfs(newCpfs) {
      this.cpfsFoundText = newCpfs.join(", ");
    },
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.pdfFile = file;
      } else {
        alert('Arquivo inválido, envie um arquivo .PDF.');
      }
    },
    async fetchAllCpfs() {
      try {
        const response = await axios.get('http://localhost:3333/cpfs'); // Ajuste a URL conforme necessário
        this.allCpfs = response.data.cpfs;
      } catch (error) {
        console.error("Erro ao buscar CPFs do banco:", error);
        alert("Erro ao carregar o histórico de CPFs.");
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
        this.fetchAllCpfs();
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
