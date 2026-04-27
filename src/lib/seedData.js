import { appClient } from "@/api/appClient";

const EMPLOYEES = [
  { full_name: "Popescu Ion", email: "popescu.ion@alextours.ro", role: "tour_guide", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1990-04-20" },
  { full_name: "Ionescu Maria", email: "ionescu.maria@alextours.ro", role: "booking_agent", department: "Sales", status: "active", current_status: "acasa", gender: "f", birth_date: "1995-04-08" },
  { full_name: "Constantin Ana", email: "constantin.ana@alextours.ro", role: "marketing", department: "Marketing", status: "active", current_status: "acasa", gender: "f", birth_date: "1993-06-15" },
  { full_name: "Gheorghe Mihai", email: "gheorghe.mihai@alextours.ro", role: "customer_support", department: "Customer Service", status: "active", current_status: "acasa", gender: "m", birth_date: "1988-03-22" },
  { full_name: "Stanescu Elena", email: "stanescu.elena@alextours.ro", role: "finance", department: "Finance", status: "active", current_status: "acasa", gender: "f", birth_date: "1992-07-10" },
  { full_name: "Dumitrescu Andrei", email: "dumitrescu.andrei@alextours.ro", role: "tour_guide", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1991-05-03" },
  { full_name: "Popa Cristina", email: "popa.cristina@alextours.ro", role: "booking_agent", department: "Sales", status: "active", current_status: "acasa", gender: "f", birth_date: "1994-08-18" },
  { full_name: "Marin Alexandru", email: "marin.alexandru@alextours.ro", role: "operations", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1987-02-14" },
  { full_name: "Nistor Laura", email: "nistor.laura@alextours.ro", role: "marketing", department: "Marketing", status: "active", current_status: "acasa", gender: "f", birth_date: "1996-09-27" },
  { full_name: "Florea Bogdan", email: "florea.bogdan@alextours.ro", role: "customer_support", department: "Customer Service", status: "active", current_status: "acasa", gender: "m", birth_date: "1989-11-05" },
  { full_name: "Rusu Ioana", email: "rusu.ioana@alextours.ro", role: "finance", department: "Finance", status: "active", current_status: "acasa", gender: "f", birth_date: "1993-12-30" },
  { full_name: "Vlad Radu", email: "vlad.radu@alextours.ro", role: "tour_guide", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1992-04-15" },
  { full_name: "Serban Andreea", email: "serban.andreea@alextours.ro", role: "booking_agent", department: "Sales", status: "active", current_status: "acasa", gender: "f", birth_date: "1997-04-28" },
  { full_name: "Dinu Catalin", email: "dinu.catalin@alextours.ro", role: "marketing", department: "Marketing", status: "active", current_status: "acasa", gender: "m", birth_date: "1990-10-12" },
  { full_name: "Matei Raluca", email: "matei.raluca@alextours.ro", role: "customer_support", department: "Customer Service", status: "active", current_status: "acasa", gender: "f", birth_date: "1995-01-25" },
  { full_name: "Bucur Silviu", email: "bucur.silviu@alextours.ro", role: "operations", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1988-07-30" },
];

const SCHEDULE = [
  { email: "popescu.ion@alextours.ro", name: "Popescu Ion", ci: ["09:02","08:55","09:10","09:00","08:48","09:05","08:58","09:03","08:50","09:15","09:00","08:45","09:08","09:02","08:55","09:10","09:00","08:48","09:05","08:58","09:03","08:50"], bs: ["12:30","12:45","13:00","12:30","12:15","12:40","12:35","12:30","12:45","13:00","12:30","12:15","12:40","12:35","12:30","12:45","13:00","12:30","12:15","12:40","12:35","12:30"], be: ["13:00","13:15","13:30","13:00","12:45","13:10","13:05","13:00","13:15","13:30","13:00","12:45","13:10","13:05","13:00","13:15","13:30","13:00","12:45","13:10","13:05","13:00"], co: ["17:30","17:45","17:20","18:30","17:15","17:30","18:45","17:30","19:00","17:20","18:30","17:15","17:30","17:45","17:30","18:45","17:20","18:00","17:15","17:30","17:45","17:30"], loc: ["acasa","teren","acasa","sedinta","acasa","teren","acasa","acasa","teren","acasa","sedinta","acasa","teren","acasa","acasa","teren","acasa","sedinta","acasa","teren","acasa","acasa"], abs: [3,8,15] },
  { email: "ionescu.maria@alextours.ro", name: "Ionescu Maria", ci: ["08:45","08:50","09:00","08:40","08:55","09:05","08:45","08:50","09:00","08:40","08:55","09:05","08:45","08:50","09:00","08:40","08:55","09:05","08:45","08:50","09:00","08:40"], bs: ["12:00","12:30","12:15","12:00","12:30","12:45","12:00","12:30","12:15","12:00","12:30","12:45","12:00","12:30","12:15","12:00","12:30","12:45","12:00","12:30","12:15","12:00"], be: ["12:30","13:00","12:45","12:30","13:00","13:15","12:30","13:00","12:45","12:30","13:00","13:15","12:30","13:00","12:45","12:30","13:00","13:15","12:30","13:00","12:45","12:30"], co: ["17:00","18:30","17:15","17:00","17:30","18:45","17:00","17:30","17:15","17:00","18:30","17:45","17:00","17:30","17:15","17:00","17:30","17:45","17:00","17:30","17:15","17:00"], loc: ["acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa"], abs: [5,12] },
  { email: "constantin.ana@alextours.ro", name: "Constantin Ana", ci: ["09:15","09:00","09:20","09:10","09:05","09:15","09:00","09:20","09:10","09:05","09:15","09:00","09:20","09:10","09:05","09:15","09:00","09:20","09:10","09:05","09:15","09:00"], bs: ["13:00","12:30","13:15","13:00","12:30","13:00","12:30","13:15","13:00","12:30","13:00","12:30","13:15","13:00","12:30","13:00","12:30","13:15","13:00","12:30","13:00","12:30"], be: ["13:30","13:00","13:45","13:30","13:00","13:30","13:00","13:45","13:30","13:00","13:30","13:00","13:45","13:30","13:00","13:30","13:00","13:45","13:30","13:00","13:30","13:00"], co: ["17:45","17:30","18:00","17:45","19:00","17:45","17:30","18:00","17:45","17:30","17:45","17:30","18:00","17:45","17:30","17:45","18:30","18:00","17:45","17:30","17:45","17:30"], loc: ["acasa","teren","acasa","teren","acasa","acasa","teren","acasa","teren","acasa","acasa","teren","acasa","teren","acasa","acasa","teren","acasa","teren","acasa","acasa","teren"], abs: [7,14,21] },
  { email: "gheorghe.mihai@alextours.ro", name: "Gheorghe Mihai", ci: ["09:00","09:30","09:00","09:05","09:00","08:55","09:00","09:30","09:00","09:05","09:00","08:55","09:00","09:30","09:00","09:05","09:00","08:55","09:00","09:30","09:00","09:05"], bs: ["12:30","13:00","12:30","12:00","12:30","12:30","12:30","13:00","12:30","12:00","12:30","12:30","12:30","13:00","12:30","12:00","12:30","12:30","12:30","13:00","12:30","12:00"], be: ["13:00","13:30","13:00","12:30","13:00","13:00","13:00","13:30","13:00","12:30","13:00","13:00","13:00","13:30","13:00","12:30","13:00","13:00","13:00","13:30","13:00","12:30"], co: ["17:30","18:00","17:30","17:00","18:30","17:30","17:30","18:00","17:30","17:00","17:30","17:30","17:30","19:00","17:30","17:00","17:30","17:30","17:30","18:00","17:30","17:00"], loc: ["acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa"], abs: [10,17] },
  { email: "stanescu.elena@alextours.ro", name: "Stanescu Elena", ci: ["08:30","08:45","08:30","08:40","08:30","08:45","08:30","08:45","08:30","08:40","08:30","08:45","08:30","08:45","08:30","08:40","08:30","08:45","08:30","08:45","08:30","08:40"], bs: ["12:00","12:15","12:00","12:00","12:00","12:15","12:00","12:15","12:00","12:00","12:00","12:15","12:00","12:15","12:00","12:00","12:00","12:15","12:00","12:15","12:00","12:00"], be: ["12:30","12:45","12:30","12:30","12:30","12:45","12:30","12:45","12:30","12:30","12:30","12:45","12:30","12:45","12:30","12:30","12:30","12:45","12:30","12:45","12:30","12:30"], co: ["16:30","17:00","16:45","17:00","16:30","17:00","16:30","17:00","16:45","17:00","16:30","17:00","16:30","17:00","16:45","17:00","16:30","17:00","16:30","17:00","16:45","17:00"], loc: ["acasa","acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta"], abs: [2] },
  { email: "dumitrescu.andrei@alextours.ro", name: "Dumitrescu Andrei", ci: ["08:55","09:05","09:00","08:50","09:10","08:45","09:00","08:55","09:05","09:00","08:50","09:10","08:45","09:00","08:55","09:05","09:00","08:50","09:10","08:45","09:00","08:55"], bs: ["12:30","13:00","12:30","12:15","12:45","12:00","12:30","12:30","13:00","12:30","12:15","12:45","12:00","12:30","12:30","13:00","12:30","12:15","12:45","12:00","12:30","12:30"], be: ["13:00","13:30","13:00","12:45","13:15","12:30","13:00","13:00","13:30","13:00","12:45","13:15","12:30","13:00","13:00","13:30","13:00","12:45","13:15","12:30","13:00","13:00"], co: ["17:30","18:00","17:30","17:15","18:45","17:00","17:30","17:30","18:00","17:30","17:15","17:45","17:00","17:30","17:30","19:00","17:30","17:15","17:45","17:00","17:30","17:30"], loc: ["teren","acasa","teren","acasa","sedinta","acasa","teren","teren","acasa","teren","acasa","sedinta","acasa","teren","teren","acasa","teren","acasa","sedinta","acasa","teren","teren"], abs: [4,11,18] },
  { email: "popa.cristina@alextours.ro", name: "Popa Cristina", ci: ["08:50","09:00","08:45","09:10","08:55","09:00","08:50","09:00","08:45","09:10","08:55","09:00","08:50","09:00","08:45","09:10","08:55","09:00","08:50","09:00","08:45","09:10"], bs: ["12:15","12:30","12:00","12:45","12:30","12:15","12:15","12:30","12:00","12:45","12:30","12:15","12:15","12:30","12:00","12:45","12:30","12:15","12:15","12:30","12:00","12:45"], be: ["12:45","13:00","12:30","13:15","13:00","12:45","12:45","13:00","12:30","13:15","13:00","12:45","12:45","13:00","12:30","13:15","13:00","12:45","12:45","13:00","12:30","13:15"], co: ["17:15","17:30","17:00","18:45","17:30","17:15","17:15","18:30","17:00","17:45","17:30","17:15","17:15","17:30","17:00","17:45","18:30","17:15","17:15","17:30","17:00","17:45"], loc: ["acasa","acasa","acasa","teren","acasa","sedinta","acasa","acasa","acasa","teren","acasa","sedinta","acasa","acasa","acasa","teren","acasa","sedinta","acasa","acasa","acasa","teren"], abs: [6,13] },
  { email: "marin.alexandru@alextours.ro", name: "Marin Alexandru", ci: ["09:10","09:00","08:55","09:15","09:05","08:50","09:10","09:00","08:55","09:15","09:05","08:50","09:10","09:00","08:55","09:15","09:05","08:50","09:10","09:00","08:55","09:15"], bs: ["12:45","12:30","12:15","13:00","12:30","12:00","12:45","12:30","12:15","13:00","12:30","12:00","12:45","12:30","12:15","13:00","12:30","12:00","12:45","12:30","12:15","13:00"], be: ["13:15","13:00","12:45","13:30","13:00","12:30","13:15","13:00","12:45","13:30","13:00","12:30","13:15","13:00","12:45","13:30","13:00","12:30","13:15","13:00","12:45","13:30"], co: ["17:45","17:30","17:15","18:00","17:30","17:00","17:45","17:30","17:15","18:00","17:30","17:00","17:45","18:30","17:15","18:00","17:30","17:00","17:45","17:30","17:15","18:00"], loc: ["teren","acasa","acasa","teren","sedinta","acasa","teren","acasa","acasa","teren","sedinta","acasa","teren","acasa","acasa","teren","sedinta","acasa","teren","acasa","acasa","teren"], abs: [9,16] },
  { email: "nistor.laura@alextours.ro", name: "Nistor Laura", ci: ["08:40","08:55","09:05","08:45","09:00","08:50","08:40","08:55","09:05","08:45","09:00","08:50","08:40","08:55","09:05","08:45","09:00","08:50","08:40","08:55","09:05","08:45"], bs: ["12:10","12:25","12:35","12:15","12:30","12:20","12:10","12:25","12:35","12:15","12:30","12:20","12:10","12:25","12:35","12:15","12:30","12:20","12:10","12:25","12:35","12:15"], be: ["12:40","12:55","13:05","12:45","13:00","12:50","12:40","12:55","13:05","12:45","13:00","12:50","12:40","12:55","13:05","12:45","13:00","12:50","12:40","12:55","13:05","12:45"], co: ["17:10","17:25","18:35","17:15","17:30","17:20","17:10","17:25","17:35","17:15","18:30","17:20","17:10","17:25","17:35","17:15","17:30","17:20","17:10","17:25","17:35","17:15"], loc: ["acasa","acasa","acasa","acasa","teren","acasa","acasa","acasa","acasa","acasa","teren","acasa","acasa","acasa","acasa","acasa","teren","acasa","acasa","acasa","acasa","acasa"], abs: [1,19] },
  { email: "florea.bogdan@alextours.ro", name: "Florea Bogdan", ci: ["09:05","08:50","09:15","09:00","08:45","09:10","09:05","08:50","09:15","09:00","08:45","09:10","09:05","08:50","09:15","09:00","08:45","09:10","09:05","08:50","09:15","09:00"], bs: ["12:35","12:20","12:45","12:30","12:15","12:40","12:35","12:20","12:45","12:30","12:15","12:40","12:35","12:20","12:45","12:30","12:15","12:40","12:35","12:20","12:45","12:30"], be: ["13:05","12:50","13:15","13:00","12:45","13:10","13:05","12:50","13:15","13:00","12:45","13:10","13:05","12:50","13:15","13:00","12:45","13:10","13:05","12:50","13:15","13:00"], co: ["17:35","17:20","17:45","18:30","17:15","17:40","17:35","17:20","18:45","17:30","17:15","17:40","17:35","17:20","17:45","17:30","17:15","18:40","17:35","17:20","17:45","17:30"], loc: ["acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa"], abs: [20] },
  { email: "rusu.ioana@alextours.ro", name: "Rusu Ioana", ci: ["08:35","08:50","08:40","08:55","08:30","08:45","08:35","08:50","08:40","08:55","08:30","08:45","08:35","08:50","08:40","08:55","08:30","08:45","08:35","08:50","08:40","08:55"], bs: ["12:05","12:20","12:10","12:25","12:00","12:15","12:05","12:20","12:10","12:25","12:00","12:15","12:05","12:20","12:10","12:25","12:00","12:15","12:05","12:20","12:10","12:25"], be: ["12:35","12:50","12:40","12:55","12:30","12:45","12:35","12:50","12:40","12:55","12:30","12:45","12:35","12:50","12:40","12:55","12:30","12:45","12:35","12:50","12:40","12:55"], co: ["16:35","16:50","16:40","16:55","16:30","16:45","16:35","16:50","16:40","16:55","16:30","16:45","16:35","16:50","16:40","16:55","16:30","16:45","16:35","16:50","16:40","16:55"], loc: ["acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta","acasa"], abs: [] },
  { email: "vlad.radu@alextours.ro", name: "Vlad Radu", ci: ["08:52","09:08","09:00","08:45","09:12","08:58","09:03","08:50","09:07","08:55","09:01","08:48","09:06","08:53","09:09","08:47","09:02","08:56","09:04","08:51","09:10","08:46"], bs: ["12:22","12:38","12:30","12:15","12:42","12:28","12:33","12:20","12:37","12:25","12:31","12:18","12:36","12:23","12:39","12:17","12:32","12:26","12:34","12:21","12:40","12:16"], be: ["12:52","13:08","13:00","12:45","13:12","12:58","13:03","12:50","13:07","12:55","13:01","12:48","13:06","12:53","13:09","12:47","13:02","12:56","13:04","12:51","13:10","12:46"], co: ["17:22","18:38","17:30","17:15","19:00","17:28","18:33","17:20","17:37","17:25","18:31","17:18","17:36","17:23","18:39","17:17","17:32","18:26","17:34","17:21","17:40","17:16"], loc: ["acasa","teren","acasa","acasa","sedinta","acasa","teren","acasa","acasa","teren","acasa","sedinta","acasa","teren","acasa","acasa","teren","acasa","sedinta","acasa","teren","acasa"], abs: [7,14] },
  { email: "serban.andreea@alextours.ro", name: "Serban Andreea", ci: ["08:48","09:03","08:57","09:12","08:44","09:08","08:53","09:00","08:46","09:05","08:51","09:15","08:43","09:02","08:59","09:10","08:47","09:06","08:54","09:01","08:49","09:07"], bs: ["12:18","12:33","12:27","12:42","12:14","12:38","12:23","12:30","12:16","12:35","12:21","12:45","12:13","12:32","12:29","12:40","12:17","12:36","12:24","12:31","12:19","12:37"], be: ["12:48","13:03","12:57","13:12","12:44","13:08","12:53","13:00","12:46","13:05","12:51","13:15","12:43","13:02","12:59","13:10","12:47","13:06","12:54","13:01","12:49","13:07"], co: ["17:18","17:33","18:27","17:42","17:14","18:38","17:23","17:30","17:16","19:05","17:21","17:45","17:13","17:32","17:29","18:10","17:17","17:36","17:24","17:31","17:19","17:37"], loc: ["acasa","acasa","sedinta","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren"], abs: [5,11,18] },
  { email: "dinu.catalin@alextours.ro", name: "Dinu Catalin", ci: ["09:07","08:53","09:18","09:02","08:47","09:13","08:58","09:05","08:50","09:15","09:00","08:45","09:10","08:56","09:20","09:03","08:48","09:14","08:59","09:06","08:51","09:16"], bs: ["12:37","12:23","12:48","12:32","12:17","12:43","12:28","12:35","12:20","12:45","12:30","12:15","12:40","12:26","12:50","12:33","12:18","12:44","12:29","12:36","12:21","12:46"], be: ["13:07","12:53","13:18","13:02","12:47","13:13","12:58","13:05","12:50","13:15","13:00","12:45","13:10","12:56","13:20","13:03","12:48","13:14","12:59","13:06","12:51","13:16"], co: ["17:37","17:23","17:48","18:32","17:17","17:43","18:28","17:35","17:20","18:15","17:30","17:15","17:40","17:26","19:20","17:33","17:18","17:44","17:29","18:36","17:21","17:46"], loc: ["acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa"], abs: [3,10,17] },
  { email: "matei.raluca@alextours.ro", name: "Matei Raluca", ci: ["08:43","09:00","08:55","09:10","08:40","08:58","09:05","08:48","09:02","08:52","09:08","08:45","09:00","08:57","09:12","08:42","09:03","08:53","09:07","08:50","09:00","08:47"], bs: ["12:13","12:30","12:25","12:40","12:10","12:28","12:35","12:18","12:32","12:22","12:38","12:15","12:30","12:27","12:42","12:12","12:33","12:23","12:37","12:20","12:30","12:17"], be: ["12:43","13:00","12:55","13:10","12:40","12:58","13:05","12:48","13:02","12:52","13:08","12:45","13:00","12:57","13:12","12:42","13:03","12:53","13:07","12:50","13:00","12:47"], co: ["17:13","17:30","17:25","18:40","17:10","17:28","18:35","17:18","17:32","17:22","18:38","17:15","17:30","17:27","17:42","17:12","18:33","17:23","17:37","17:20","17:30","17:17"], loc: ["acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa"], abs: [8,15] },
  { email: "bucur.silviu@alextours.ro", name: "Bucur Silviu", ci: ["09:03","08:48","09:13","08:58","09:08","08:43","09:00","08:55","09:10","08:45","09:05","08:50","09:15","08:40","09:02","08:57","09:12","08:47","09:03","08:52","09:07","08:42"], bs: ["12:33","12:18","12:43","12:28","12:38","12:13","12:30","12:25","12:40","12:15","12:35","12:20","12:45","12:10","12:32","12:27","12:42","12:17","12:33","12:22","12:37","12:12"], be: ["13:03","12:48","13:13","12:58","13:08","12:43","13:00","12:55","13:10","12:45","13:05","12:50","13:15","12:40","13:02","12:57","13:12","12:47","13:03","12:52","13:07","12:42"], co: ["17:33","17:18","18:43","17:28","17:38","17:13","17:30","18:25","17:40","17:15","19:05","17:20","17:45","17:10","17:32","17:27","18:42","17:17","17:33","17:22","17:37","17:12"], loc: ["teren","acasa","acasa","teren","sedinta","acasa","teren","acasa","acasa","teren","sedinta","acasa","teren","acasa","acasa","teren","sedinta","acasa","teren","acasa","acasa","teren"], abs: [6,13,20] },
];

const generateMonthData = (year, month) => {
  const records = [];
  const events = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  let dayIdx = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    SCHEDULE.forEach(emp => {
      const isAbsent = emp.abs.includes(day);
      if (isAbsent) {
        records.push({ employee_email: emp.email, employee_name: emp.name, date: dateStr, check_in: null, status: "absent", work_location: "acasa" });
        return;
      }
      const idx = dayIdx % emp.ci.length;
      records.push({ employee_email: emp.email, employee_name: emp.name, date: dateStr, check_in: emp.ci[idx], status: "present", work_location: emp.loc[idx] });
      events.push({ employee_email: emp.email, employee_name: emp.name, date: dateStr, time: emp.ci[idx], event_type: "check_in" });
      events.push({ employee_email: emp.email, employee_name: emp.name, date: dateStr, time: emp.bs[idx], event_type: "break_start" });
      events.push({ employee_email: emp.email, employee_name: emp.name, date: dateStr, time: emp.be[idx], event_type: "break_end" });
      events.push({ employee_email: emp.email, employee_name: emp.name, date: dateStr, time: emp.co[idx], event_type: "check_out" });
    });
    dayIdx++;
  }
  return { records, events };
};

const generateMessages = (year, month) => {
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  return [
    { channel: "general", channel_type: "channel", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: "Bună dimineața echipei! 👋 Să avem o zi productivă!" },
    { channel: "general", channel_type: "channel", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Am finalizat pachetele pentru sezonul următor! Arată foarte bine 🎉" },
    { channel: "general", channel_type: "channel", sender_name: "Vlad Radu", sender_email: "vlad.radu@alextours.ro", content: "Salutare tuturor! Gata de treabă azi 💪" },
    { channel: "general", channel_type: "channel", sender_name: "Serban Andreea", sender_email: "serban.andreea@alextours.ro", content: "Am actualizat ofertele pentru vara aceasta, vă rog verificați!" },
    { channel: "tours", channel_type: "channel", sender_name: "Dumitrescu Andrei", sender_email: "dumitrescu.andrei@alextours.ro", content: "Avem 5 rezervări noi luna aceasta! Merge treaba 🔥" },
    { channel: "tours", channel_type: "channel", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Turul Grecia din weekend a fost un succes total, clienții sunt încântați!" },
    { channel: "tours", channel_type: "channel", sender_name: "Vlad Radu", sender_email: "vlad.radu@alextours.ro", content: "Pregătesc itinerariul pentru turul Turcia din luna viitoare" },
    { channel: "bookings", channel_type: "channel", sender_name: "Popa Cristina", sender_email: "popa.cristina@alextours.ro", content: "Client nou - pachet all-inclusive confirmat! 🎊" },
    { channel: "bookings", channel_type: "channel", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: "Am primit 3 cereri de ofertă pentru grupuri corporate" },
    { channel: "bookings", channel_type: "channel", sender_name: "Serban Andreea", sender_email: "serban.andreea@alextours.ro", content: "Confirmăm rezervarea pentru familia Popescu - Italia 2 săptămâni" },
    { channel: "marketing", channel_type: "channel", sender_name: "Nistor Laura", sender_email: "nistor.laura@alextours.ro", content: `Campania lunii ${monthStr} a generat 200 lead-uri noi! 🚀` },
    { channel: "marketing", channel_type: "channel", sender_name: "Constantin Ana", sender_email: "constantin.ana@alextours.ro", content: "Postarea despre Maldive a primit 500 de likes pe Instagram!" },
    { channel: "marketing", channel_type: "channel", sender_name: "Dinu Catalin", sender_email: "dinu.catalin@alextours.ro", content: "Am pregătit materialele pentru campania de toamnă, când le lansăm?" },
    { channel: "marketing", channel_type: "channel", sender_name: "Nistor Laura", sender_email: "nistor.laura@alextours.ro", content: "Newsletter-ul lunii a fost trimis la 2500 de abonați, rata de deschidere 35%!" },
    { channel: "general", channel_type: "channel", sender_name: "Rusu Ioana", sender_email: "rusu.ioana@alextours.ro", content: "Raportul financiar este gata și arată foarte bine! 📊" },
    { channel: "general", channel_type: "channel", sender_name: "Florea Bogdan", sender_email: "florea.bogdan@alextours.ro", content: "Cineva vrea cafea virtuală? ☕😄" },
    { channel: "general", channel_type: "channel", sender_name: "Marin Alexandru", sender_email: "marin.alexandru@alextours.ro", content: "Operațiunile pentru luna viitoare sunt planificate și confirmate!" },
    { channel: "general", channel_type: "channel", sender_name: "Matei Raluca", sender_email: "matei.raluca@alextours.ro", content: "Am rezolvat toate ticketele de suport din această săptămână ✅" },
    { channel: "general", channel_type: "channel", sender_name: "Bucur Silviu", sender_email: "bucur.silviu@alextours.ro", content: "Logistica pentru turul următor este confirmată, totul e în ordine!" },
    { channel: "random", channel_type: "channel", sender_name: "Florea Bogdan", sender_email: "florea.bogdan@alextours.ro", content: "Cineva știe un restaurant bun de recomandat clienților în București?" },
    { channel: "random", channel_type: "channel", sender_name: "Popa Cristina", sender_email: "popa.cristina@alextours.ro", content: "Eu recomand Lacrimi și Sfinți, atmosferă fantastică! 🍽️" },
    { channel: "random", channel_type: "channel", sender_name: "Gheorghe Mihai", sender_email: "gheorghe.mihai@alextours.ro", content: "Weekend-ul trecut am fost în Sinaia, recomand cu căldură pentru clienți!" },
    { channel: "general", channel_type: "channel", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: `Felicitări echipei pentru rezultatele din ${monthStr}! Suntem pe drumul cel bun 🏆` },
  ];
};

const generateTasks = (year, month) => {
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  const destinations = ["Grecia", "Turcia", "Italia", "Spania", "Egipt", "Dubai"];
  const dest = destinations[month % destinations.length];
  const isDone = month < new Date().getMonth() + 1;
  return [
    { title: `Ofertă ${dest} ${year}`, description: `Pachet turistic ${dest} - prețuri și itinerar`, priority: "high", status: isDone ? "done" : "in_progress", assigned_to_name: "Ionescu Maria", assigned_to_email: "ionescu.maria@alextours.ro", due_date: `${monthStr}-10`, created_by_name: "Alina" },
    { title: `Campanie social media ${dest}`, description: `Postări și stories pentru destinația ${dest}`, priority: "medium", status: isDone ? "done" : "in_progress", assigned_to_name: "Nistor Laura", assigned_to_email: "nistor.laura@alextours.ro", due_date: `${monthStr}-15`, created_by_name: "Alina" },
    { title: `Raport lunar ${monthStr}`, description: "Compilare date financiare și operaționale", priority: "high", status: isDone ? "done" : "todo", assigned_to_name: "Rusu Ioana", assigned_to_email: "rusu.ioana@alextours.ro", due_date: `${monthStr}-25`, created_by_name: "Alina" },
    { title: `Negociere furnizori ${dest}`, description: "Contracte hoteluri și transportatori", priority: "medium", status: isDone ? "done" : "todo", assigned_to_name: "Popescu Ion", assigned_to_email: "popescu.ion@alextours.ro", due_date: `${monthStr}-20`, created_by_name: "Alina" },
    { title: "Training echipă nouă", description: "Sesiune onboarding angajați noi", priority: "low", status: isDone ? "done" : "todo", assigned_to_name: "Florea Bogdan", assigned_to_email: "florea.bogdan@alextours.ro", due_date: `${monthStr}-28`, created_by_name: "Alina" },
    { title: `Rezervări ${dest} confirmate`, description: "Confirmare și procesare rezervări clienți", priority: "high", status: isDone ? "done" : "in_progress", assigned_to_name: "Popa Cristina", assigned_to_email: "popa.cristina@alextours.ro", due_date: `${monthStr}-12`, created_by_name: "Alina" },
    { title: "Actualizare site web", description: "Adăugare destinații și prețuri noi", priority: "medium", status: isDone ? "done" : "todo", assigned_to_name: "Constantin Ana", assigned_to_email: "constantin.ana@alextours.ro", due_date: `${monthStr}-18`, created_by_name: "Alina" },
    { title: `Pregătire tur ${dest}`, description: "Logistică și documente pentru tur", priority: "high", status: isDone ? "done" : "in_progress", assigned_to_name: "Vlad Radu", assigned_to_email: "vlad.radu@alextours.ro", due_date: `${monthStr}-14`, created_by_name: "Alina" },
    { title: "Oferte corporate", description: "Pachete personalizate pentru companii", priority: "medium", status: isDone ? "done" : "todo", assigned_to_name: "Serban Andreea", assigned_to_email: "serban.andreea@alextours.ro", due_date: `${monthStr}-22`, created_by_name: "Alina" },
    { title: "Newsletter lunar", description: "Redactare și trimitere newsletter", priority: "low", status: isDone ? "done" : "in_progress", assigned_to_name: "Dinu Catalin", assigned_to_email: "dinu.catalin@alextours.ro", due_date: `${monthStr}-16`, created_by_name: "Alina" },
    { title: "Suport clienți reclamații", description: "Rezolvare reclamații și feedback", priority: "high", status: isDone ? "done" : "todo", assigned_to_name: "Matei Raluca", assigned_to_email: "matei.raluca@alextours.ro", due_date: `${monthStr}-08`, created_by_name: "Alina" },
    { title: "Logistică transport", description: "Coordonare transport aeroport și hotel", priority: "medium", status: isDone ? "done" : "in_progress", assigned_to_name: "Bucur Silviu", assigned_to_email: "bucur.silviu@alextours.ro", due_date: `${monthStr}-19`, created_by_name: "Alina" },
  ];
};

const CLIENTS = [
  { full_name: "Dumitru Vasile", email: "dumitru.vasile@gmail.com", phone: "0721345678", city: "București", status: "activ", last_tour: "Turcia 2025", tours_count: "5", notes: "Preferă hoteluri 5 stele" },
  { full_name: "Popa Andreea", email: "popa.andreea@gmail.com", phone: "0734567890", city: "Cluj-Napoca", status: "activ", last_tour: "Grecia 2025", tours_count: "7", notes: "Client fidel, reducere 10%" },
  { full_name: "Marin Cristian", email: "marin.cristian@yahoo.com", phone: "0756789012", city: "Timișoara", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de Maldive" },
  { full_name: "Nicolescu Ioana", email: "nicolescu.ioana@gmail.com", phone: "0712345678", city: "Iași", status: "activ", last_tour: "Egipt 2025", tours_count: "3", notes: "" },
  { full_name: "Florea Alexandru", email: "florea.alex@gmail.com", phone: "0745678901", city: "Constanța", status: "inactiv", last_tour: "Bulgaria 2024", tours_count: "1", notes: "Nu a mai răspuns la oferte" },
  { full_name: "Stan Mihaela", email: "stan.mihaela@gmail.com", phone: "0723456789", city: "Brașov", status: "activ", last_tour: "Italia 2025", tours_count: "4", notes: "Preferă city break-uri" },
  { full_name: "Radu George", email: "radu.george@yahoo.com", phone: "0767890123", city: "București", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de pachete familie" },
  { full_name: "Ionescu Roxana", email: "ionescu.roxana@gmail.com", phone: "0731234567", city: "Sibiu", status: "activ", last_tour: "Spania 2025", tours_count: "6", notes: "Preferă vacanțe culturale" },
  { full_name: "Gheorghiu Dan", email: "gheorghiu.dan@yahoo.com", phone: "0742345678", city: "Galați", status: "activ", last_tour: "Dubai 2025", tours_count: "2", notes: "" },
  { full_name: "Marinescu Ana", email: "marinescu.ana@gmail.com", phone: "0753456789", city: "Ploiești", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de croaziere" },
  { full_name: "Constantin Victor", email: "constantin.victor@gmail.com", phone: "0764567890", city: "Craiova", status: "activ", last_tour: "Grecia 2026", tours_count: "4", notes: "Rezervă mereu cu familia" },
  { full_name: "Dumitrescu Alina", email: "dumitrescu.alina@gmail.com", phone: "0775678901", city: "Oradea", status: "inactiv", last_tour: "Turcia 2024", tours_count: "2", notes: "" },
  { full_name: "Popescu Catalin", email: "popescu.catalin@yahoo.com", phone: "0786789012", city: "Arad", status: "activ", last_tour: "Italia 2026", tours_count: "3", notes: "Preferă hoteluri boutique" },
  { full_name: "Niculae Maria", email: "niculae.maria@gmail.com", phone: "0797890123", city: "Pitești", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de Japonia" },
  { full_name: "Barbu Sorin", email: "barbu.sorin@gmail.com", phone: "0708901234", city: "Bacău", status: "activ", last_tour: "Egipt 2026", tours_count: "5", notes: "Client VIP" },
  { full_name: "Alexandrescu Mihai", email: "alexandrescu.mihai@gmail.com", phone: "0721456789", city: "București", status: "activ", last_tour: "Bali 2026", tours_count: "3", notes: "Preferă destinații exotice" },
  { full_name: "Tudor Elena", email: "tudor.elena@yahoo.com", phone: "0734678901", city: "Cluj-Napoca", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de luna de miere" },
  { full_name: "Neagu Florin", email: "neagu.florin@gmail.com", phone: "0756890123", city: "Timișoara", status: "activ", last_tour: "Portugalia 2026", tours_count: "2", notes: "" },
  { full_name: "Costea Diana", email: "costea.diana@gmail.com", phone: "0712567890", city: "Iași", status: "activ", last_tour: "Thailanda 2025", tours_count: "4", notes: "Rezervă mereu pentru 2 persoane" },
  { full_name: "Preda Vasile", email: "preda.vasile@yahoo.com", phone: "0745789012", city: "Constanța", status: "inactiv", last_tour: "Grecia 2024", tours_count: "1", notes: "Nemulțumit de ultimul tur" },
];

const CALENDAR_EVENTS = [
  { title: "Ședință săptămânală echipă", date: "2026-04-06", time: "10:00", duration: "60", description: "Revizuire obiective săptămânale", color: "teal", created_by_name: "Alina" },
  { title: "Prezentare oferte vara 2026", date: "2026-04-15", time: "14:00", duration: "90", description: "Pachete noi pentru clienți", color: "purple", created_by_name: "Alina" },
  { title: "Training sistem rezervări", date: "2026-04-22", time: "11:00", duration: "120", description: "Training angajați noi", color: "amber", created_by_name: "Alina" },
  { title: "Evaluare trimestrială Q1", date: "2026-04-28", time: "09:00", duration: "180", description: "Evaluare performanță trimestrul 1", color: "red", created_by_name: "Alina" },
  { title: "Întâlnire furnizori hoteluri", date: "2026-05-05", time: "09:00", duration: "60", description: "Negociere contracte vara 2026", color: "green", created_by_name: "Alina" },
  { title: "Ședință lunară mai", date: "2026-05-12", time: "10:00", duration: "60", description: "Raport mai și obiective iunie", color: "teal", created_by_name: "Alina" },
  { title: "Workshop marketing digital", date: "2026-05-20", time: "13:00", duration: "180", description: "Social media, SEO și campanii plătite", color: "purple", created_by_name: "Alina" },
  { title: "Lansare sezon vară", date: "2026-05-27", time: "15:00", duration: "90", description: "Lansare oficială pachete vara 2026", color: "amber", created_by_name: "Alina" },
  { title: "Ședință trimestrială Q2", date: "2026-06-03", time: "10:00", duration: "120", description: "Raport trimestrul 2", color: "teal", created_by_name: "Alina" },
  { title: "Lansare oferte toamnă", date: "2026-06-15", time: "14:00", duration: "90", description: "Prezentare destinații toamnă", color: "amber", created_by_name: "Alina" },
  { title: "Team building online", date: "2026-06-26", time: "16:00", duration: "120", description: "Activitate de echipă", color: "green", created_by_name: "Alina" },
  { title: "Ședință lunară iulie", date: "2026-07-07", time: "10:00", duration: "60", description: "Raport iulie", color: "teal", created_by_name: "Alina" },
  { title: "Evaluare performanță semestrială", date: "2026-07-20", time: "09:00", duration: "180", description: "Evaluare semestrială", color: "red", created_by_name: "Alina" },
  { title: "Planificare sezon toamnă", date: "2026-08-04", time: "10:00", duration: "90", description: "Strategie septembrie-noiembrie", color: "purple", created_by_name: "Alina" },
  { title: "Ședință finală august", date: "2026-08-18", time: "10:00", duration: "60", description: "Raport august", color: "teal", created_by_name: "Alina" },
];

const ROOMS = [
  { name: "Sala Principală", description: "Sala pentru ședințe de echipă", meeting_url: "https://meet.google.com/abc-defg-hij", topic: "Ședință săptămânală", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
  { name: "Sala Vânzări", description: "Prezentări și negocieri cu clienți", meeting_url: "https://meet.google.com/klm-nopq-rst", topic: "Prezentare oferte", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
  { name: "Sala Training", description: "Sesiuni de training și onboarding", meeting_url: "https://meet.google.com/uvw-xyz-123", topic: "Training angajați", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
  { name: "Sala Marketing", description: "Brainstorming și campanii", meeting_url: "https://meet.google.com/mkt-room-456", topic: "Strategie marketing", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
];

const MOOD_EMPLOYEES = [
  { email: "popescu.ion@alextours.ro", name: "Popescu Ion" },
  { email: "ionescu.maria@alextours.ro", name: "Ionescu Maria" },
  { email: "constantin.ana@alextours.ro", name: "Constantin Ana" },
  { email: "gheorghe.mihai@alextours.ro", name: "Gheorghe Mihai" },
  { email: "stanescu.elena@alextours.ro", name: "Stanescu Elena" },
  { email: "dumitrescu.andrei@alextours.ro", name: "Dumitrescu Andrei" },
  { email: "popa.cristina@alextours.ro", name: "Popa Cristina" },
  { email: "marin.alexandru@alextours.ro", name: "Marin Alexandru" },
  { email: "nistor.laura@alextours.ro", name: "Nistor Laura" },
  { email: "florea.bogdan@alextours.ro", name: "Florea Bogdan" },
  { email: "rusu.ioana@alextours.ro", name: "Rusu Ioana" },
  { email: "vlad.radu@alextours.ro", name: "Vlad Radu" },
  { email: "serban.andreea@alextours.ro", name: "Serban Andreea" },
  { email: "dinu.catalin@alextours.ro", name: "Dinu Catalin" },
  { email: "matei.raluca@alextours.ro", name: "Matei Raluca" },
  { email: "bucur.silviu@alextours.ro", name: "Bucur Silviu" },
];

const MOOD_DISTRIBUTION = {
  "2026-04-20": ["😊","😊","😊","😊","😐","😊","😐","😊","😊","😊","😐","😊","😊","😐","😊","😊"],
  "2026-04-27": ["😊","😊","😐","😊","😊","😔","😊","😊","😐","😊","😊","😊","😐","😊","😊","😊"],
  "2026-05-04": ["😊","😐","😊","😊","😊","😊","😐","😊","😊","😔","😊","😊","😊","😐","😊","😊"],
  "2026-05-11": ["😊","😊","😊","😐","😊","😊","😊","😔","😊","😊","😊","😐","😊","😊","😊","😊"],
  "2026-05-18": ["😐","😊","😊","😊","😔","😊","😊","😊","😐","😊","😊","😊","😊","😊","😐","😊"],
  "2026-05-25": ["😊","😊","😐","😊","😊","😊","😊","😊","😊","😐","😔","😊","😊","😊","😊","😊"],
};

export const seedDatabase = async () => {
  console.log("🌱 Începe popularea...");
  try {
    for (const emp of EMPLOYEES) await appClient.entities.Employee.create(emp);
    for (let month = 3; month <= 8; month++) {
      const { records, events } = generateMonthData(2026, month);
      for (const rec of records) await appClient.entities.Attendance.create(rec);
      for (const ev of events) await appClient.entities.AttendanceEvent.create(ev);
      const msgs = generateMessages(2026, month);
      for (const msg of msgs) await appClient.entities.Message.create(msg);
      const tasksList = generateTasks(2026, month);
      for (const task of tasksList) await appClient.entities.Task.create(task);
    }
    for (const client of CLIENTS) await appClient.entities.Client.create(client);
    for (const event of CALENDAR_EVENTS) await appClient.entities.CalendarEvent.create(event);
    for (const room of ROOMS) await appClient.entities.Room.create(room);
    console.log("✅ Gata!");
    return true;
  } catch (err) {
    console.error("❌ Eroare:", err);
    return false;
  }
};

export const seedMissing = async () => {
  console.log("🌱 Date lipsă...");
  try {
    for (const client of CLIENTS) await appClient.entities.Client.create(client);
    for (const event of CALENDAR_EVENTS) await appClient.entities.CalendarEvent.create(event);
    console.log("✅ Gata!");
    return true;
  } catch (err) {
    console.error("❌ Eroare:", err);
    return false;
  }
};

export const EMP_LIST = EMPLOYEES;

export const seedAttendance = async () => {
  for (let month = 3; month <= 8; month++) {
    const { records, events } = generateMonthData(2026, month);
    for (const rec of records) await appClient.entities.Attendance.create(rec);
    for (const ev of events) await appClient.entities.AttendanceEvent.create(ev);
  }
};

export const seedMessages = async () => {
  for (let month = 3; month <= 8; month++) {
    const msgs = generateMessages(2026, month);
    for (const msg of msgs) await appClient.entities.Message.create(msg);
  }
};

export const seedTasks = async () => {
  for (let month = 3; month <= 8; month++) {
    const tasksList = generateTasks(2026, month);
    for (const task of tasksList) await appClient.entities.Task.create(task);
  }
};

export const seedClients = async () => {
  for (const client of CLIENTS) await appClient.entities.Client.create(client);
};

export const seedCalendar = async () => {
  for (const event of CALENDAR_EVENTS) await appClient.entities.CalendarEvent.create(event);
};

export const seedRooms = async () => {
  for (const room of ROOMS) await appClient.entities.Room.create(room);
};

export const seedMoodVotes = async () => {
  const weekDates = Object.keys(MOOD_DISTRIBUTION);
  for (const weekDate of weekDates) {
    const date = new Date(weekDate);
    const year = date.getFullYear();
    const weekNum = Math.ceil(((date - new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);
    const weekStr = `${year}-W${String(weekNum).padStart(2, "0")}`;
    const weekMoods = MOOD_DISTRIBUTION[weekDate];
    for (let i = 0; i < MOOD_EMPLOYEES.length; i++) {
      await appClient.entities.MoodVote.create({
        employee_email: MOOD_EMPLOYEES[i].email,
        employee_name: MOOD_EMPLOYEES[i].name,
        mood: weekMoods[i],
        week: weekStr,
        date: weekDate,
      });
    }
  }
  console.log("✅ Mood votes adăugate!");
};