import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import { BulletItem } from './skills';

const styles = StyleSheet.create({
  list: { marginTop: 4 },
});

const Certificates = ({ certs }: { certs?: string[] }) => {
  const items = certs as string[];

  return (
    <View style={styles.list}>
      {items.map((t, i) => (
        <BulletItem key={i}>{t}</BulletItem>
      ))}
    </View>
  );
};

export default Certificates;
