import { appClient } from "@/api/appClient";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const EMPLOYEES = [
  { full_name: "Popescu Ion", email: "popescu.ion@alextours.ro", role: "tour_guide", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1990-04-20" },
  { full_name: "Ionescu Maria", email: "ionescu.maria@alextours.ro", role: "booking_agent", department: "Sales", status: "active", current_status: "acasa", gender: "f", birth_date: "1995-05-08" },
  { full_name: "Constantin Ana", email: "constantin.ana@alextours.ro", role: "marketing", department: "Marketing", status: "active", current_status: "acasa", gender: "f", birth_date: "1993-06-15" },
  { full_name: "Gheorghe Mihai", email: "gheorghe.mihai@alextours.ro", role: "customer_support", department: "Customer Service", status: "active", current_status: "acasa", gender: "m", birth_date: "1988-05-22" },
  { full_name: "Stanescu Elena", email: "stanescu.elena@alextours.ro", role: "finance", department: "Finance", status: "active", current_status: "acasa", gender: "f", birth_date: "1992-07-10" },
  { full_name: "Dumitrescu Andrei", email: "dumitrescu.andrei@alextours.ro", role: "tour_guide", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1991-05-03" },
  { full_name: "Popa Cristina", email: "popa.cristina@alextours.ro", role: "booking_agent", department: "Sales", status: "active", current_status: "acasa", gender: "f", birth_date: "1994-06-18" },
  { full_name: "Marin Alexandru", email: "marin.alexandru@alextours.ro", role: "operations", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1987-02-14" },
  { full_name: "Nistor Laura", email: "nistor.laura@alextours.ro", role: "marketing", department: "Marketing", status: "active", current_status: "acasa", gender: "f", birth_date: "1996-09-27" },
  { full_name: "Florea Bogdan", email: "florea.bogdan@alextours.ro", role: "customer_support", department: "Customer Service", status: "active", current_status: "acasa", gender: "m", birth_date: "1989-11-05" },
  { full_name: "Rusu Ioana", email: "rusu.ioana@alextours.ro", role: "finance", department: "Finance", status: "active", current_status: "acasa", gender: "f", birth_date: "1993-12-30" },
  { full_name: "Vlad Radu", email: "vlad.radu@alextours.ro", role: "tour_guide", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1992-04-15" },
  { full_name: "Serban Andreea", email: "serban.andreea@alextours.ro", role: "booking_agent", department: "Sales", status: "active", current_status: "acasa", gender: "f", birth_date: "1997-04-28" },
  { full_name: "Dinu Catalin", email: "dinu.catalin@alextours.ro", role: "marketing", department: "Marketing", status: "active", current_status: "acasa", gender: "m", birth_date: "1990-10-12" },
  { full_name: "Matei Raluca", email: "matei.raluca@alextours.ro", role: "customer_support", department: "Customer Service", status: "active", current_status: "acasa", gender: "f", birth_date: "1995-01-25" },
  { full_name: "Bucur Silviu", email: "bucur.silviu@alextours.ro", role: "operations", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1988-06-30" },
];

const MAY_SCHEDULE = [
  {
    email: "popescu.ion@alextours.ro", name: "Popescu Ion",
    days: {
      "2026-06-01": { ci: "08:45", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-02": { ci: "09:00", bs: "12:45", be: "13:15", co: "18:45", loc: "teren" },
      "2026-06-03": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:20", loc: "acasa" },
      "2026-06-04": { ci: "09:05", bs: "13:00", be: "13:30", co: "17:45", loc: "sedinta" },
      "2026-06-05": { ci: "08:55", bs: "12:15", be: "12:45", co: "19:00", loc: "teren" },
      "2026-06-08": { absent: true },
      "2026-06-09": { ci: "09:10", bs: "12:30", be: "13:00", co: "18:30", loc: "teren" },
      "2026-06-10": { ci: "09:00", bs: "12:40", be: "13:10", co: "17:30", loc: "acasa" },
      "2026-06-11": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:15", loc: "acasa" },
      "2026-06-12": { ci: "09:02", bs: "12:45", be: "13:15", co: "17:45", loc: "sedinta" },
      "2026-06-15": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-16": { ci: "09:00", bs: "12:30", be: "13:00", co: "19:15", loc: "teren" },
      "2026-06-17": { absent: true },
      "2026-06-18": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:30", loc: "acasa" },
      "2026-06-19": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:45", loc: "teren" },
      "2026-06-22": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-23": { ci: "09:05", bs: "12:45", be: "13:15", co: "18:30", loc: "sedinta" },
      "2026-06-24": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:20", loc: "acasa" },
      "2026-06-25": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-26": { ci: "08:58", bs: "12:30", be: "13:00", co: "17:15", loc: "acasa" },
      "2026-06-29": { ci: "09:10", bs: "12:45", be: "13:15", co: "18:00", loc: "teren" },
      "2026-06-30": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
    }
  },
  {
    email: "ionescu.maria@alextours.ro", name: "Ionescu Maria",
    days: {
      "2026-06-01": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:45", loc: "acasa" },
      "2026-06-02": { ci: "09:15", bs: "12:45", be: "13:15", co: "18:00", loc: "sedinta" },
      "2026-06-03": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-04": { absent: true },
      "2026-06-05": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-08": { ci: "08:40", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-09": { ci: "09:00", bs: "12:30", be: "13:00", co: "19:30", loc: "teren" },
      "2026-06-10": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-11": { ci: "09:05", bs: "12:45", be: "13:15", co: "18:45", loc: "sedinta" },
      "2026-06-12": { ci: "08:40", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-15": { absent: true },
      "2026-06-16": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-17": { ci: "09:05", bs: "12:45", be: "13:15", co: "18:45", loc: "teren" },
      "2026-06-18": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-19": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:30", loc: "sedinta" },
      "2026-06-22": { ci: "09:00", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-23": { ci: "08:40", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-24": { ci: "08:55", bs: "12:30", be: "13:00", co: "18:30", loc: "teren" },
      "2026-06-25": { absent: true },
      "2026-06-26": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-29": { ci: "09:00", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-30": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:30", loc: "sedinta" },
    }
  },
  {
    email: "constantin.ana@alextours.ro", name: "Constantin Ana",
    days: {
      "2026-06-01": { ci: "09:20", bs: "13:15", be: "13:45", co: "18:15", loc: "acasa" },
      "2026-06-02": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-03": { ci: "09:15", bs: "13:00", be: "13:30", co: "17:45", loc: "acasa" },
      "2026-06-04": { ci: "09:10", bs: "13:00", be: "13:30", co: "17:45", loc: "sedinta" },
      "2026-06-05": { ci: "09:05", bs: "12:30", be: "13:00", co: "19:30", loc: "acasa" },
      "2026-06-08": { ci: "09:15", bs: "13:00", be: "13:30", co: "17:45", loc: "acasa" },
      "2026-06-09": { absent: true },
      "2026-06-10": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-11": { ci: "09:20", bs: "13:15", be: "13:45", co: "18:00", loc: "acasa" },
      "2026-06-12": { ci: "09:05", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-15": { ci: "09:15", bs: "13:00", be: "13:30", co: "18:30", loc: "acasa" },
      "2026-06-16": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "sedinta" },
      "2026-06-17": { ci: "09:20", bs: "13:15", be: "13:45", co: "18:00", loc: "teren" },
      "2026-06-18": { absent: true },
      "2026-06-19": { ci: "09:05", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-22": { ci: "09:15", bs: "13:00", be: "13:30", co: "17:45", loc: "teren" },
      "2026-06-23": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:30", loc: "acasa" },
      "2026-06-24": { ci: "09:10", bs: "13:00", be: "13:30", co: "17:45", loc: "sedinta" },
      "2026-06-25": { ci: "09:05", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-26": { absent: true },
      "2026-06-29": { ci: "09:15", bs: "13:00", be: "13:30", co: "17:45", loc: "teren" },
      "2026-06-30": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:00", loc: "acasa" },
    }
  },
  {
    email: "gheorghe.mihai@alextours.ro", name: "Gheorghe Mihai",
    days: {
      "2026-06-01": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-02": { ci: "09:30", bs: "13:00", be: "13:30", co: "18:00", loc: "sedinta" },
      "2026-06-03": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-04": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-05": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:30", loc: "teren" },
      "2026-06-08": { ci: "09:30", bs: "13:00", be: "13:30", co: "18:00", loc: "sedinta" },
      "2026-06-09": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-10": { absent: true },
      "2026-06-11": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-12": { ci: "08:55", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-15": { ci: "09:00", bs: "12:30", be: "13:00", co: "19:00", loc: "sedinta" },
      "2026-06-16": { ci: "09:30", bs: "13:00", be: "13:30", co: "18:00", loc: "teren" },
      "2026-06-17": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-18": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-19": { absent: true },
      "2026-06-22": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-23": { ci: "08:55", bs: "12:15", be: "12:45", co: "17:15", loc: "sedinta" },
      "2026-06-24": { ci: "09:30", bs: "13:00", be: "13:30", co: "18:30", loc: "teren" },
      "2026-06-25": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-26": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-29": { absent: true },
      "2026-06-30": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
    }
  },
  {
    email: "stanescu.elena@alextours.ro", name: "Stanescu Elena",
    days: {
      "2026-06-01": { ci: "08:20", bs: "12:00", be: "12:30", co: "16:20", loc: "acasa" },
      "2026-06-02": { ci: "08:35", bs: "12:05", be: "12:35", co: "16:50", loc: "acasa" },
      "2026-06-03": { ci: "08:25", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-06-04": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:00", loc: "sedinta" },
      "2026-06-05": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:45", loc: "acasa" },
      "2026-06-08": { ci: "08:20", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-06-09": { ci: "08:35", bs: "12:05", be: "12:35", co: "17:00", loc: "acasa" },
      "2026-06-10": { ci: "08:25", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-06-11": { absent: true },
      "2026-06-12": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:00", loc: "sedinta" },
      "2026-06-15": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:45", loc: "acasa" },
      "2026-06-16": { ci: "08:20", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-06-17": { ci: "08:35", bs: "12:05", be: "12:35", co: "17:00", loc: "acasa" },
      "2026-06-18": { ci: "08:25", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-06-19": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:00", loc: "sedinta" },
      "2026-06-22": { absent: true },
      "2026-06-23": { ci: "08:20", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-06-24": { ci: "08:35", bs: "12:05", be: "12:35", co: "16:50", loc: "acasa" },
      "2026-06-25": { ci: "08:25", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-06-26": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:00", loc: "sedinta" },
      "2026-06-29": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:45", loc: "acasa" },
      "2026-06-30": { ci: "08:20", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
    }
  },
  {
    email: "dumitrescu.andrei@alextours.ro", name: "Dumitrescu Andrei",
    days: {
      "2026-06-01": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-02": { ci: "09:05", bs: "13:00", be: "13:30", co: "18:00", loc: "acasa" },
      "2026-06-03": { absent: true },
      "2026-06-04": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-05": { ci: "09:10", bs: "12:45", be: "13:15", co: "19:30", loc: "sedinta" },
      "2026-06-08": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-09": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-10": { ci: "09:05", bs: "13:00", be: "13:30", co: "18:00", loc: "acasa" },
      "2026-06-11": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-12": { absent: true },
      "2026-06-15": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-16": { ci: "09:10", bs: "12:45", be: "13:15", co: "19:00", loc: "sedinta" },
      "2026-06-17": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-18": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-19": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-22": { ci: "09:05", bs: "13:00", be: "13:30", co: "18:30", loc: "acasa" },
      "2026-06-23": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-24": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-25": { absent: true },
      "2026-06-26": { ci: "09:10", bs: "12:45", be: "13:15", co: "17:45", loc: "sedinta" },
      "2026-06-29": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-06-30": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:00", loc: "acasa" },
    }
  },
  {
    email: "popa.cristina@alextours.ro", name: "Popa Cristina",
    days: {
      "2026-06-01": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-02": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-03": { ci: "09:10", bs: "12:45", be: "13:15", co: "18:45", loc: "teren" },
      "2026-06-04": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-05": { absent: true },
      "2026-06-08": { ci: "09:00", bs: "12:15", be: "12:45", co: "17:15", loc: "sedinta" },
      "2026-06-09": { ci: "08:50", bs: "12:30", be: "13:00", co: "18:30", loc: "acasa" },
      "2026-06-10": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:00", loc: "acasa" },
      "2026-06-11": { ci: "09:10", bs: "12:45", be: "13:15", co: "17:45", loc: "teren" },
      "2026-06-12": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-15": { ci: "09:00", bs: "12:15", be: "12:45", co: "18:30", loc: "sedinta" },
      "2026-06-16": { absent: true },
      "2026-06-17": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:15", loc: "acasa" },
      "2026-06-18": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:00", loc: "acasa" },
      "2026-06-19": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "teren" },
      "2026-06-22": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-23": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-24": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "teren" },
      "2026-06-25": { ci: "09:10", bs: "12:45", be: "13:15", co: "17:45", loc: "acasa" },
      "2026-06-26": { absent: true },
      "2026-06-29": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-30": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
    }
  },
  {
    email: "marin.alexandru@alextours.ro", name: "Marin Alexandru",
    days: {
      "2026-06-01": { ci: "09:10", bs: "12:45", be: "13:15", co: "17:45", loc: "teren" },
      "2026-06-02": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-03": { ci: "08:55", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-04": { ci: "09:15", bs: "13:00", be: "13:30", co: "18:00", loc: "teren" },
      "2026-06-05": { ci: "09:05", bs: "12:30", be: "13:00", co: "19:15", loc: "sedinta" },
      "2026-06-08": { ci: "08:50", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-09": { ci: "09:10", bs: "12:45", be: "13:15", co: "18:00", loc: "teren" },
      "2026-06-10": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-11": { ci: "08:55", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-12": { ci: "09:15", bs: "13:00", be: "13:30", co: "18:00", loc: "teren" },
      "2026-06-15": { absent: true },
      "2026-06-16": { ci: "08:50", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-17": { ci: "09:10", bs: "12:45", be: "13:15", co: "18:30", loc: "teren" },
      "2026-06-18": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-19": { ci: "08:55", bs: "12:15", be: "12:45", co: "17:15", loc: "sedinta" },
      "2026-06-22": { ci: "09:15", bs: "13:00", be: "13:30", co: "18:00", loc: "teren" },
      "2026-06-23": { ci: "09:05", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-24": { absent: true },
      "2026-06-25": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-26": { ci: "09:10", bs: "12:45", be: "13:15", co: "17:45", loc: "teren" },
      "2026-06-29": { ci: "08:50", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-06-30": { absent: true },
    }
  },
  {
    email: "nistor.laura@alextours.ro", name: "Nistor Laura",
    days: {
      "2026-06-01": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:10", loc: "acasa" },
      "2026-06-02": { ci: "08:55", bs: "12:25", be: "12:55", co: "17:25", loc: "acasa" },
      "2026-06-03": { ci: "09:05", bs: "12:35", be: "13:05", co: "18:35", loc: "teren" },
      "2026-06-04": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-05": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "sedinta" },
      "2026-06-08": { absent: true },
      "2026-06-09": { ci: "08:55", bs: "12:25", be: "12:55", co: "17:25", loc: "acasa" },
      "2026-06-10": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-06-11": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-12": { ci: "09:00", bs: "12:30", be: "13:00", co: "19:00", loc: "teren" },
      "2026-06-15": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:10", loc: "acasa" },
      "2026-06-16": { ci: "08:55", bs: "12:25", be: "12:55", co: "17:25", loc: "acasa" },
      "2026-06-17": { absent: true },
      "2026-06-18": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-19": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "sedinta" },
      "2026-06-22": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:10", loc: "acasa" },
      "2026-06-23": { ci: "08:55", bs: "12:25", be: "12:55", co: "17:25", loc: "acasa" },
      "2026-06-24": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "teren" },
      "2026-06-25": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-06-26": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:30", loc: "acasa" },
      "2026-06-29": { absent: true },
      "2026-06-30": { ci: "08:55", bs: "12:25", be: "12:55", co: "17:25", loc: "acasa" },
    }
  },
  {
    email: "florea.bogdan@alextours.ro", name: "Florea Bogdan",
    days: {
      "2026-06-01": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-06-02": { ci: "08:50", bs: "12:20", be: "12:50", co: "17:20", loc: "acasa" },
      "2026-06-03": { ci: "09:15", bs: "12:45", be: "13:15", co: "17:45", loc: "sedinta" },
      "2026-06-04": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:30", loc: "acasa" },
      "2026-06-05": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "teren" },
      "2026-06-08": { ci: "09:10", bs: "12:40", be: "13:10", co: "17:40", loc: "acasa" },
      "2026-06-09": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-06-10": { ci: "08:50", bs: "12:20", be: "12:50", co: "19:45", loc: "sedinta" },
      "2026-06-11": { ci: "09:15", bs: "12:45", be: "13:15", co: "17:45", loc: "acasa" },
      "2026-06-12": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-15": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "teren" },
      "2026-06-16": { ci: "09:10", bs: "12:40", be: "13:10", co: "17:40", loc: "acasa" },
      "2026-06-17": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-06-18": { absent: true },
      "2026-06-19": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-22": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "teren" },
      "2026-06-23": { ci: "09:10", bs: "12:40", be: "13:10", co: "18:40", loc: "sedinta" },
      "2026-06-24": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-06-25": { ci: "08:50", bs: "12:20", be: "12:50", co: "17:20", loc: "acasa" },
      "2026-06-26": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-06-29": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "teren" },
      "2026-06-30": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
    }
  },
];

const MAY_MESSAGES = [
  { channel: "general", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: "Bună dimineața echipei! ☀️ Iunie a sosit, sezon de vârf pentru turism!" },
  { channel: "general", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Salut! Am finalizat itinerariul pentru turul Dubrovnik din 15 iunie 🏰" },
  { channel: "general", sender_name: "Florea Bogdan", sender_email: "florea.bogdan@alextours.ro", content: "Cineva vrea cafea virtuală? ☕😄 Bună dimineața echipei!" },
  { channel: "general", sender_name: "Constantin Ana", sender_email: "constantin.ana@alextours.ro", content: "Campania de vară e live! Primele rezultate sunt foarte bune 🌞🚀" },
  { channel: "general", sender_name: "Nistor Laura", sender_email: "nistor.laura@alextours.ro", content: "Newsletter-ul de iunie a fost trimis la 3100 abonați! Rata de deschidere 42% 📧" },
  { channel: "general", sender_name: "Rusu Ioana", sender_email: "rusu.ioana@alextours.ro", content: "Raportul financiar mai 2026 este gata. Luna excelentă! 📊💚" },
  { channel: "general", sender_name: "Gheorghe Mihai", sender_email: "gheorghe.mihai@alextours.ro", content: "Am rezolvat 47 tickete de suport în mai - record personal! ✅🏆" },
  { channel: "general", sender_name: "Marin Alexandru", sender_email: "marin.alexandru@alextours.ro", content: "Logistica pentru turul Grecia din 20 iunie este confirmată 🇬🇷" },
  { channel: "tours", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Turul Croatia are 22 participanți! Sold out în 3 zile 🎉🏆" },
  { channel: "tours", sender_name: "Dumitrescu Andrei", sender_email: "dumitrescu.andrei@alextours.ro", content: "Am pregătit ghidul complet pentru Santorini. Clienții vor fi uimiți!" },
  { channel: "tours", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Feedback superb de la turul Turcia - 4.9/5 stele! 🌟🌟🌟🌟🌟" },
  { channel: "tours", sender_name: "Vlad Radu", sender_email: "vlad.radu@alextours.ro", content: "Pregătesc turul Maroc pentru august. Itinerarul arată spectaculos 🇲🇦" },
  { channel: "bookings", sender_name: "Popa Cristina", sender_email: "popa.cristina@alextours.ro", content: "Client VIP nou - familie cu 4 persoane, pachet premium Bali 2 săptămâni 🏝️" },
  { channel: "bookings", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: "8 cereri corporate noi în prima săptămână din iunie! Recordul lunii mai bătut!" },
  { channel: "bookings", sender_name: "Serban Andreea", sender_email: "serban.andreea@alextours.ro", content: "Confirmat tur de grup 15 persoane Portugalia - total 18.500 EUR ✅💰" },
  { channel: "bookings", sender_name: "Popa Cristina", sender_email: "popa.cristina@alextours.ro", content: "Rata de conversie a crescut la 34% față de 28% în mai! 📈" },
  { channel: "marketing", sender_name: "Nistor Laura", sender_email: "nistor.laura@alextours.ro", content: "Campania Instagram vară a atins 50.000 afișări organice! 🚀📸" },
  { channel: "marketing", sender_name: "Constantin Ana", sender_email: "constantin.ana@alextours.ro", content: "Reels-ul cu Santorini a ajuns viral - 15.000 vizualizări în 24h! 📱🔥" },
  { channel: "marketing", sender_name: "Dinu Catalin", sender_email: "dinu.catalin@alextours.ro", content: "Planul de conținut iulie-septembrie aprobat! Temă: destinații exotice 🌍" },
  { channel: "marketing", sender_name: "Nistor Laura", sender_email: "nistor.laura@alextours.ro", content: "Parteneriat nou cu bloggerul de travel cu 80k urmăritori confirmat! 🤝" },
  { channel: "random", sender_name: "Florea Bogdan", sender_email: "florea.bogdan@alextours.ro", content: "Recomandări pentru team building de vară? Avem buget aprobat! 🎉" },
  { channel: "random", sender_name: "Popa Cristina", sender_email: "popa.cristina@alextours.ro", content: "Paintball sau escape room? Votăm! 🎯🔐" },
  { channel: "random", sender_name: "Gheorghe Mihai", sender_email: "gheorghe.mihai@alextours.ro", content: "Am descoperit o rută nouă de ciclism lângă București - perfect pentru weekend! 🚴" },
  { channel: "general", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Prima lună de vârf din 2026 încheiată cu succes! Felicitări tuturor! 🏆🎊" },
];

const MAY_TASKS = [
  { title: "Lansare oferte vară 2026", description: "Pachete complete Grecia, Croatia, Italia - prețuri și disponibilitate", priority: "high", status: "done", assigned_to_name: "Ionescu Maria", assigned_to_email: "ionescu.maria@alextours.ro", due_date: "2026-06-05", created_by_name: "Alina" },
  { title: "Campanie Instagram vară", description: "Reels și stories pentru destinațiile de top - Santorini, Dubrovnik, Amalfi", priority: "high", status: "done", assigned_to_name: "Nistor Laura", assigned_to_email: "nistor.laura@alextours.ro", due_date: "2026-06-10", created_by_name: "Alina" },
  { title: "Raport financiar mai 2026", description: "Compilare date financiare și operaționale mai 2026", priority: "high", status: "done", assigned_to_name: "Rusu Ioana", assigned_to_email: "rusu.ioana@alextours.ro", due_date: "2026-06-03", created_by_name: "Alina" },
  { title: "Negociere contracte vara Croatia", description: "Contracte hoteluri Split, Dubrovnik, Hvar pentru sezon", priority: "high", status: "done", assigned_to_name: "Popescu Ion", assigned_to_email: "popescu.ion@alextours.ro", due_date: "2026-06-08", created_by_name: "Alina" },
  { title: "Actualizare prețuri august-septembrie", description: "Recalculare prețuri pentru high season - toate destinațiile", priority: "medium", status: "in_progress", assigned_to_name: "Constantin Ana", assigned_to_email: "constantin.ana@alextours.ro", due_date: "2026-06-25", created_by_name: "Alina" },
  { title: "Pregătire tur Croatia 20 iunie", description: "Logistică completă - transport, cazare, ghid, documente 22 participanți", priority: "high", status: "done", assigned_to_name: "Dumitrescu Andrei", assigned_to_email: "dumitrescu.andrei@alextours.ro", due_date: "2026-06-18", created_by_name: "Alina" },
  { title: "Oferte corporate H2 2026", description: "Pachete personalizate pentru 8 companii interesate de teambuilding", priority: "high", status: "in_progress", assigned_to_name: "Serban Andreea", assigned_to_email: "serban.andreea@alextours.ro", due_date: "2026-06-28", created_by_name: "Alina" },
  { title: "Newsletter iunie 2026", description: "Redactare și trimitere newsletter cu ofertele lunii", priority: "medium", status: "done", assigned_to_name: "Dinu Catalin", assigned_to_email: "dinu.catalin@alextours.ro", due_date: "2026-06-12", created_by_name: "Alina" },
  { title: "Sistem feedback clienți", description: "Implementare formular feedback post-tur și raport lunar", priority: "medium", status: "done", assigned_to_name: "Matei Raluca", assigned_to_email: "matei.raluca@alextours.ro", due_date: "2026-06-15", created_by_name: "Alina" },
  { title: "Coordonare flota transport", description: "Organizare transport aeroport pentru toate tururile din iunie - 4 departuri", priority: "medium", status: "done", assigned_to_name: "Bucur Silviu", assigned_to_email: "bucur.silviu@alextours.ro", due_date: "2026-06-19", created_by_name: "Alina" },
  { title: "Parteneriat influencer travel", description: "Negociere și semnare contract colaborare blogger cu 80k urmăritori", priority: "medium", status: "in_progress", assigned_to_name: "Popa Cristina", assigned_to_email: "popa.cristina@alextours.ro", due_date: "2026-06-30", created_by_name: "Alina" },
  { title: "Pregătire tururi august", description: "Itinerarii și logistică pentru tururile din august - Maroc, Egipt, Bali", priority: "low", status: "todo", assigned_to_name: "Florea Bogdan", assigned_to_email: "florea.bogdan@alextours.ro", due_date: "2026-06-29", created_by_name: "Alina" },
];

const MAY_MOOD = [
  { week: "2026-W23", date: "2026-06-01" },
  { week: "2026-W24", date: "2026-06-08" },
  { week: "2026-W25", date: "2026-06-15" },
  { week: "2026-W26", date: "2026-06-22" },
];

const MOOD_DATA = {
  "2026-06-01": ["😊","😊","😊","😐","😊","😊","😐","😊","😊","😊","😊","😊","😊","😐","😊","😊"],
  "2026-06-08": ["😊","😊","😐","😊","😊","😊","😊","😊","😊","😔","😊","😐","😊","😊","😊","😊"],
  "2026-06-15": ["😐","😊","😊","😊","😊","😔","😊","😊","😐","😊","😊","😊","😊","😊","😐","😊"],
  "2026-06-22": ["😊","😊","😊","😊","😊","😊","😊","😊","😊","😐","😔","😊","😊","😊","😊","😊"],
};

const LEAVE_DATA = [
  { employee_email: "popescu.ion@alextours.ro", employee_name: "Popescu Ion", type: "concediu_odihna", start_date: "2026-06-08", end_date: "2026-06-08", reason: "Zi personală", status: "approved" },
  { employee_email: "ionescu.maria@alextours.ro", employee_name: "Ionescu Maria", type: "concediu_odihna", start_date: "2026-06-04", end_date: "2026-06-04", reason: "Zi personală", status: "approved" },
  { employee_email: "ionescu.maria@alextours.ro", employee_name: "Ionescu Maria", type: "concediu_odihna", start_date: "2026-06-15", end_date: "2026-06-15", reason: "Zi personală", status: "approved" },
  { employee_email: "dumitrescu.andrei@alextours.ro", employee_name: "Dumitrescu Andrei", type: "concediu_odihna", start_date: "2026-06-03", end_date: "2026-06-03", reason: "Zi personală", status: "approved" },
  { employee_email: "nistor.laura@alextours.ro", employee_name: "Nistor Laura", type: "concediu_medical", start_date: "2026-06-08", end_date: "2026-06-08", reason: "Consultație medicală", status: "approved" },
  { employee_email: "marin.alexandru@alextours.ro", employee_name: "Marin Alexandru", type: "concediu_odihna", start_date: "2026-06-15", end_date: "2026-06-15", reason: "Zi personală", status: "approved" },
  { employee_email: "popa.cristina@alextours.ro", employee_name: "Popa Cristina", type: "concediu_odihna", start_date: "2026-06-29", end_date: "2026-07-03", reason: "Concediu vară", status: "pending" },
  { employee_email: "florea.bogdan@alextours.ro", employee_name: "Florea Bogdan", type: "concediu_odihna", start_date: "2026-06-18", end_date: "2026-06-18", reason: "Zi personală", status: "approved" },
  { employee_email: "gheorghe.mihai@alextours.ro", employee_name: "Gheorghe Mihai", type: "concediu_odihna", start_date: "2026-06-29", end_date: "2026-07-03", reason: "Concediu planificat", status: "pending" },
  { employee_email: "stanescu.elena@alextours.ro", employee_name: "Stanescu Elena", type: "concediu_odihna", start_date: "2026-06-11", end_date: "2026-06-11", reason: "Zi personală", status: "approved" },
];

const ALL_EMPLOYEES_EMAILS = [
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

export const EMP_LIST = EMPLOYEES;

export const seedAttendance = async () => {
  console.log("📅 Adăugare prezență iunie 2026...");
  for (const emp of MAY_SCHEDULE) {
    console.log(`⏳ Procesez ${emp.name}...`);
    for (const [date, data] of Object.entries(emp.days)) {
      if (data.absent) {
        await appClient.entities.Attendance.create({
          employee_email: emp.email,
          employee_name: emp.name,
          date,
          check_in: null,
          status: "absent",
          work_location: "acasa",
        });
        await sleep(150);
      } else {
        await appClient.entities.Attendance.create({
          employee_email: emp.email,
          employee_name: emp.name,
          date,
          check_in: data.ci,
          status: "present",
          work_location: data.loc,
        });
        await sleep(150);
        await appClient.entities.AttendanceEvent.create({ employee_email: emp.email, employee_name: emp.name, date, time: data.ci, event_type: "check_in" });
        await sleep(150);
        await appClient.entities.AttendanceEvent.create({ employee_email: emp.email, employee_name: emp.name, date, time: data.bs, event_type: "break_start" });
        await sleep(150);
        await appClient.entities.AttendanceEvent.create({ employee_email: emp.email, employee_name: emp.name, date, time: data.be, event_type: "break_end" });
        await sleep(150);
        await appClient.entities.AttendanceEvent.create({ employee_email: emp.email, employee_name: emp.name, date, time: data.co, event_type: "check_out" });
        await sleep(150);
      }
    }
    console.log(`✅ ${emp.name} gata!`);
    await sleep(300);
  }
  console.log("✅ Prezență completă!");
};

export const seedMessages = async () => {
  console.log("💬 Adăugare mesaje...");
  for (const msg of MAY_MESSAGES) {
    await appClient.entities.Message.create({
      channel: msg.channel,
      channel_type: "channel",
      sender_name: msg.sender_name,
      sender_email: msg.sender_email,
      content: msg.content,
    });
    await sleep(100);
  }
  console.log("✅ Mesaje gata!");
};

export const seedTasks = async () => {
  console.log("✅ Adăugare sarcini...");
  for (const task of MAY_TASKS) {
    await appClient.entities.Task.create(task);
    await sleep(100);
  }
  console.log("✅ Sarcini gata!");
};

export const seedMoodVotes = async () => {
  console.log("😊 Adăugare mood votes...");
  for (const weekData of MAY_MOOD) {
    const moods = MOOD_DATA[weekData.date];
    for (let i = 0; i < ALL_EMPLOYEES_EMAILS.length; i++) {
      await appClient.entities.MoodVote.create({
        employee_email: ALL_EMPLOYEES_EMAILS[i].email,
        employee_name: ALL_EMPLOYEES_EMAILS[i].name,
        mood: moods[i],
        week: weekData.week,
        date: weekData.date,
      });
      await sleep(100);
    }
  }
  console.log("✅ Mood votes gata!");
};

export const seedLeaveRequests = async () => {
  console.log("📋 Adăugare cereri concediu...");
  for (const leave of LEAVE_DATA) {
    await appClient.entities.LeaveRequest.create(leave);
    await sleep(100);
  }
  console.log("✅ Cereri concediu gata!");
};

export const seedClients = async () => {
  const CLIENTS = [
    { full_name: "Dumitru Vasile", email: "dumitru.vasile@gmail.com", phone: "0721345678", city: "București", status: "activ", last_tour: "Croatia 2026", tours_count: "6", notes: "Preferă hoteluri 5 stele" },
    { full_name: "Popa Andreea", email: "popa.andreea@gmail.com", phone: "0734567890", city: "Cluj-Napoca", status: "activ", last_tour: "Grecia 2026", tours_count: "8", notes: "Client fidel, reducere 10%" },
    { full_name: "Marin Cristian", email: "marin.cristian@yahoo.com", phone: "0756789012", city: "Timișoara", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de Maldive și Bali" },
    { full_name: "Nicolescu Ioana", email: "nicolescu.ioana@gmail.com", phone: "0712345678", city: "Iași", status: "activ", last_tour: "Italia 2026", tours_count: "4", notes: "" },
    { full_name: "Florea Alexandru", email: "florea.alex@gmail.com", phone: "0745678901", city: "Constanța", status: "inactiv", last_tour: "Bulgaria 2024", tours_count: "1", notes: "Nu a mai răspuns la oferte" },
    { full_name: "Stan Mihaela", email: "stan.mihaela@gmail.com", phone: "0723456789", city: "Brașov", status: "activ", last_tour: "Portugalia 2026", tours_count: "5", notes: "Preferă city break-uri" },
    { full_name: "Radu George", email: "radu.george@yahoo.com", phone: "0767890123", city: "București", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de pachete familie cu copii" },
    { full_name: "Ionescu Roxana", email: "ionescu.roxana@gmail.com", phone: "0731234567", city: "Sibiu", status: "activ", last_tour: "Spania 2026", tours_count: "7", notes: "Preferă vacanțe culturale" },
    { full_name: "Gheorghiu Dan", email: "gheorghiu.dan@yahoo.com", phone: "0742345678", city: "Galați", status: "activ", last_tour: "Dubai 2026", tours_count: "3", notes: "" },
    { full_name: "Marinescu Ana", email: "marinescu.ana@gmail.com", phone: "0753456789", city: "Ploiești", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de croaziere mediteraneene" },
    { full_name: "Barbu Sorin", email: "barbu.sorin@gmail.com", phone: "0708901234", city: "Bacău", status: "activ", last_tour: "Egipt 2026", tours_count: "5", notes: "Client VIP - budget nelimitat" },
    { full_name: "Alexandrescu Mihai", email: "alexandrescu.mihai@gmail.com", phone: "0721456789", city: "București", status: "activ", last_tour: "Bali 2026", tours_count: "4", notes: "Preferă destinații exotice" },
    { full_name: "Tudor Elena", email: "tudor.elena@yahoo.com", phone: "0734678901", city: "Cluj-Napoca", status: "activ", last_tour: "Maldive 2026", tours_count: "2", notes: "Luna de miere - pachet special" },
    { full_name: "Neagu Florin", email: "neagu.florin@gmail.com", phone: "0756890123", city: "Timișoara", status: "activ", last_tour: "Maroc 2026", tours_count: "3", notes: "" },
    { full_name: "Costea Diana", email: "costea.diana@gmail.com", phone: "0712567890", city: "Iași", status: "activ", last_tour: "Thailanda 2025", tours_count: "4", notes: "Rezervă mereu pentru 2 persoane" },
    { full_name: "Preda Vasile", email: "preda.vasile@yahoo.com", phone: "0745789012", city: "Constanța", status: "inactiv", last_tour: "Grecia 2024", tours_count: "1", notes: "Nemulțumit de ultimul tur" },
    { full_name: "Popescu Catalin", email: "popescu.catalin@yahoo.com", phone: "0786789012", city: "Arad", status: "activ", last_tour: "Croatia 2026", tours_count: "4", notes: "Preferă hoteluri boutique" },
    { full_name: "Niculae Maria", email: "niculae.maria@gmail.com", phone: "0797890123", city: "Pitești", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de Japonia și Coreea" },
    { full_name: "Constantin Victor", email: "constantin.victor@gmail.com", phone: "0764567890", city: "Craiova", status: "activ", last_tour: "Grecia 2026", tours_count: "5", notes: "Rezervă mereu cu familia extinsă" },
    { full_name: "Enache Mihaela", email: "enache.mihaela@gmail.com", phone: "0708901235", city: "Iași", status: "activ", last_tour: "Santorini 2026", tours_count: "2", notes: "Client nou recomandat de Popa Andreea" },
  ];
  for (const client of CLIENTS) {
    await appClient.entities.Client.create(client);
    await sleep(100);
  }
  console.log("✅ Clienți gata!");
};

export const seedCalendar = async () => {
  const EVENTS = [
    { title: "Ședință săptămânală echipă", date: "2026-06-01", time: "10:00", duration: "60", description: "Kickoff luna iunie - obiective și planificare sezon", color: "teal", created_by_name: "Alina" },
    { title: "Întâlnire parteneri Croatia", date: "2026-06-03", time: "09:00", duration: "120", description: "Negociere contracte hoteluri Split și Dubrovnik", color: "green", created_by_name: "Alina" },
    { title: "Lansare campanie vară", date: "2026-06-05", time: "14:00", duration: "60", description: "Lansare oficială campanie digitală vară 2026", color: "amber", created_by_name: "Alina" },
    { title: "Tur Croatia - plecare", date: "2026-06-20", time: "05:30", duration: "30", description: "Plecare tur Croatia - 22 participanți, aeroport Otopeni", color: "purple", created_by_name: "Alina" },
    { title: "Ședință lunară iunie", date: "2026-06-10", time: "10:00", duration: "90", description: "Raport progres și ajustare obiective Q2", color: "teal", created_by_name: "Alina" },
    { title: "Workshop vânzări avansate", date: "2026-06-17", time: "13:00", duration: "180", description: "Tehnici de upselling și cross-selling pentru agenți", color: "purple", created_by_name: "Alina" },
    { title: "Tur Grecia - plecare", date: "2026-06-22", time: "06:00", duration: "30", description: "Plecare tur Grecia - 18 participanți", color: "amber", created_by_name: "Alina" },
    { title: "Prezentare oferte toamnă", date: "2026-06-25", time: "15:00", duration: "90", description: "Lansare pachete septembrie-noiembrie pentru clienți VIP", color: "teal", created_by_name: "Alina" },
    { title: "Evaluare performanță H1", date: "2026-06-26", time: "09:00", duration: "300", description: "Evaluare individuală toți angajații - semestrul 1", color: "red", created_by_name: "Alina" },
    { title: "Petrecere team - final H1", date: "2026-06-30", time: "18:00", duration: "120", description: "Celebrăm rezultatele din primul semestru! 🎉🍾", color: "green", created_by_name: "Alina" },
  ];
  for (const event of EVENTS) {
    await appClient.entities.CalendarEvent.create(event);
    await sleep(100);
  }
  console.log("✅ Calendar gata!");
};

export const seedRooms = async () => {
  const ROOMS = [
    { name: "Sala Principală", description: "Sala pentru ședințe de echipă", meeting_url: "https://meet.google.com/abc-defg-hij", topic: "Ședință săptămânală", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
    { name: "Sala Vânzări", description: "Prezentări și negocieri cu clienți", meeting_url: "https://meet.google.com/klm-nopq-rst", topic: "Prezentare oferte", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
    { name: "Sala Training", description: "Sesiuni de training și onboarding", meeting_url: "https://meet.google.com/uvw-xyz-123", topic: "Training angajați", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
    { name: "Sala Marketing", description: "Brainstorming și campanii", meeting_url: "https://meet.google.com/mkt-room-456", topic: "Strategie marketing", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
  ];
  for (const room of ROOMS) {
    await appClient.entities.Room.create(room);
    await sleep(100);
  }
  console.log("✅ Săli gata!");
};

export const seedDatabase = async () => {
  console.log("🌱 Populare completă...");
  try {
    for (const emp of EMPLOYEES) {
      await appClient.entities.Employee.create(emp);
      await sleep(100);
    }
    await seedAttendance();
    await seedMessages();
    await seedTasks();
    await seedMoodVotes();
    await seedLeaveRequests();
    await seedClients();
    await seedCalendar();
    await seedRooms();
    console.log("✅ Totul gata!");
    return true;
  } catch (err) {
    console.error("❌ Eroare:", err);
    return false;
  }
};