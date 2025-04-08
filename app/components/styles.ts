import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // ======= General Styles =======
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  classTitle: {
    fontSize: 22,
    marginTop: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },

  // ======= Header Styles =======
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: 18,
  },

  // ======= Buttons =======
  settingsButton: {
    backgroundColor: '#28a745',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  settingsIcon: {
    fontSize: 20,
  },
  homeButton: {
    backgroundColor: '#ff5733',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  toggleButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
  },

  // ======= Class List Styles =======
  classes: {
    marginTop: 20,
  },
  classesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  classButton: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  classButtonText: {
    fontSize: 18,
  },
  studentList: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  studentItem: {
    fontSize: 16,
    paddingVertical: 2,
  },

  // ======= Add Class Form =======
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addClassButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
  },
  addClassText: {
    fontSize: 20,
    color: '#fff',
  },

  // ======= Meeting Time Picker =======
  section: {
    marginVertical: 15,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeInput: {
    width: 50,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 18,
  },
  colon: {
    fontSize: 18,
    marginHorizontal: 5,
  },
  picker: {
    width: 150,
    marginRight: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },

  // ======= Class Color Picker =======
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },

  // ======= Settings Styles =======
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingLabel: {
    fontSize: 18,
  },

  // ======= Attendance Styles =======
  attendanceItem: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default styles;
