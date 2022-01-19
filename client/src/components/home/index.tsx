import React from 'react';
import {createApiClient, Ticket} from '../../api'
import { TicketCard } from '../ticket';

export type HomeState = {
	 tickets:Ticket[],
	 hiddenTickets:number, 
	 ticketsClone:Ticket[]
	 search: string,
	 searchDebounce: any 
}



export class Home extends React.PureComponent<{},HomeState> {
	constructor(props:any){
		super(props)

		this.state = {
			tickets:[],
			hiddenTickets:0,
			ticketsClone:[],
			search: '',
			searchDebounce: null,
			
		}
	}

	
	api = createApiClient();

	async componentDidMount() {
    	await this.getTickets(this.state.search);
	}

	async getTickets(search: string){

		const getTickets = await this.api.getTickets(search)
		this.setState({
			tickets: getTickets,
			ticketsClone: getTickets,
			
		});
	}

    onHideHandler = (ticketId: string) => {
		let newTickets = this.state.tickets.slice();
		let returnedArray = newTickets.filter(ticket => 
			ticket.id !== ticketId)
		this.setState({
			tickets: returnedArray,
			hiddenTickets: this.state.hiddenTickets+1})
			
    }



	onRestoreHandler = (tickets: Ticket[]) => 
	{ 
		tickets = this.state.ticketsClone
		this.setState({tickets: tickets});
		this.setState({hiddenTickets: 0})
	}




	renderTickets = (tickets: Ticket[]) => {
		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

				return (<div className='tickets'>
						{filteredTickets && filteredTickets.map((ticket:Ticket)=>{
								return(
									<TicketCard key={ticket.id} ticket={ticket} onHideChange={this.onHideHandler}/>
	
								)
								
						})}</div>)
	}
			
	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.state.searchDebounce);

		setTimeout(async () => {
			this.setState({
				search: val
			});
			this.getTickets(val)

		}, 300);
	}
	
	render() {	
		
		const {tickets, hiddenTickets, ticketsClone} = this.state;
		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results {hiddenTickets ? <i>({hiddenTickets} hidden tickets) <a onClick={() => this.onRestoreHandler(tickets) }>restore</a></i>  : null}	</div> : null }
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default Home;