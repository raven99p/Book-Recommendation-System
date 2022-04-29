import React from 'react';
import { Grid } from '@material-ui/core';

export default function Landing() {
  return (
    <Grid container spacing={4} style={{ maxWidth: '101%' }}>
      {/* <Grid item xs={2} /> */}
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <h1>Guess my book</h1>
      </Grid>
      {/* <Grid item xs={2} /> */}

      <Grid item xs={2} />
      <Grid item xs={8}>
        <div className="page">
          <div className="card">
            <div className="container">
              <div className="content">
                <div className="text" style={{ textAlign: 'center' }}>
                  <h1>
                    Let&apos;s discover
                    {' '}
                    <br />
                    the world
                    {' '}
                    <br />
                    of books.
                  </h1>
                  <p>Find your book</p>
                  <a href="/login">Login !</a>
                  {' or '}
                  <a href="/register">Register !</a>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="content">
                <div className="text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ullamcorper
                  sed nibh in vestibulum. Vestibul um nec leo eu enim suscipit lobortis. Sed quis
                  efficitur dolor. Pellentesque habitant morbi tristique senectus e t netus et
                  malesuada fames ac turpis egestas. Etiam et risus laoreet, mollis lorem eu,
                  facilisis massa. Vestib ulum ultrices quis tortor dictum tincidunt. Quisque eros
                  turpis, tristique vel dui eu, ultricies vulputate felis. Cras porttitor auctor
                  augue at mattis. Nulla al
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
      <Grid item xs={2} />
    </Grid>
  );
}
