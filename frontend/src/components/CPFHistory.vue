<template>
    <section id="historySearch">
        <h3>Histórico de CPFs encontrados:</h3>
        
        <ul id="historyList">
            <li v-for="cpf in allCpfs" :key="cpf">{{ cpf }}</li>
        </ul>
    </section>
</template>
  
<script>
    import axios from 'axios';
  
    export default {
        data() {
            return {
                allCpfs: []
            };
        },
        mounted() {
            this.fetchAllCpfs();
        },
        methods: {
            async fetchAllCpfs() {
                try {
                    const response = await axios.get('http://localhost:3333/cpfs');
                    this.allCpfs = response.data.cpfs;
                } catch (error) {
                    console.error("Erro ao buscar CPFs do banco:", error);
                    alert("Erro ao carregar o histórico de CPFs.");
                }
            }
        }
    };
</script>
  