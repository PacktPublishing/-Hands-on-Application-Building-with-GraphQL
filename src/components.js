/* eslint-disable react/prop-types */
import React from 'react';

export const BoardContainer = ({
  boardName = 'BOARD TITLE',
  children,
}) => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
    <h3>{boardName}</h3>
    <div
      style={{
        textAlign: 'left',
        backgroundColor: 'blue',
        padding: '1em',
        display: 'flex',
        flex: '1 1 100%',
        overflow: 'auto',
      }}>
      {children}
    </div>
  </div>
);
