import React from 'react';
import {createApiClient, Ticket, TicketResponse} from '../../api'
import { TicketCard } from '../ticket';

export type HomeState = {
	 tickets:Ticket[],
	 hiddenTickets:number, 
	 search: string,
	 searchDebounce: any,
	 page: number,
	 tktsPetPage: number,
	 numOfPages: number,
	 didScrollToBottom: boolean
}



export class Home extends React.PureComponent<{},HomeState> {
	constructor(props:any){
		super(props)

		this.state = {
			tickets:[],
			hiddenTickets:0,
			search: '',
			searchDebounce: null,
			page: 1,
			tktsPetPage: 20,
			numOfPages: 10,
			didScrollToBottom: false,
			
			
		}
	}

	
	api = createApiClient();

	async componentDidMount() {
    	await this.getTickets(this.state.search, this.state.page);
		window.addEventListener('scroll', this.onScroll);

	}
	async componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}

	async getTickets(search: string, page: number){
		const tickets: TicketResponse = await this.api.getTickets(search, page)
		if(tickets.ticketPage.length){
			this.setState({
				tickets: [...this.state.tickets, ...tickets.ticketPage]
				
			});
		} else {
			this.setState({page: tickets.numberOfPages}); // In case we have another page coming
		}
	}

    onHideHandler = (ticketId: string) => {
		let returnedArray = this.state.tickets.map(ticket => {
			if(ticket.id === ticketId){
				return { ...ticket, isHidden : true}
			}
			return ticket
		});
		
		this.setState({
			tickets: returnedArray,
			hiddenTickets: this.state.hiddenTickets+1})
			
    }

	onScroll = async() => {
		
		console.log(window.innerHeight + window.scrollY)
		console.log(document.body.scrollHeight)
		if ((window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight -	 10))
		{	
			if(!this.state.didScrollToBottom)
			{
				this.setState({didScrollToBottom: true})
				console.log(document.body.scrollLeft)
				const newPage = this.state.page + 1;
				this.setState({page: newPage})
				await this.getTickets(this.state.search, newPage)
				this.setState({numOfPages: this.state.numOfPages - 1})
				console.log(this.state.numOfPages)
				
			}	
		
			
		}


		else {
			this.setState({didScrollToBottom: false})
		}
	}	




	onRestoreHandler = () => {
		let returnedArray = this.state.tickets.map((ticket) =>  {return { ...ticket, isHidden : false}})
			
		
		
		this.setState({
			tickets: returnedArray,
			hiddenTickets: 0})
			
    }



	renderTickets = (tickets: Ticket[]) => {
		const filteredTickets = tickets
			.filter((ticket)=> !ticket.isHidden)
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

			//calc : 
			const iOfLastTckt: number = this.state.page * this.state.tktsPetPage;
			const iOfFirstTckt: number = iOfLastTckt - this.state.tktsPetPage;
			const pagignatedTkts: Ticket[] = filteredTickets.slice(iOfFirstTckt,iOfLastTckt)


				return (<div className='tickets'>
						{filteredTickets && filteredTickets.map((ticket:Ticket)=>{
								return(
									<TicketCard key={ticket.id} ticket={ticket} onHideChange={this.onHideHandler}/>
	
								)
								
						})}</div>)
	}
			
	onSearch = async (val: string, newPage?: number) => {
		clearTimeout(this.state.searchDebounce);
		
		const timeOutId = setTimeout(async () => {
			
			this.setState({
				search: val,
				page: newPage ? 0 : 1, // turns into one page under the same filter - this way we also get the first page rendered and not getting the first page re-rednered on scroll
				tickets: []
			});
			this.getTickets(val, 1)

		}, 300);
		this.setState({searchDebounce: timeOutId }) // setting the time it bounces for typing in consecutive speed, meaning if you type "wix" it will wait 300MS between checking for new typing values

	}
	
	render() {	
		
		const {tickets, hiddenTickets} = this.state;
		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results {hiddenTickets ? <i>({hiddenTickets} hidden tickets) <a onClick={() => this.onRestoreHandler() }>restore</a></i>  : null}	</div> : null }
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default Home;