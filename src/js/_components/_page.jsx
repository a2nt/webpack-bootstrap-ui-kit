/*
 * Lightbox window
 */
import { Component } from 'react';
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
		Elements: [],
	};

	constructor(props) {
		super(props);

		const ui = this;
		ui.name = ui.constructor.name;
		console.log(`${ui.name}: init`);

		ui.axios = axios;

		document.querySelectorAll('.graphql').forEach((el) => {
			el.addEventListener('click', (e) => {
				e.preventDefault();

				const el = e.currentTarget;
				const link =
					el.getAttribute('href') || el.getAttribute('data-href');

				ui.state.current = el;

				ui.load(link);
			});
		});
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
			Elements: [],
		});
	};

	load = (link) => {
		const ui = this;
		const axios = ui.axios;

		ui.reset();
		ui.setState({ loading: true });

		axios
			.get(link)
			.then((resp) => {
				// handle success
				console.log(
					`${ui.name}: response content-type: ${resp.headers['content-type']}`,
				);

				const page = resp.data.data.readPages.edges[0].node;
				console.log(page);
				ui.setState({
					ID: page.ID,
					Title: page.Title,
					Elements: page.Elements.edges,
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
			})
			.then(() => {
				ui.setState({ loading: false });
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
