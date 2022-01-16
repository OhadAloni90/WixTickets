import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
export type AppState = {
	tickets?: Ticket[],
  ticketsClone: Ticket[],
	search: string;
	hiddenTickets: number;
}
const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

  
	
	state: AppState = {
		search: '',
    hiddenTickets: 0,
    ticketsClone: []
	}

	searchDebounce: any = null;

	async componentDidMount() {
    const getTickets = await api.getTickets()
		this.setState({
			tickets: getTickets,
      ticketsClone: getTickets
		});
	}

  onClickHandler = (id: string, tickets: Ticket[]) => {
    
    let ticketsLeft = this.state.hiddenTickets;
    ticketsLeft+=1;
    this.setState({hiddenTickets: ticketsLeft})
    
    let filtteredArray = [...tickets];
    let returnedArray = filtteredArray.filter(ticket => 
      ticket.id !== id)
      this.setState({
        tickets: returnedArray
      })
    }

    onRestoreHandler = (tickets: Ticket[]) => 
    { 
      
      this.setState({tickets: tickets});
      this.setState({hiddenTickets: 0})
    }

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
				<div className='title-block'>
					<h5 className='title'>{ticket.title}</h5>
					<h4 className='hide-btn' onClick={() => this.onClickHandler(ticket.id, tickets)}>Hide</h4>
				</div>
				<p className='content'>{ticket.content}</p> {/*show tickets content */}

				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
				</footer>
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	render() {	
		const {tickets, hiddenTickets, ticketsClone} = this.state;
		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results {hiddenTickets ? <i>({hiddenTickets} hidden tickets) <a onClick={() => this.onRestoreHandler(ticketsClone) }>restore</a></i>  : null}	</div> : null }
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;