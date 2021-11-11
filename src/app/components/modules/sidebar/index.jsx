import React from 'react';
import PropTypes from 'prop-types';
import SideBarWrapper from './style';

const SideBar = ({ children }, column) => (
    <SideBarWrapper column={column}>{children}</SideBarWrapper>
);

SideBar.propTypes = {
    children: PropTypes.element.isRequired,
};

export default SideBar;
