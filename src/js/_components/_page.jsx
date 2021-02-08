/*
 * Lightbox window
 */
import { Component } from 'react';
import Events from '../_events';
const axios = require('axios');

class Page extends Component {
	state = {
		type: [],
		shown: false,
		loading: false,
		error: false,
		current: null,
		ID: null,
		ClassName: 'Page',
		Title: null,
		URL: null,
		Elements: [],
		page: null,
	};

	componentDidUpdate() {
		const ui = this;

		if (ui.state.Title) {
			document.title = ui.state.Title;

			if (ui.state.URL) {
				window.history.pushState(
					{ page: JSON.stringify(ui.state) },
					ui.state.Title,
					ui.state.URL,
				);
			}
		}

		if (ui.state.Elements.length) {
			window.dispatchEvent(new Event(Events.AJAX));
		}
	}

	constructor(props) {
		super(props);

		const ui = this;
		ui.name = ui.constructor.name;
		console.log(`${ui.name}: init`);

		ui.axios = axios;
	}

	reset = () => {
		const ui = this;

		ui.setState({
			type: [],
			shown: false,
			loading: false,
			error: false,
			ID: null,
			Title: null,
			URL: null,
			Elements: [],
		});
	};

	load = (link) => {
		const ui = this;
		const axios = ui.axios;

		ui.reset();
		ui.setState({
			Title: 'Loading ...',
			loading: true,
		});

		axios
			.get(link)
			.then((resp) => {
				// handle success
				console.log(
					`${ui.name}: response content-type: ${resp.headers['content-type']}`,
				);

				const page = resp.data.data.readPages.edges[0].node;
				ui.setState({
					ID: page.ID,
					Title: page.Title,
					Elements: page.Elements.edges,
					URL: page.URL || link,
					loading: false,
				});
			})
			.catch((error) => {
				console.error(error);

				let msg = '';

				if (error.response) {
					switch (error.response.status) {
						case 404:
							msg = 'Not Found.';
							break;
						case 500:
							msg = 'Server issue, please try again latter.';
							break;
						default:
							msg = 'Something went wrong.';
							break;
					}
				} else if (error.request) {
					msg = 'No response received';
				} else {
					console.warn('Error', error.message);
				}

				ui.setState({ error: msg });
			});
	};

	getHtml = (html) => {
		const decodeHtmlEntity = (input) => {
			var doc = new DOMParser().parseFromString(input, 'text/html');
			return doc.documentElement.textContent;
		};

		return { __html: decodeHtmlEntity(html) };
	};

	render() {
		const ui = this;
		const name = ui.name;

		const ElementItem = (props) => (
			<div dangerouslySetInnerHTML={props.html}></div>
		);

		let html = '';
		ui.state.Elements.map((el) => {
			html += el.node.Render;
		});

		return (
			<div
				className="elemental-area"
				dangerouslySetInnerHTML={ui.getHtml(html)}
			></div>
		);
	}
}

export default Page;
