import React from 'react';
import { Ticket } from '../../api';
import style from './style.module.scss'

export type TicketProps = {
	ticket: Ticket,
	onHideChange: Function;
	
}

export type TicketState = {
	showMore: boolean	
}



export class TicketCard extends React.PureComponent<TicketProps,TicketState> {
	constructor(props:TicketProps){
		super(props);

		this.state = {
			showMore: false
		}
	}
// 	async componentDidMount() {
//     const getTickets = await api.getTickets()
// 		this.setState({
// 			tickets: getTickets,
//       		ticketsClone: getTickets
// 		});
// 	}

//   onClickHandler = (id: string) => {
// 	console.log(id)
    // let ticketsLeft = this.state.hiddenTickets;
    // ticketsLeft+=1;
    // this.setState({hiddenTickets: ticketsLeft})
    
    // let filtteredArray = [...tickets];
    // let returnedArray = filtteredArray.filter(ticket => 
    //   ticket.id !== id)
    //   this.setState({
    //     tickets: returnedArray
    //   })
    // }

//     onRestoreHandler = (tickets: Ticket[]) => 
//     { 
      
//       this.setState({tickets: tickets});
//       this.setState({hiddenTickets: 0})
//     }


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


// 	renderTickets = (tickets: Ticket[]) => {
// 		const filteredTickets = tickets
// 			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));
		
		
			

// 		return (<ul className='tickets'>
// 			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
// 				<div className='title-block'>
// 					<h5 className='title'>{ticket.title}</h5>
// 					<h4 className='hide-btn' onClick={() => this.onClickHandler(ticket.id, tickets)}>Hide</h4>
// 				</div>
// 				<div>
// 					{this.showLessOrMore(ticket.content, ticket.id)}
// 				</div>
// 				 {/*show tickets content */}

// 				<footer>
// 					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
//           <div className='labels'> {ticket.labels && ticket.labels.map((label, i)=> <span key={i} className='label'>{label}</span>)} </div>
// 				</footer>
// 			</li>))}
// 		</ul>);
// 	}

// 	onSearch = async (val: string, newPage?: number) => {
		
// 		clearTimeout(this.searchDebounce);

// 		this.searchDebounce = setTimeout(async () => {
// 			this.setState({
// 				search: val
// 			});
// 		}, 300);
// 	}
	onHide = (id: string) => {
		this.props.onHideChange(id);
	}



	render() {	
		const {ticket} = this.props;
		const {showMore} = this.state;


		return <div className="ticket-block" >
			<li key={ticket.id} className='ticket'>
			<div className='title-block'>
					<h5 className='title'>{ticket.title}</h5>
					<h4 className='hide-btn' onClick={()=>this.onHide(ticket.id)}>Hide</h4>
			</div>
			<div className="content" data-showmore={showMore}>
				
				{ticket.content}
					
			</div>
					<div>	
						{ticket.content.length > 500 ? <a key={ticket.id} onClick={()=>this.setState({showMore: !showMore})}>{showMore ? 'Show less' : 'Show more'}</a> : null}
					</div>

			<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					<div className='labels'> {ticket.labels && ticket.labels.map((label, i)=> <span key={i} className='label'>{label}</span>)} </div>
			</footer>

			</li>
			</div>

	}
}

export default TicketCard;