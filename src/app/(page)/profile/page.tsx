import React from 'react';
import Box from '@/components/Box';
import TopProfileDetails from './components/top-profile-details';
import AboutMe from './components/about-me';

const Profile = () => {
  return (
    <div>
      <Box className="mb-5">
        <TopProfileDetails />
      </Box>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
        <Box className="mb-5 p-4">
          <AboutMe />
        </Box>
        <Box className="mb-5 p-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget nibh dignissim, efficitur nisl sit amet,
          sagittis turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut cursus nulla, in faucibus
          turpis. Quisque eget nibh risus. Morbi felis nunc, vehicula eget sodales non, iaculis sit amet sem. Vestibulum
          blandit quam a rutrum porttitor. Nam nec efficitur tellus, auctor vulputate dolor. Maecenas turpis mauris,
          lobortis in iaculis ac, gravida sit amet diam.
        </Box>
      </div>
    </div>
  );
};

export default Profile;
