import { isValueValid } from '@/app/lib/utils/validations';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const LH = 1.4;

const styles = StyleSheet.create({
  section: { marginTop: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, lineHeight: 1.2 },

  item: { marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 3,
  },
  leftCol: { flexGrow: 1, paddingRight: 8 },
  rightCol: { width: 90, textAlign: 'right' }, // keep dates aligned

  school: { fontSize: 12, fontWeight: 'bold', lineHeight: LH },
  dates: { fontSize: 12, fontWeight: 'bold', lineHeight: LH },

  subtitle: { fontSize: 11, lineHeight: LH },
});

const EducationItem = ({ school, dates, subtitle }: { school: string; dates: string; subtitle: string }) => (
  <View style={styles.item}>
    <View style={styles.row}>
      <View style={styles.leftCol}>
        <Text style={styles.school}>{school}</Text>
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.dates}>{dates}</Text>
      </View>
    </View>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

export default function Education({ educations }: CVFormEducationData) {
  return (
    <View style={styles.section}>
      {educations &&
        educations.length > 0 &&
        educations.map((edu, index) => {
          if (!isValueValid(edu)) return;
          return (
            <EducationItem key={`${edu}-${index}`} school={edu.institution} dates={edu.date} subtitle={edu.degree} />
          );
        })}
    </View>
  );
}
