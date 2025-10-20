import { isValueValid } from '@/app/lib/utils/validations';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  list: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  li: { flexDirection: 'row', width: '50%', paddingRight: 8, marginBottom: 3 },
  bullet: {
    width: 10, // fixed width keeps the indent
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 1.2,
  },
  itemText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 1.4, // nice readability
  },
});

export const BulletItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.li}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.itemText}>{children}</Text>
  </View>
);

const Skills = ({ skills }: { skills?: string[] }) => {
  return (
    <View style={styles.list}>
      {skills?.map((t: string, i: number) => {
        if (!isValueValid(t)) return;
        return <BulletItem key={i}>{t}</BulletItem>;
      })}
    </View>
  );
};

export default Skills;
