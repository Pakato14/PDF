const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPdf() {
    try {
        // Inicializa o documento
        const doc = await PDFDocument.create();
        const timesRomanFont = await doc.embedFont(StandardFonts.TimesRoman);

        // Adiciona uma nova página ao documento PDF
        const page = doc.addPage();
        const { width, height } = page.getSize();
        let fontsize = 50;        
        const rodape = `SECRETARIA DO DESENVOLVIMENTO ECONÔMICO\nCENTRO DE EVENTOS DO CEARÁ - AV. WASHINGTON SOARES, 999 - PAVILHÃO LESTE - PORTÃO D\nEDSON QUEIROZ - FORTALEZA, CE - CEP: 60.811-341`;

        // Adiciona texto ao documento PDF
        page.drawText(rodape, {
            x: 25,
            y: height - 15 * fontsize,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
            lineHeight: 14, // Ajuste a altura da linha conforme necessário
        });

        // Carrega a imagem
        const imagePath = path.resolve(__dirname, '../imgs/Docker-Logo-2013.png');
        const imageBytes = fs.readFileSync(imagePath);
        const pngImage = await doc.embedPng(imageBytes);

        let fontsizeImg = 15;

        // Define as dimensões da imagem
        const pngDims = pngImage.scale(0.03); // Reduz o tamanho da imagem para 15%

        // Adiciona a imagem à página
        page.drawImage(pngImage, {
            x: 450,
            y: height - 1.5 * fontsizeImg - pngDims.height, // Coloca a imagem abaixo do texto
            width: pngDims.width,
            height: pngDims.height,
        });

        // Salva o documento PDF
        const pdfBytes = await doc.save();
        const outputPath = path.resolve(__dirname, '../files/output.pdf');
        const outputDir = path.dirname(outputPath);
        
        // Verifica e cria o diretório, se necessário
        fs.mkdirSync(outputDir, { recursive: true });

        // Escreve o arquivo PDF
        fs.writeFileSync(outputPath, pdfBytes);
        console.log('PDF criado com sucesso em', outputPath);
    } catch (error) {
        console.error('Erro ao criar o PDF:', error);
    }
}

createPdf();
