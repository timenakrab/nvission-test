import App, { AppProps } from 'next/app';
import Head from 'next/head';
import { withRouter } from 'next/router';
import React from 'react';

class MyApp extends App<AppProps> {
  constructor(props: AppProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        </Head>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} router={router} />
      </>
    );
  }
}

export default withRouter(MyApp);
