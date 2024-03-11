const fs = require('fs');
const util = require('util');
const path = require('path');
const readdir = util.promisify(fs.readdir);
import { createCanvas, loadImage } from 'canvas';

const inputFolder = './in/';
const outputFolder = './out/';

const getFiles = async (dir: string) => {
    try {
        return (await readdir(dir)) as string[];
    } catch (error: any) {
        console.log(error);
        return [];
    }
};

const generateImage = async (file: string) => {
    try {
        const inFile = `${inputFolder}${path.basename(file)}`;
        const outFile = `${outputFolder}${path.basename(file)}`;

        const size = 144;
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        const img = await loadImage(inFile);

        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(img, 40, 64, 64, 64);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';

        console.log('writing ', outFile, '...');
        fs.writeFileSync(outFile, canvas.toBuffer('image/png'));
    } catch (er) {
        console.log(er);
    }
};

(async () => {
    const inputFiles = await getFiles(inputFolder);
    for (const file of inputFiles) {
        await generateImage(file);
    }

    console.log('all done');
    process.exit();
})();
