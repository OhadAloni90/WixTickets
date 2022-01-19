import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import {Ticket} from '../client/src/api'

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {
  let filtData = [];
  // @ts-ignore
  const page: number = req.query.page || 1;
  const search: string = req.query.search || 1;
  if(!search) {
    filtData = [...tempData]
    console.log('this is tempdata' + tempData)

  }
  else {
    filtData = tempData.filter((ticket)=> ticket.title.includes(search) || ticket.content.includes(search)) ;

  }
  const paginatedData = filtData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  
  res.send(paginatedData);
});


app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

