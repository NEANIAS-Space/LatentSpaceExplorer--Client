import PropTypes from 'prop-types';
import Header from 'app/components/modules/header';
import ProjectorLayoutWrapper from './style';

const ProjectorLayout = ({ children }) => (
  <ProjectorLayoutWrapper>
    <Header />
    {children}
  </ProjectorLayoutWrapper>
);

ProjectorLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ProjectorLayout;
