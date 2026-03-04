import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Productivity from './pages/Productivity';
import Tasks from './pages/Tasks';
import Chat from './pages/Chat';
import Rooms from './pages/Rooms';
import Files from './pages/Files';
import VirtualOffice from './pages/VirtualOffice';
import __Layout from './Layout.jsx';

export const PAGES = {
    "Dashboard": Dashboard,
    "Employees": Employees,
    "Productivity": Productivity,
    "Attendance": Attendance,
    "VirtualOffice": VirtualOffice,
    "Chat": Chat,
    "Rooms": Rooms,
    "Tasks": Tasks,
    "Files": Files,
}

export const pagesConfig = {
    mainPage: "VirtualOffice",
    Pages: PAGES,
    Layout: __Layout,
};