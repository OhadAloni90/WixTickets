import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import Home from './components/home';


export type AppState = {
	tickets?: Ticket[],
  ticketsClone: string[],
	search: string,
	hiddenTickets: number;
	showFullText: boolean;
	searchDebounce: any,
	
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
	render() {	
		return <Home />
	}
}

export default App;