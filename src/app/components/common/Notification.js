import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ title, message }) => (
  <div>
    <div><strong>{title}</strong></div>
    <div>{message}</div>
  </div>
);

Notification.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Notification;
