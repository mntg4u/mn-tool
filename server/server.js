const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/run_code', (req, res) => {
    const { code, language } = req.body;
    let fileName = '';
    let command = '';

    switch (language) {
        case 'js':
            try {
                const result = eval(code);
                res.json({ output: result });
            } catch (error) {
                res.json({ output: 'Error: ' + error.message });
            }
            return;
        case 'python':
            fileName = 'script.py';
            fs.writeFileSync(fileName, code);
            command = `python3 ${fileName}`;
            break;
        case 'php':
            fileName = 'script.php';
            fs.writeFileSync(fileName, code);
            command = `php ${fileName}`;
            break;
        case 'go':
            fileName = 'script.go';
            fs.writeFileSync(fileName, code);
            command = `go run ${fileName}`;
            break;
        case 'c':
            fileName = 'script.c';
            fs.writeFileSync(fileName, code);
            command = `gcc ${fileName} -o script && ./script`;
            break;
        case 'cpp':
            fileName = 'script.cpp';
            fs.writeFileSync(fileName, code);
            command = `g++ ${fileName} -o script && ./script`;
            break;
        case 'java':
            fileName = 'Script.java';
            fs.writeFileSync(fileName, code);
            command = `javac ${fileName} && java Script`;
            break;
        default:
            return res.json({ output: 'Unsupported language' });
    }

    exec(command, (err, stdout, stderr) => {
        if (err) {
            res.json({ output: 'Error: ' + stderr });
        } else {
            res.json({ output: stdout });
        }
        fs.unlinkSync(fileName);  // Clean up the file after execution
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
