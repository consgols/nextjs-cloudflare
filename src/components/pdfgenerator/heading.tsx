/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  profileImageContainer: {
    position: 'relative',
  },
  profileImageWrapper: {
    position: 'absolute',
    border: '5px solid #fff',
    borderRadius: '70',
    top: 76,
    right: 60,
  },
  profileImage: {
    height: 130,
    width: 130,
    backgroundColor: '#ccc',
    borderRadius: 100,
    objectFit: 'cover',
  },
});

type HeadingProps = {
  coverUrl: string;
  samplePFUrl: string;
  PFurl?: string;
};

export const Heading = ({ coverUrl, samplePFUrl, PFurl }: HeadingProps) => (
  <View>
    <Image src={coverUrl} />
    <View style={styles.profileImageWrapper}>
      <Image style={styles.profileImage} src={PFurl ? PFurl : samplePFUrl} />
    </View>
  </View>
);
