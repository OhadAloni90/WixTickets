import React from 'react';
import { FaRegStar } from 'react-icons/fa';
import {createApiClient, Ticket, TicketResponse} from '../../api'
import { TicketCard } from '../ticket';

export type HomeState = {
	 tickets:Ticket[],
	 hiddenTickets:number, 
	 search: string,
	 searchDebounce: any,
	 page: number,
	 tktsPetPage: number,
	 didScrollToBottom: boolean,
	 favTickets: Ticket[],
	 isToggled: boolean
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
			didScrollToBottom: false,
			favTickets: [],
			isToggled: true
			
			
		}
	}

	
	api = createApiClient();

	async componentDidMount() { // Call getTickets on scroll with a listener.
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
			hiddenTickets: this.state.hiddenTickets + 1})
			
    }

	onScroll = async() => { //Inifinite scroll 
		const {isToggled} = this.state;
		console.log(window.innerHeight + window.scrollY)
		console.log(document.body.scrollHeight)
		if ((window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight -	 10) ) 
		{	
			if(!this.state.didScrollToBottom && isToggled) //Got re-rendered so I had to put a boolean value because it was too sensitive
			{
				this.setState({didScrollToBottom: true})
				console.log(document.body.scrollLeft)
				const newPage = this.state.page + 1;
				this.setState({page: newPage})
				await this.getTickets(this.state.search, newPage)
				
			}	
			
		}

		else {
			this.setState({didScrollToBottom: false})
		}
	}	

	onIsFav = async() => {
		const {tickets,favTickets, isToggled} = this.state;
		this.setState({isToggled: !isToggled})
		if(isToggled) {
			this.setState({tickets: favTickets})
		}
		else if(!isToggled){
			this.setState({tickets: []})
			await this.getTickets('', 1)
		}
	}
		
		

    


    onFavHandler = (ticketId: string) => {
		 this.state.tickets.map(ticket => {
			if(ticket.id === ticketId && this.state.favTickets.every((ticket)=>ticket.id !== ticketId)){ // Avoid double values in list
				this.state.favTickets.push(ticket)

			}
		});
		this.setState({
			favTickets: this.state.favTickets})
		
		console.log(this.state.favTickets)
			
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

				return (<div className='tickets'>
						{filteredTickets && filteredTickets.map((ticket:Ticket)=>{
								return(
									<TicketCard key={ticket.id} ticket={ticket} onFavChange= {this.onFavHandler} onHideChange={this.onHideHandler} />
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
	
	onSortHandle = (tickets: Ticket[]) => {
		let returnedArray = tickets.sort((a,b)=> new Date(a.creationTime) > new Date(b.creationTime) ? 1 : -1).
		map((ticket)=>  {return { ...ticket}})
		this.setState({tickets: returnedArray})
	}


	render() {	
		
		const {tickets, hiddenTickets} = this.state;
		return (<main>
			<div className='headline'>
				<h1>Tickets List </h1> 
				<div className='fav-div'>
					<span ><FaRegStar className='star'/></span>
						<label className="switch" >
							<input type="checkbox" onClick = {()=>this.onIsFav()}/>
							<span className="slider round"></span>
						</label>
				</div>
			</div>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <button className='sort-btn' onClick={()=> this.onSortHandle(tickets)}>Filter by date</button>:null}

			{tickets ? <div className='results'>Showing {tickets.length-hiddenTickets} results {hiddenTickets ? <i>({hiddenTickets} hidden tickets) <a onClick={() => this.onRestoreHandler() }>restore</a></i>  : null}	</div> : null }
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}

		</main>)
	}
}

export default Home;