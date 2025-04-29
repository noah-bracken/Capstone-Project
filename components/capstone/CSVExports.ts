import { Platform } from "react-native";
import JSZip from 'jszip';

const API_URL = 'https://capstone-db-lb2e.onrender.com';

const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  }
};

type AttendanceEntry = {
    attendance_id: number;
    student_id: number;
    first_name: string;
    last_name: string;
    status: 'present' | 'late' | 'absent';
    timestamp?: string;
    };
const sanitizeFileName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9_\-]/g, '_');
};  

type SessionInfo = {
    qr_id: number;
    generated_at: string;
    class_id: string;
    class_name: string;
  };

type ExtendedSessionInfo = SessionInfo & { generated_local: Date };

const generateAttendanceSummary = (attendanceList: AttendanceEntry[]) => {
const total = attendanceList.length;
const present = attendanceList.filter(a => a.status === 'present').length;
const late = attendanceList.filter(a => a.status === 'late').length;
const absent = attendanceList.filter(a => a.status === 'absent').length;

return {
    totalStudents: total,
    presentPercent: total ? Math.round((present / total) * 100) : 0,
    latePercent: total ? Math.round((late / total) * 100) : 0,
    absentPercent: total ? Math.round((absent / total) * 100) : 0,
};
};  

export const exportAttendanceToCSV = (attendance: AttendanceEntry[], sessionClassName: string, sessionDate: string) => {
    if (!attendance.length) {
        showAlert('Error', 'No attendance data to export.');
        return;
    }

    const summary = generateAttendanceSummary(attendance);
    const headers = ['First Name', 'Last Name', 'Status'];
    const rows = attendance.map((a) => [a.first_name, a.last_name, a.status]);

    let csvContent = 'data:text/csv;charset=utf-8,';

    csvContent += `Attendance Summary:\n`;
    csvContent += `Total Students: ${summary.totalStudents}\n`;
    csvContent += `Present: ${summary.presentPercent}%, Late: ${summary.latePercent}%, Absent: ${summary.absentPercent}%\n`;
    csvContent += `---------------------------------------------\n\n`;

    csvContent += headers.join(',') + '\n';
    csvContent += rows.map((row) => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const classNameSafe = sanitizeFileName(sessionClassName);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${classNameSafe}_attendance_${sessionDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};  

export const exportAllSessionsToCSV = async (allSessions: ExtendedSessionInfo[], token: string, className: string) => {
    if (!allSessions.length) {
        showAlert('Error', 'No session data to export.');
        return;
    }

    if (Platform.OS !== 'web') {
        showAlert('Error', 'Export is currently only supported on web browsers.');
        return;
    }

    try {
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += ['Class Name', 'Date', 'Time', 'First Name', 'Last Name', 'Status'].join(',') + '\n';

        for (const session of allSessions) {
        const res = await fetch(`${API_URL}/sessions/${session.qr_id}/attendance`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            console.error('Failed to fetch attendance for session:', session.qr_id);
            continue;
        }

        const sessionAttendance = await res.json();
        const dateFormatted = new Date(session.generated_local).toLocaleDateString();
        const timeFormatted = new Date(session.generated_local).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        const summary = generateAttendanceSummary(sessionAttendance);

        csvContent += `Attendance Summary for ${session.class_name} on ${dateFormatted}:\n`;
        csvContent += `Total Students: ${summary.totalStudents}\n`;
        csvContent += `Present: ${summary.presentPercent}%, Late: ${summary.latePercent}%, Absent: ${summary.absentPercent}%\n`;
        csvContent += `---------------------------------------------\n\n`;

        csvContent += ['Class Name', 'Date', 'Time', 'First Name', 'Last Name', 'Status'].join(',') + '\n';

        for (const record of sessionAttendance) {
            csvContent += [
            session.class_name,
            dateFormatted,
            timeFormatted,
            record.first_name,
            record.last_name,
            record.status,
            ].join(',') + '\n';
        }
        csvContent += '\n';
        }

        const encodedUri = encodeURI(csvContent);
        const classNameSafe = sanitizeFileName(className);

        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${classNameSafe}_attendance.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error('Error exporting sessions:', err);
        showAlert('Error', 'An error occurred while exporting.');
    }
};
  
export const exportAllClassesAndSessions = async (teacherClasses: { class_id: string; class_name: string }[], token: string) => {
    if (!teacherClasses.length) {
        showAlert('Error', 'No class data to export.');
        return;
    }
  
    if (Platform.OS !== 'web') {
        showAlert('Error', 'Export is currently only supported on web browsers.');
        return;
    }
  
    const confirmExport = window.confirm('You are about to export all classes and sessions. This might generate a large file. Continue?');
  
    if (!confirmExport) return;
  
    try {
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += ['Class Name', 'Date', 'Time', 'First Name', 'Last Name', 'Status'].join(',') + '\n\n';

        for (const cls of teacherClasses) {
        csvContent += `Class: ${cls.class_name}\n`;

        const resSessions = await fetch(`${API_URL}/classes/${cls.class_id}/sessions`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!resSessions.ok) {
            console.error('Failed to fetch sessions for class:', cls.class_id);
            continue;
        }

        const sessions = await resSessions.json();

        for (const session of sessions) {
            const resAttendance = await fetch(`${API_URL}/sessions/${session.qr_id}/attendance`, {
            headers: { Authorization: `Bearer ${token}` },
            });

            if (!resAttendance.ok) {
            console.error('Failed to fetch attendance for session:', session.qr_id);
            continue;
            }

            const sessionAttendance = await resAttendance.json();
            const dateFormatted = new Date(new Date(session.generated_at).getTime() + 4 * 60 * 60 * 1000).toLocaleDateString();
            const timeFormatted = new Date(new Date(session.generated_at).getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            });

            const summary = generateAttendanceSummary(sessionAttendance);

            csvContent += `Attendance Summary for ${cls.class_name} on ${dateFormatted}:\n`;
            csvContent += `Total Students: ${summary.totalStudents}\n`;
            csvContent += `Present: ${summary.presentPercent}%, Late: ${summary.latePercent}%, Absent: ${summary.absentPercent}%\n`;
            csvContent += `---------------------------------------------\n\n`;

            csvContent += ['Class Name', 'Date', 'Time', 'First Name', 'Last Name', 'Status'].join(',') + '\n';

            for (const record of sessionAttendance) {
            csvContent += [
                cls.class_name,
                dateFormatted,
                timeFormatted,
                record.first_name,
                record.last_name,
                record.status,
            ].join(',') + '\n';
            }
            csvContent += '\n';
        }
        csvContent += '\n\n\n';
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `all_classes_attendance_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting all classes and sessions:', err);
      showAlert('Error', 'An error occurred while exporting.');
    }
};

export const exportAllSessionsToZip = async (allSessions: ExtendedSessionInfo[], token: string) => {
    if (!allSessions.length) {
      showAlert('Error', 'No session data to export.');
      return;
    }
  
    if (Platform.OS !== 'web') {
      showAlert('Error', 'Export is currently only supported on web browsers.');
      return;
    }
  
    try {
      const zip = new JSZip();
  
      for (const session of allSessions) {
        const res = await fetch(`${API_URL}/sessions/${session.qr_id}/attendance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!res.ok) {
          console.error('Failed to fetch attendance for session:', session.qr_id);
          continue;
        }
  
        const sessionAttendance = await res.json();
        const summary = generateAttendanceSummary(sessionAttendance);
  
        const dateFormatted = new Date(session.generated_local).toLocaleDateString();
        const timeFormatted = new Date(session.generated_local).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
  
        let csvContent = '';
  
        csvContent += `Attendance Summary for ${session.class_name} on ${dateFormatted}:\n`;
        csvContent += `Total Students: ${summary.totalStudents}\n`;
        csvContent += `Present: ${summary.presentPercent}%, Late: ${summary.latePercent}%, Absent: ${summary.absentPercent}%\n`;
        csvContent += `---------------------------------------------\n\n`;
  
        csvContent += ['Class Name', 'Date', 'Time', 'First Name', 'Last Name', 'Status'].join(',') + '\n';
  
        for (const record of sessionAttendance) {
          csvContent += [
            session.class_name,
            dateFormatted,
            timeFormatted,
            record.first_name,
            record.last_name,
            record.status,
          ].join(',') + '\n';
        }
  
        // Sanitize file name
        const classNameSafe = sanitizeFileName(session.class_name);
        const fileName = `${classNameSafe}_${dateFormatted.replace(/\//g, '-')}.csv`;
  
        // Add file to zip
        zip.file(fileName, csvContent);
      }
  
      const zipBlob = await zip.generateAsync({ type: 'blob' });
  
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance_sessions_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting sessions to ZIP:', err);
      showAlert('Error', 'An error occurred while exporting to ZIP.');
    }
};
  
  
