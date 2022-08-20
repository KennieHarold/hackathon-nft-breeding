import express from 'express';
import axios, {AxiosResponse} from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';
import {generateImageFromGene} from './generate';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/metadata/:tokenId', async (req, res) => {
  const tokenId = req.params.tokenId;
  if (!fs.existsSync(path.join(__dirname + `/metadata/${tokenId}.json`))) {
    return res.status(404).send('Not found');
  }
  const rawdata = fs.readFileSync(path.join(__dirname + `/metadata/${tokenId}.json`));
  const metadata = JSON.parse(rawdata.toString());

  return res.status(200).json(metadata);
});

app.post('/api/ipfs/pin/metadata-with-image', async (req, res) => {
  const gene = req.body?.gene;
  const tokenId = req.body?.tokenId;

  if (!gene || !tokenId) {
    return res.status(400).send('Missing gene or tokenId');
  }

  if (gene.length !== 8) {
    return res.status(400).send('Invalid gene length');
  }

  const isGenerated = generateImageFromGene(gene);

  if (!isGenerated) {
    return res.status(500).send('Error generating image from gene');
  }

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append('file', fs.createReadStream(`./src/temp/breed.png`));
  data.append('pinataOptions', '{"cidVersion": 1}');
  data.append('pinataMetadata', `{"name": "toffee-${tokenId}-${gene}", "keyvalues": {"company": "hackaton-toffee"}}`);

  return axios
    .post(url, data, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        ...data.getHeaders(),
      },
    })
    .then(function (response: AxiosResponse) {
      if (response?.data?.IpfsHash) {
        if (!fs.existsSync(path.join(__dirname + '/metadata'))) {
          fs.mkdirSync(path.join(__dirname + '/metadata'));
        }

        let data = {
          name: `toffee#${tokenId}`,
          image: response.data.IpfsHash,
        };

        fs.writeFileSync(path.join(__dirname + `/metadata/${tokenId}.json`), JSON.stringify(data));
        return res.status(200).send('Success!');
      }
      return res.status(500).send('Falied to upload image to IPFS');
    })
    .catch(function (error: any) {
      console.log(error);
      return res.status(500).send(error);
    });
});

app.listen(port, () => {
  return console.log(`Server listening at http://localhost:${port}`);
});
