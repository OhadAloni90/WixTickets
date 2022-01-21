import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import {Ticket, TicketResponse} from '../client/src/api'

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
  const page: number = req.query.page || 1;
  const search: string = req.query.search || '';
  const numOfPages: number = Math.ceil(tempData.length / PAGE_SIZE)
  const iOfLastTckt: number = page * PAGE_SIZE;
  const iOfFirstTckt: number = iOfLastTckt - PAGE_SIZE;
  let paginationData: Ticket[] = [];


  if(!search) {
    filtData = [...tempData]
  }
  else {
    filtData = tempData.filter((ticket) => ticket.title.includes(search) || ticket.content.includes(search)) ;

  }

  console.log('page num is', page)
  console.log('io first', iOfFirstTckt)
  console.log('io second', iOfLastTckt)
  

  if( iOfLastTckt - iOfFirstTckt > 0) {
     paginationData = filtData.slice(iOfFirstTckt, iOfLastTckt);

  }
  let result: TicketResponse = {ticketPage: paginationData, numberOfPages: numOfPages, pageNumber: page };
  res.send(result);

});


app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

