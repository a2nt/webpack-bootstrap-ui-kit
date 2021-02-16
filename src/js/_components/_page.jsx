/*
 * page #MainContent area
 */
import { Component } from 'react';
import Events from '../_events';

import { useQuery, gql } from '@apollo/client';
import { client } from './_apollo';
import { cache } from './_apollo.cache';

const D = document;
const BODY = document.body;

class Page extends Component {
	state = {
		type: [],
		shown: false,
		Title: 'Loading ...',
		loading: true,
		error: false,
		current: null,
		ID: null,
		URLSegment: null,
		ClassName: 'Page',
		CSSClass: null,
		Summary: null,
		Link: null,
		URL: null,
		Elements: [],
		page: null,
	};

	componentDidUpdate() {
		const ui = this;

		if (ui.state.Title) {
			document.title = ui.state.Title;
		}

		if (ui.state.Elements.length) {
			window.dispatchEvent(new Event(Events.AJAX));
		}
	}

	constructor(props) {
		super(props);

		const ui = this;

		ui.name = ui.constructor.name;
		ui.empty_state = ui.state;

		console.log(`${ui.name}: init`);
	}

	isOnline = () => {
		return BODY.classList.contains('is-online');
	};

	load = (link) => {
		const ui = this;
		const url_segment = link.split('/').pop();

		return new Promise((resolve, reject) => {
			const query = gql(`
			query Pages {
			  readPages(URLSegment: "${url_segment}", limit: 1, offset: 0) {
			    edges {
			      node {
			        __typename
			        _id
			        ID
			        Title
			        ClassName
			        CSSClass
			        Summary
			        Link
			        URLSegment
			        Elements {
			          edges {
			            node {
			              __typename
			        	 _id
			              ID
			              Title
			              Render
			            }
			          }
			          pageInfo {
			            hasNextPage
			            hasPreviousPage
			            totalCount
			          }
			        }
			      }
			    }
			    pageInfo {
			      hasNextPage
			      hasPreviousPage
			      totalCount
			    }
			  }
			}
		`);

			if (!ui.isOnline()) {
				const resp = client.readQuery({ query });

				if (ui.processResponse(resp)) {
					console.log(`${ui.name}: Offline cached response`);
					resolve(resp);
				} else {
					console.log(`${ui.name}: No offline response`);
					reject();
				}
			} else {
				if (!ui.state.loading) {
					ui.setState(ui.empty_state);
				}

				client
					.query({
						query: query,
						fetchPolicy: ui.isOnline() ? 'no-cache' : 'cache-first',
					})
					.then((resp) => {
						// write to cache
						client.writeQuery({ query, data: { resp } });
						if (ui.processResponse(resp.data)) {
							console.log(`${ui.name}: got the server response`);
							resolve(resp.data);
						} else {
							console.log(`${ui.name}: not found`);
							reject();
						}
					});
			}
		});
	};

	processResponse = (data) => {
		const ui = this;

		if (!data.readPages.edges.length) {
			console.log(`${ui.name}: not found`);

			ui.setState({
				Title: 'Not Found',
				CSSClass: 'graphql__not-found',
				Summary: 'Not Found',
				loading: false,
			});

			return false;
		}

		const page = data.readPages.edges[0].node;
		ui.setState({
			ID: page.ID,
			Title: page.Title,
			ClassName: page.ClassName,
			URLSegment: page.URLSegment,
			CSSClass: page.CSSClass,
			Summary: page.Summary,
			Link: page.Link,
			Elements: page.Elements.edges,
			loading: false,
		});

		return true;
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
		const className = `elemental-area page-${ui.state.CSSClass} url-${ui.state.URLSegment}`;

		const ElementItem = (props) => (
			<div dangerouslySetInnerHTML={props.html}></div>
		);

		let html = '';
		if (ui.state.Elements.length) {
			console.log(`${ui.name}: render`);
			ui.state.Elements.map((el) => {
				html += el.node.Render;
			});
		} else {
			console.log(`${ui.name}: loading`);
			html += '<div class="loading">Loading ...</div>';
		}

		return (
			<div
				className={className}
				dangerouslySetInnerHTML={ui.getHtml(html)}
			></div>
		);
	}
}

export default Page;
