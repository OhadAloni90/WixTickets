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
    	await this.getTickets();
	}

	async getTickets(){
		const getTickets = await this.api.getTickets()
		this.setState({
			tickets: getTickets,
			ticketsClone: getTickets
		});
	}

  onHideHandler = (ticketId: string) => {
	let newTickets = this.state.tickets.slice();
	let returnedArray = newTickets.filter(ticket => 
		ticket.id !== ticketId)
		this.setState({
		  tickets: returnedArray
		})
	this.setState({hiddenTickets: this.state.hiddenTickets+1})
	
    }



    onRestoreHandler = (tickets: Ticket[]) => 
    { 
		tickets = this.state.ticketsClone
      this.setState({tickets: tickets});
      this.setState({hiddenTickets: 0})
    }


// 	showLessOrMore = (content: string, id: string) =>{
//         return <div className='content'> {content.length <= 360  ? content :
//             this.state.showFullText ? <div>{content}<br /><button className = "link" onClick={()=>this.onShowLess()}>See less</button></div> :
//                 <div>{content.slice(0, 360) + '...'}<br /><button className="link" onClick={()=>this.onShowMore()}> See more </button></div>} </div>
// 	}

// 	onShowMore = () => {
//         this.setState({showFullText: true})
//     }

//     onShowLess = () => {
//         this.setState({ showFullText: false })
//     }


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
			
					// return <div className="tickets">
		// 		{ tickets && 
		// 		tickets.map((ticket: Ticket)=>{
		// 			return <TicketCard ticket={ticket}/> 
		// 		})
		// 		}
		// </div>
		
			

		// return (<ul className='tickets'>
		// 	{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
		// 		<div className='title-block'>
		// 			<h5 className='title'>{ticket.title}</h5>
		// 			<h4 className='hide-btn' onClick={() => this.onClickHandler(ticket.id, tickets)}>Hide</h4>
		// 		</div>
		// 		<div>
		// 			{ticket.content}
		// 		</div>
		// 		 {/*show tickets content */}

		// 		<footer>
		// 			<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
        //   <div className='labels'> {ticket.labels && ticket.labels.map((label, i)=> <span key={i} className='label'>{label}</span>)} </div>
		// 		</footer>
		// 	</li>))}
		// </ul>);
	

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.state.searchDebounce);

		setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	render() {	
		
		// return <div className="tickets">
		// 		{ tickets && 
		// 		tickets.map((ticket: Ticket)=>{
		// 			return <TicketCard ticket={ticket}/> 
		// 		})
		// 		}
		// </div>
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