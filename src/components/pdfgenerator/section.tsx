import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface PropsType {
  children: React.ReactNode;
  title?: string;
  hr?: boolean;
  wrap?: boolean;
  breakLine?: boolean;
  fixedPage?: boolean;
}

const style = StyleSheet.create({
  hr: {
    paddingTop: 16,
    borderTop: '1px solid #ccc',
    opacity: 0.4,
  },
  section: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

const Section = ({ children, title, hr, wrap, breakLine, fixedPage }: PropsType) => {
  return (
    <View style={style.section} wrap={wrap} break={breakLine} fixed={fixedPage}>
      {!!hr && (
        <View>
          <View style={style.hr} />
        </View>
      )}
      {!!title && <Text style={style.title}>{title}</Text>}
      <View>{children}</View>
    </View>
  );
};

export default Section;
