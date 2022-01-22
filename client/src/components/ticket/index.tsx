import React from 'react';
import { Ticket } from '../../api';
import {FaCopy, FaStar} from "react-icons/fa"

export type TicketProps = {
	ticket: Ticket,
	onHideChange: Function,
	onFavChange: Function
	
}

export type TicketState = {
	showMore: boolean,
	copyText: boolean
}



export class TicketCard extends React.PureComponent<TicketProps,TicketState> {
	constructor(props:TicketProps){
		super(props);

		this.state = {
			showMore: false,
			copyText: false,
		}
	}
	onHide = (id: string) => {
		this.props.onHideChange(id);
	}

	onFav = (id: string) => {
		this.props.onFavChange(id)
	}

	onCopyToClipBoard = (content: string) => {
		navigator.clipboard.writeText(content);
		this.setState({
			copyText: true})

		setTimeout(async () => {
			this.setState({
				copyText: false
			});


		}, 800);
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
					<hr/>
					<div className='extra-cont'>
						<span className='copy-btn' onClick={()=>this.onFav(ticket.id)}><FaStar/></span>
						<span  className='copy-btn' onClick={() => this.onCopyToClipBoard(ticket.content)}><FaCopy/>{this.state.copyText ? <span className='suc-copy'>Copied</span> : null}</span>

					</div>

					
			</footer>

			</li>
			</div>

	}
}

export default TicketCard;