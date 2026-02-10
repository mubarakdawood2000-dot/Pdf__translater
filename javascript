const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const openai = new OpenAI({ apiKey: 'ضع_مفتاح_OpenAI_هنا' });

app.use(cors());
app.use(fileUpload());

app.post('/translate', async (req, res) => {
    try {
        if (!req.files) return res.status(400).send('لم يتم رفع ملف.');
        
        const pdfData = await pdfParse(req.files.pdf.data);
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // أحدث موديل للترجمة الدقيقة
            messages: [
                { role: "system", content: "Translate this text to Arabic." },
                { role: "user", content: pdfData.text }
            ],
        });

        res.json({ text: completion.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log('Server is running on port 5000'));
