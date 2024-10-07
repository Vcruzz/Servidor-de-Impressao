const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Rota para carregar o frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Rota para fornecer os trabalhos de impressão via WMI
app.get('/api/print-jobs', (req, res) => {
    const psCommand = `powershell "Get-WmiObject -Query \\"SELECT * FROM Win32_PrintJob\\" | Select-Object -Property Document, JobStatus"`;

    exec(psCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao executar comando: ${error}`);
            return res.status(500).json({ error: 'Erro ao obter a fila de impressão' });
        }

        // Processar a saída do PowerShell
        const jobs = stdout.trim().split('\n').slice(2).map(line => {
            const [document, jobstatus] = line.trim().split(/\s{2,}/);
            return {
                name: document,
                status: jobstatus ? jobstatus.toLowerCase() : 'unknown'
            };
        });

        // Enviar os trabalhos de impressão para o frontend
        res.json(jobs);
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
