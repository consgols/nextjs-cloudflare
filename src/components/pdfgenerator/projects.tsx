import { View, Text, StyleSheet } from '@react-pdf/renderer';

const style = StyleSheet.create({
  maincontainer: { marginBottom: 25 },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  titleRolContainer: { gap: 5 },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  position: {
    fontWeight: 600,
    marginRight: 8,
  },
  tenureship: {
    fontSize: 10,
    fontWeight: 400,
  },
  description: { marginTop: 8 },
});

const Projects = ({ projects }: CVFormProjectsData) => (
  <View>
    {projects &&
      projects.length > 0 &&
      projects.map((proj, idx) => (
        <View key={`${idx} - ${proj.title}`} style={style.maincontainer}>
          <View style={style.topContainer}>
            <View style={style.titleRolContainer}>
              <Text style={style.title}>{proj.title}</Text>
              <Text style={style.position}>{proj.role}</Text>
            </View>
            <Text style={style.tenureship}>{proj.date}</Text>
          </View>
          <Text style={style.description}>{proj.projectDetails}</Text>
        </View>
      ))}
  </View>
);

export default Projects;
