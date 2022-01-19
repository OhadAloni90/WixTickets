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