import { View, Text, StyleSheet } from '@react-pdf/renderer';

const style = StyleSheet.create({
  company: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  maincontainer: { marginBottom: 25 },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  position: {
    fontWeight: 600,
    marginRight: 8,
  },
  companyRoleContainer: {
    gap: 5,
  },
  tenureship: {
    fontSize: 10,
    fontWeight: 400,
  },
  description: { marginTop: 8 },
});

const WorkExperience = ({ workExperience }: CVFormWorkExperienceData) => (
  <View>
    {workExperience &&
      workExperience.length > 0 &&
      workExperience.map((experience, idx) => (
        <View key={`${idx} - ${experience.company}`} style={style.maincontainer}>
          <View style={style.topContainer}>
            <View style={style.companyRoleContainer}>
              <Text style={style.company}>{experience.company}</Text>
              <Text style={style.position}>{experience.role}</Text>
            </View>
            {experience.date && <Text style={style.tenureship}>{experience.date}</Text>}
          </View>
          <Text style={style.description}>{experience.workDetails}</Text>
        </View>
      ))}
  </View>
);

export default WorkExperience;
