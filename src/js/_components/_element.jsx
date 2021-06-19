/*
 * Lightbox window
 */
import {
    Component
} from 'react';
import Events from '../_events';

import {
    client
} from './_apollo';
import {
    gql
} from '@apollo/client';

class Page extends Component {
    state = {
        type: [],
        shown: false,
        loading: false,
        error: false,
        current: null,
        ID: null,
        URLSegment: null,
        ClassName: 'Page',
        CSSClass: null,
        Title: null,
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

            if (ui.state.URL) {
                window.history.pushState(
                    {
                        page: JSON.stringify(ui.state)
                    },
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
        const query = gql(`
			query Pages {
			  readPages(URLSegment: "home", limit: 1, offset: 0) {
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

        ui.reset();
        ui.setState({
            Title: 'Loading ...',
            loading: true,
        });
        console.log(client.readQuery({
            query
        }));
        client
            .query({
                query: query,
            })
            .then((resp) => {
                const page = resp.data.readPages.edges[0].node;

                // write to cache
                client.writeQuery({
                    query,
                    data: {
                        resp
                    }
                });
                console.log(client.readQuery({
                    query
                }));

                ui.setState({
                    ID: page.ID,
                    Title: page.Title,
                    ClassName: page.ClassName,
                    URLSegment: page.URLSegment,
                    CSSClass: page.CSSClass,
                    Summary: page.Summary,
                    Link: page.Link,
                    Elements: page.Elements.edges,
                    URL: page.Link || link,
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

                ui.setState({
                    error: msg
                });
            });
    };

    getHtml = (html) => {
        const decodeHtmlEntity = (input) => {
            var doc = new DOMParser().parseFromString(input, 'text/html');
            return doc.documentElement.textContent;
        };

        return {
            __html: decodeHtmlEntity(html)
        };
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
            ui.state.Elements.map((el) => {
                html += el.node.Render;
            });
        } else {
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
