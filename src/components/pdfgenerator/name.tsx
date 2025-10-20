import { View, Text, StyleSheet, Link } from '@react-pdf/renderer';

const style = StyleSheet.create({
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  role: {
    fontWeight: '500',
    marginTop: 10,
  },
  addDetails: {
    marginTop: 10,
  },
});

const Name = ({ formData }: CVFormData) => {
  return (
    <View>
      <Text style={style.name}>{formData?.fullName}</Text>
      <Text style={style.role}>{formData?.position}</Text>
      <View>
        <Text style={style.addDetails}>
          <Link href={`mailto:${formData?.email}`}>{formData?.email}</Link>
        </Text>
        <Text style={style.addDetails}>{formData?.phone}</Text>
        <Text style={style.addDetails}>
          <Link href={formData?.linkedIn}>{formData?.linkedIn}</Link>
        </Text>
      </View>
    </View>
  );
};

export default Name;
