import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // ======= General Styles =======
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Soft white background for a clean UI
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#4C1D95', // Deep purple
  },
  classTitle: {
    fontSize: 22,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#A855F7', // Soft purple
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },

  // ======= Header Styles =======
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4C1D95', // Deep purple accent
  },
  companyName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4C1D95', // Deep purple
  },
  welcome: {
    fontSize: 18,
    color: '#1E293B', // Dark blue-gray
  },

  // ======= Buttons =======
  primaryButton: {
    backgroundColor: '#9333EA', // Vibrant purple
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  settingsButton: {
    backgroundColor: '#A855F7', // Soft purple
    padding: 12,
    borderRadius: 8,
  },
  homeButton: {
    backgroundColor: '#4C1D95', // Deep purple
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#9333EA', // Vibrant purple
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
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
    color: '#4C1D95',
  },
  classButton: {
    backgroundColor: '#FFFFFF', // White card for clean design
    padding: 16,
    marginTop: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9333EA', // Soft purple border
  },
  classButtonText: {
    fontSize: 18,
    color: '#4C1D95',
    fontWeight: '600',
  },
  studentList: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E5E7EB', // Light gray for contrast
    borderRadius: 8,
  },
  studentItem: {
    fontSize: 16,
    paddingVertical: 5,
    color: '#1E293B', // Dark blue-gray
  },

  // ======= Add Class Form =======
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // Subtle gray border
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addClassButton: {
    backgroundColor: '#A855F7', // Soft purple
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  addClassText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    width: 60,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 18,
    borderColor: '#9333EA', // Soft purple border
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
  },
  colon: {
    fontSize: 18,
    marginHorizontal: 5,
    color: '#A855F7',
  },
  saveButton: {
    backgroundColor: '#9333EA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
  },

  // ======= Settings Styles =======
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#A855F7',
  },
  settingLabel: {
    fontSize: 18,
    color: '#1E293B',
  },
  deleteButton: {
    backgroundColor: '#F43F5E', // Red for emphasis
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  // ======= Modal Styles =======
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 320,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4C1D95',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E293B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#9333EA',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#F43F5E',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },

  // ======= Role Selection Styles =======
  roleSelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  roleButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 5,
  },
  selectedRole: {
    backgroundColor: '#9333EA',
    color: '#fff',
  },
  linkText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4C1D95',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },

  joinClassContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 10,
  },
  
  joinClassButton: {
    backgroundColor: '#3B82F6', // Sky blue
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default styles;
