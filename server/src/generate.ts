import {createCanvas, loadImage} from 'canvas';
import path from 'path';
import fs from 'fs';

const assetsMap = {
  background: ['darkmint', 'darkviolet', 'melon', 'mint', 'violet'],
  body: ['green', 'melon', 'mint', 'orange', 'pink'],
  scarf: ['blue', 'green', 'lightblue', 'red', 'yellow'],
  head: ['brown', 'green', 'melon', 'mint', 'violet'],
  ears: ['green', 'melon', 'mint', 'pink', 'velvet'],
  eyes: ['green', 'melon', 'mint', 'red', 'violet'],
  nose: ['green', 'melon', 'mint', 'red', 'violet'],
  mouth: ['darkgreen', 'green', 'melon', 'red', 'violet'],
};

export const generateImageFromGene = (_gene: string) => {
  try {
    let gene = [];
    for (let i = 0; i < _gene.length; i++) {
      gene.push(_gene[i]);
    }

    const width = 500;
    const height = 500;

    //  Create image using canvas
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    // Background
    loadImage(path.join(__dirname + './assets/background/' + assetsMap.background[gene[0]] + '.png')).then((image) => {
      context.drawImage(image, 0, 0, width, height);
    });

    // Body
    loadImage(path.join(__dirname + './assets/body/' + assetsMap.body[gene[1]] + '.png')).then((image) => {
      context.drawImage(image, 0, 0, width, height);
    });

    // Scarf
    loadImage(path.join(__dirname + './assets/scarf/' + assetsMap.scarf[gene[2]] + '.png')).then((image) => {
      context.drawImage(image, 0, 0, width, height);
    });

    // Head
    loadImage(path.join(__dirname + './assets/head/' + assetsMap.head[gene[3]] + '.png')).then((image) => {
      context.drawImage(image, 0, 0, width, height);
    });

    // Ears
    loadImage(path.join(__dirname + './assets/ears/' + assetsMap.ears[gene[4]] + '.png')).then((image) => {
      context.drawImage(image, 0, 0, width, height);
    });

    // Eyes
    loadImage(path.join(__dirname + './assets/eyes/' + assetsMap.eyes[gene[5]] + '.png')).then((image) => {
      context.drawImage(image, 0, 0, width, height);
    });

    // Nose
    loadImage(path.join(__dirname + './assets/nose/' + assetsMap.nose[gene[6]] + '.png')).then((image) => {
      context.drawImage(image, 0, 0, width, height);
    });

    // Mouth
    loadImage(path.join(__dirname + './assets/mouth/' + assetsMap.mouth[gene[7]] + '.png')).then((image) => {
      context.drawImage(image, 0, 0, width, height);

      const buffer = canvas.toBuffer('image/png');
      if (!fs.existsSync(path.join(__dirname + '/temp'))) {
        fs.mkdirSync(path.join(__dirname + '/temp'));
      }

      fs.writeFileSync(path.join(__dirname + `/temp/breed.png`), buffer);
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
