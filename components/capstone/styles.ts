import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';

const crossPlatformShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 3,
  },
  web: {
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#4C1D95',
  },
  classTitle: {
    fontSize: 22,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#A855F7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4C1D95',
  },
  companyName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4C1D95',
  },
  welcome: {
    fontSize: 18,
    color: '#1E293B',
  },
  primaryButton: {
    backgroundColor: '#9333EA',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    ...crossPlatformShadow,
    marginTop: 8,
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#A855F7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...crossPlatformShadow,
  },
  homeButton: {
    backgroundColor: '#4C1D95',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#9333EA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
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
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 3,
    ...crossPlatformShadow,
  },
  classButtonText: {
    fontSize: 18,
    color: '#4C1D95',
    fontWeight: '600',
    padding: 12,
  },
  studentList: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  studentItem: {
    fontSize: 16,
    paddingVertical: 5,
    color: '#1E293B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
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
    backgroundColor: '#A855F7',
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
    borderColor: '#9333EA',
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
    backgroundColor: '#F43F5E',
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
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
  modalcodeText: {
    fontSize: 16,
    textAlign: 'center',
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
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    ...crossPlatformShadow,
  },
  classCode: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E3A8A',
    marginVertical: 16,
    letterSpacing: 2,
  },
  classCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    gap: 16,
  },
  classCard: {
    width: 250,
    height: 250,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    ...crossPlatformShadow,
  },
  classCardHeader: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classCardTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  classCardBody: {
    flex: 1,
    padding: 10,
  },
  classCardDescription: {
    color: '#333',
    fontSize: 12,
    marginTop: 5,
  },
  text: {
    fontSize: 16,
    color: '#334155',
    padding: 8,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E0E7FF',
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
  },
  
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E3A8A',
  },
  
  attendanceButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  
  attendanceButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  teacherText: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  meetingTimesBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  
  meetingTimeText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  },
  attendanceSummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  
  attendanceBox: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  attendanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 4,
  },
  
  attendanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0C4A6E',
  },
  
});

export default styles;
