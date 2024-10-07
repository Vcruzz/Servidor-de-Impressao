document.addEventListener("DOMContentLoaded", function() {
    const completedColumn = document.querySelector("#completed .print-jobs");
    const inProgressColumn = document.querySelector("#in-progress .print-jobs");
    const pendingColumn = document.querySelector("#pending .print-jobs");

    // Função para criar elementos de trabalho de impressão
    function createPrintJobElement(job) {
        const jobElement = document.createElement("div");
        jobElement.className = "print-job";
        jobElement.innerHTML = `
            <p><strong>${job.name}</strong></p>
            <p>Status: <span class="status ${job.status}">${job.status.replace('-', ' ')}</span></p>
        `;
        return jobElement;
    }

    // Função para atualizar a fila de impressão
    function updatePrintQueue(jobs) {
        // Limpa as colunas antes de adicionar os novos dados
        completedColumn.innerHTML = "";
        inProgressColumn.innerHTML = "";
        pendingColumn.innerHTML = "";

        jobs.forEach(job => {
            const jobElement = createPrintJobElement(job);
            switch (job.status) {
                case "completed":
                    completedColumn.appendChild(jobElement);
                    break;
                case "in-progress":
                    inProgressColumn.appendChild(jobElement);
                    break;
                case "pending":
                    pendingColumn.appendChild(jobElement);
                    break;
                default:
                    console.warn(`Status desconhecido: ${job.status}`);
            }
        });
    }

    // Função para buscar dados do backend
    async function fetchPrintJobs() {
        try {
            const response = await fetch('/api/print-jobs');
            const jobs = await response.json();
            updatePrintQueue(jobs);
        } catch (error) {
            console.error('Erro ao buscar trabalhos de impressão:', error);
        }
    }

    // Atualiza a fila de impressão inicialmente
    fetchPrintJobs();

    // Atualiza a fila de impressão a cada 10 segundos
    setInterval(fetchPrintJobs, 10000);
});
