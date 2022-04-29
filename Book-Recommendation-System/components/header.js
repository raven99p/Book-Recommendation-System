/* eslint-disable react/jsx-props-no-spreading */
import { React } from 'react';
import { Typography, Toolbar, AppBar } from '@material-ui/core';
import Link from 'next/link';

export default function header() {
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{ height: 95, marginBottom: '5%', backgroundColor: '#20613e' }}
      >
        <Toolbar style={{ height: 95 }}>
          <span>
            <Typography variant="h6" noWrap>
              <Link color="inherit" href="/user/home">
                <a style={{ textDecoration: 'none', color: 'white' }}>Guess My Book</a>
              </Link>
            </Typography>
          </span>
        </Toolbar>
      </AppBar>
    </div>
  );
}
