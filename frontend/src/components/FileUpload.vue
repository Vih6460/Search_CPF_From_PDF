<template>
    <section id="newSearch">
        <h2>Buscar CPFs em um arquivo PDF</h2>

        <div id="actionButtons">
            <div id="btnUpload">
                <input type="file" id="fileInput" @change="onFileChange" accept=".pdf" hidden />
                <label for="fileInput" id="uploadButton">Selecionar PDF</label>
            </div>

            <button id="btnSendPdf" @click="uploadPDF" :disabled="isLoading">
                {{ isLoading ? "Processando..." : "Enviar PDF" }}
            </button>
        </div>

        <div id="containerFileName">
            <span v-if="pdfFile" id="fileName">Arquivo selecionado: {{ pdfFile.name }}</span>
        </div>

        <div id="containerTxtArea">
            <textarea readonly v-model="cpfsFoundText" id="txtAreaCpfsFound"></textarea>
        </div>

        <p v-if="isLoading" id="loadingMessage">Carregando e processando o PDF...</p>
    </section>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            pdfFile: "",
            cpfsFoundText: "",
            isLoading: false,
        };
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
        async uploadPDF() {
            if (!this.pdfFile) {
                alert('Por favor, selecione um PDF primeiro.');
                return;
            }

            this.isLoading = true; 

            const formData = new FormData();
            formData.append('pdf', this.pdfFile);

            try {
                const response = await axios.post('http://localhost:3333/upload-pdf', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                this.cpfsFoundText = response.data.cpfs.join(", ");
                this.$emit("pdfProcessed"); // Emite evento para atualizar o histórico
            } catch (error) {
                console.error(error);
                alert('Erro ao processar o PDF.');
            } finally {
                this.isLoading = false; 
            }
        }
    }
};
</script>