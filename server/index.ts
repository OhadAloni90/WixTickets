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
    //ran out of time, but:
    //The idea was to find the appropriate tickets for the requested dates, or send the requested email, but the code does not work well and is not algorithmically correct. 
    //There is a problem of spaces or values ​​that are not 1: 1 the requested values. There is also a problem with frondend regarding their client side and rendering of the tickets.
    // The better way or the next thing I woul've done is to slice or use a function to get the indexes and ignore and values who can break the code. After we have the indexes, we
    // can map as done in this code, using the same boolean expression to filter the tickets array we get from the server.
    if (search.match('after:')) {
      let date = search.slice(6,16);
      let searchTitle = search.slice(16);
      
      filtData = tempData.filter((ticket)=> ((new Date(ticket.creationTime).toLocaleDateString("en-UK").replace(/\//g, '-') < date) && ticket.title.toLowerCase().includes(searchTitle))
      
      )}
    else if (search.startsWith('before:')) {
      let date = search.slice(7,17);
      let searchTitle = search.slice(17);
      filtData = tempData.filter((ticket)=> ((new Date(ticket.creationTime).toLocaleDateString("en-UK").replace(/\//g, '-') > date) && ticket.title.toLowerCase().includes(searchTitle))

      )} 

    else if (search. startsWith('from:')) {
      let eMail = search.slice(5);
      filtData = tempData.filter((ticket)=> ticket.userEmail.toLowerCase().includes(eMail))

    }
    else {
      filtData = tempData.filter((ticket) => ticket.title.includes(search) || ticket.content.includes(search)) ;
    }
  }
    
     paginationData = filtData.slice(iOfFirstTckt, iOfLastTckt);


  let result: TicketResponse = {ticketPage: paginationData, numberOfPages: numOfPages, pageNumber: page }
  res.send(result);

});


app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

