import { appClient } from "@/api/appClient";

const EMPLOYEES = [
  { full_name: "Popescu Ion", email: "popescu.ion@alextours.ro", role: "tour_guide", department: "Operations", status: "active", current_status: "acasa", gender: "m", birth_date: "1990-04-20" },
  { full_name: "Ionescu Maria", email: "ionescu.maria@alextours.ro", role: "booking_agent", department: "Sales", status: "active", current_status: "acasa", gender: "f", birth_date: "1995-05-08" },
  { full_name: "Constantin Ana", email: "constantin.ana@alextours.ro", role: "marketing", department: "Marketing", status: "active", current_status: "acasa", gender: "f", birth_date: "1993-06-15" },
  { full_name: "Gheorghe Mihai", email: "gheorghe.mihai@alextours.ro", role: "customer_support", department: "Customer Service", status: "active", current_status: "acasa", gender: "m", birth_date: "1988-05-22" },
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

// Primii 10 angajati cu date complete pentru mai 2026
const MAY_SCHEDULE = [
  {
    email: "popescu.ion@alextours.ro", name: "Popescu Ion",
    days: {
      "2026-05-04": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-05": { ci: "09:00", bs: "12:45", be: "13:15", co: "18:30", loc: "teren" },
      "2026-05-06": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:20", loc: "acasa" },
      "2026-05-07": { ci: "09:05", bs: "13:00", be: "13:30", co: "17:45", loc: "sedinta" },
      "2026-05-08": { absent: true },
      "2026-05-11": { ci: "08:48", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-12": { ci: "09:10", bs: "12:30", be: "13:00", co: "18:45", loc: "teren" },
      "2026-05-13": { ci: "09:00", bs: "12:40", be: "13:10", co: "17:30", loc: "acasa" },
      "2026-05-14": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:15", loc: "acasa" },
      "2026-05-15": { ci: "09:02", bs: "12:45", be: "13:15", co: "19:00", loc: "teren" },
      "2026-05-18": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-19": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:00", loc: "sedinta" },
      "2026-05-20": { absent: true },
      "2026-05-21": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:30", loc: "acasa" },
      "2026-05-22": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:45", loc: "teren" },
      "2026-05-25": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-26": { ci: "09:05", bs: "12:45", be: "13:15", co: "18:30", loc: "acasa" },
      "2026-05-27": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:20", loc: "acasa" },
      "2026-05-28": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-29": { ci: "08:58", bs: "12:30", be: "13:00", co: "17:15", loc: "acasa" },
    }
  },
  {
    email: "ionescu.maria@alextours.ro", name: "Ionescu Maria",
    days: {
      "2026-05-04": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-05": { ci: "08:50", bs: "12:30", be: "13:00", co: "18:30", loc: "acasa" },
      "2026-05-06": { ci: "09:00", bs: "12:15", be: "12:45", co: "17:15", loc: "sedinta" },
      "2026-05-07": { ci: "08:40", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-08": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-11": { absent: true },
      "2026-05-12": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-13": { ci: "08:50", bs: "12:30", be: "13:00", co: "18:45", loc: "teren" },
      "2026-05-14": { ci: "09:00", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-15": { ci: "08:40", bs: "12:00", be: "12:30", co: "17:00", loc: "sedinta" },
      "2026-05-18": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-19": { ci: "09:05", bs: "12:45", be: "13:15", co: "18:45", loc: "acasa" },
      "2026-05-20": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-21": { absent: true },
      "2026-05-22": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-25": { ci: "09:00", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-26": { ci: "08:40", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-27": { ci: "08:55", bs: "12:30", be: "13:00", co: "18:30", loc: "sedinta" },
      "2026-05-28": { ci: "09:00", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-29": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
    }
  },
  {
    email: "constantin.ana@alextours.ro", name: "Constantin Ana",
    days: {
      "2026-05-04": { ci: "09:15", bs: "13:00", be: "13:30", co: "17:45", loc: "acasa" },
      "2026-05-05": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-06": { ci: "09:20", bs: "13:15", be: "13:45", co: "18:00", loc: "acasa" },
      "2026-05-07": { ci: "09:10", bs: "13:00", be: "13:30", co: "17:45", loc: "teren" },
      "2026-05-08": { ci: "09:05", bs: "12:30", be: "13:00", co: "19:00", loc: "acasa" },
      "2026-05-11": { ci: "09:15", bs: "13:00", be: "13:30", co: "17:45", loc: "acasa" },
      "2026-05-12": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-13": { absent: true },
      "2026-05-14": { ci: "09:10", bs: "13:00", be: "13:30", co: "17:45", loc: "acasa" },
      "2026-05-15": { ci: "09:05", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-18": { ci: "09:15", bs: "13:00", be: "13:30", co: "18:30", loc: "acasa" },
      "2026-05-19": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-20": { ci: "09:20", bs: "13:15", be: "13:45", co: "18:00", loc: "teren" },
      "2026-05-21": { ci: "09:10", bs: "13:00", be: "13:30", co: "17:45", loc: "acasa" },
      "2026-05-22": { absent: true },
      "2026-05-25": { ci: "09:05", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-26": { ci: "09:15", bs: "13:00", be: "13:30", co: "17:45", loc: "teren" },
      "2026-05-27": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:30", loc: "acasa" },
      "2026-05-28": { ci: "09:10", bs: "13:00", be: "13:30", co: "17:45", loc: "teren" },
      "2026-05-29": { ci: "09:05", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
    }
  },
  {
    email: "gheorghe.mihai@alextours.ro", name: "Gheorghe Mihai",
    days: {
      "2026-05-04": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-05": { ci: "09:30", bs: "13:00", be: "13:30", co: "18:00", loc: "sedinta" },
      "2026-05-06": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-07": { ci: "09:05", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-08": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:30", loc: "teren" },
      "2026-05-11": { absent: true },
      "2026-05-12": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-13": { ci: "09:30", bs: "13:00", be: "13:30", co: "18:00", loc: "sedinta" },
      "2026-05-14": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-15": { ci: "09:05", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-18": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-19": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-20": { ci: "09:00", bs: "12:30", be: "13:00", co: "19:00", loc: "sedinta" },
      "2026-05-21": { absent: true },
      "2026-05-22": { ci: "09:30", bs: "13:00", be: "13:30", co: "18:00", loc: "teren" },
      "2026-05-25": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-26": { ci: "09:05", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-27": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-28": { ci: "08:55", bs: "12:30", be: "13:00", co: "18:00", loc: "sedinta" },
      "2026-05-29": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
    }
  },
  {
    email: "stanescu.elena@alextours.ro", name: "Stanescu Elena",
    days: {
      "2026-05-04": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-05-05": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:00", loc: "acasa" },
      "2026-05-06": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:45", loc: "acasa" },
      "2026-05-07": { ci: "08:40", bs: "12:00", be: "12:30", co: "17:00", loc: "sedinta" },
      "2026-05-08": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-05-11": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:00", loc: "acasa" },
      "2026-05-12": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-05-13": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:00", loc: "acasa" },
      "2026-05-14": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:45", loc: "acasa" },
      "2026-05-15": { absent: true },
      "2026-05-18": { ci: "08:40", bs: "12:00", be: "12:30", co: "17:00", loc: "sedinta" },
      "2026-05-19": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-05-20": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:00", loc: "acasa" },
      "2026-05-21": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:45", loc: "acasa" },
      "2026-05-22": { ci: "08:40", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-25": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
      "2026-05-26": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:00", loc: "acasa" },
      "2026-05-27": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:45", loc: "acasa" },
      "2026-05-28": { ci: "08:40", bs: "12:00", be: "12:30", co: "17:00", loc: "sedinta" },
      "2026-05-29": { ci: "08:30", bs: "12:00", be: "12:30", co: "16:30", loc: "acasa" },
    }
  },
  {
    email: "dumitrescu.andrei@alextours.ro", name: "Dumitrescu Andrei",
    days: {
      "2026-05-04": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-05": { ci: "09:05", bs: "13:00", be: "13:30", co: "18:00", loc: "acasa" },
      "2026-05-06": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-07": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-08": { ci: "09:10", bs: "12:45", be: "13:15", co: "18:45", loc: "sedinta" },
      "2026-05-11": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-12": { absent: true },
      "2026-05-13": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-14": { ci: "09:05", bs: "13:00", be: "13:30", co: "18:00", loc: "acasa" },
      "2026-05-15": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-18": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-19": { ci: "09:10", bs: "12:45", be: "13:15", co: "19:00", loc: "sedinta" },
      "2026-05-20": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-21": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-22": { absent: true },
      "2026-05-25": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-26": { ci: "09:05", bs: "13:00", be: "13:30", co: "18:30", loc: "acasa" },
      "2026-05-27": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-28": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-29": { ci: "09:10", bs: "12:45", be: "13:15", co: "17:45", loc: "sedinta" },
    }
  },
  {
    email: "popa.cristina@alextours.ro", name: "Popa Cristina",
    days: {
      "2026-05-04": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-05": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-06": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-07": { ci: "09:10", bs: "12:45", be: "13:15", co: "18:45", loc: "teren" },
      "2026-05-08": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-11": { ci: "09:00", bs: "12:15", be: "12:45", co: "17:15", loc: "sedinta" },
      "2026-05-12": { ci: "08:50", bs: "12:30", be: "13:00", co: "18:30", loc: "acasa" },
      "2026-05-13": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:00", loc: "acasa" },
      "2026-05-14": { absent: true },
      "2026-05-15": { ci: "09:10", bs: "12:45", be: "13:15", co: "17:45", loc: "teren" },
      "2026-05-18": { ci: "08:55", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-19": { ci: "09:00", bs: "12:15", be: "12:45", co: "18:30", loc: "sedinta" },
      "2026-05-20": { ci: "08:50", bs: "12:30", be: "13:00", co: "17:15", loc: "acasa" },
      "2026-05-21": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:00", loc: "acasa" },
      "2026-05-22": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "teren" },
      "2026-05-25": { absent: true },
      "2026-05-26": { ci: "08:50", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-27": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-28": { ci: "08:45", bs: "12:00", be: "12:30", co: "17:00", loc: "teren" },
      "2026-05-29": { ci: "09:10", bs: "12:45", be: "13:15", co: "17:45", loc: "acasa" },
    }
  },
  {
    email: "marin.alexandru@alextours.ro", name: "Marin Alexandru",
    days: {
      "2026-05-04": { ci: "09:10", bs: "12:45", be: "13:15", co: "17:45", loc: "teren" },
      "2026-05-05": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-06": { ci: "08:55", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-07": { ci: "09:15", bs: "13:00", be: "13:30", co: "18:00", loc: "teren" },
      "2026-05-08": { ci: "09:05", bs: "12:30", be: "13:00", co: "17:30", loc: "sedinta" },
      "2026-05-11": { ci: "08:50", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-12": { ci: "09:10", bs: "12:45", be: "13:15", co: "18:00", loc: "teren" },
      "2026-05-13": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-14": { ci: "08:55", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-15": { ci: "09:15", bs: "13:00", be: "13:30", co: "18:00", loc: "teren" },
      "2026-05-18": { absent: true },
      "2026-05-19": { ci: "08:50", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-20": { ci: "09:10", bs: "12:45", be: "13:15", co: "18:30", loc: "teren" },
      "2026-05-21": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-22": { ci: "08:55", bs: "12:15", be: "12:45", co: "17:15", loc: "sedinta" },
      "2026-05-25": { ci: "09:15", bs: "13:00", be: "13:30", co: "18:00", loc: "teren" },
      "2026-05-26": { ci: "09:05", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-27": { ci: "08:50", bs: "12:00", be: "12:30", co: "17:00", loc: "acasa" },
      "2026-05-28": { absent: true },
      "2026-05-29": { ci: "09:10", bs: "12:45", be: "13:15", co: "17:45", loc: "teren" },
    }
  },
  {
    email: "nistor.laura@alextours.ro", name: "Nistor Laura",
    days: {
      "2026-05-04": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:10", loc: "acasa" },
      "2026-05-05": { ci: "08:55", bs: "12:25", be: "12:55", co: "17:25", loc: "acasa" },
      "2026-05-06": { ci: "09:05", bs: "12:35", be: "13:05", co: "18:35", loc: "acasa" },
      "2026-05-07": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-08": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-11": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:10", loc: "acasa" },
      "2026-05-12": { ci: "08:55", bs: "12:25", be: "12:55", co: "17:25", loc: "acasa" },
      "2026-05-13": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-05-14": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-15": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:30", loc: "teren" },
      "2026-05-18": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:10", loc: "acasa" },
      "2026-05-19": { ci: "08:55", bs: "12:25", be: "12:55", co: "17:25", loc: "acasa" },
      "2026-05-20": { absent: true },
      "2026-05-21": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-22": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "teren" },
      "2026-05-25": { ci: "08:40", bs: "12:10", be: "12:40", co: "17:10", loc: "acasa" },
      "2026-05-26": { ci: "08:55", bs: "12:25", be: "12:55", co: "17:25", loc: "acasa" },
      "2026-05-27": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-05-28": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-29": { absent: true },
    }
  },
  {
    email: "florea.bogdan@alextours.ro", name: "Florea Bogdan",
    days: {
      "2026-05-04": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-05-05": { ci: "08:50", bs: "12:20", be: "12:50", co: "17:20", loc: "acasa" },
      "2026-05-06": { ci: "09:15", bs: "12:45", be: "13:15", co: "17:45", loc: "sedinta" },
      "2026-05-07": { ci: "09:00", bs: "12:30", be: "13:00", co: "18:30", loc: "acasa" },
      "2026-05-08": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-11": { ci: "09:10", bs: "12:40", be: "13:10", co: "17:40", loc: "teren" },
      "2026-05-12": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-05-13": { ci: "08:50", bs: "12:20", be: "12:50", co: "18:45", loc: "acasa" },
      "2026-05-14": { ci: "09:15", bs: "12:45", be: "13:15", co: "17:45", loc: "sedinta" },
      "2026-05-15": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-18": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-19": { ci: "09:10", bs: "12:40", be: "13:10", co: "17:40", loc: "teren" },
      "2026-05-20": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-05-21": { ci: "08:50", bs: "12:20", be: "12:50", co: "17:20", loc: "acasa" },
      "2026-05-22": { absent: true },
      "2026-05-25": { ci: "09:00", bs: "12:30", be: "13:00", co: "17:30", loc: "acasa" },
      "2026-05-26": { ci: "08:45", bs: "12:15", be: "12:45", co: "17:15", loc: "acasa" },
      "2026-05-27": { ci: "09:10", bs: "12:40", be: "13:10", co: "18:40", loc: "sedinta" },
      "2026-05-28": { ci: "09:05", bs: "12:35", be: "13:05", co: "17:35", loc: "acasa" },
      "2026-05-29": { ci: "08:50", bs: "12:20", be: "12:50", co: "17:20", loc: "acasa" },
    }
  },
];

const MAY_MESSAGES = [
  { channel: "general", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: "Bună dimineața echipei! 👋 Luna mai a început, să avem rezultate faine!" },
  { channel: "general", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Salut tuturor! Am finalizat itinerariul pentru turul Grecia din 15 mai 🇬🇷" },
  { channel: "general", sender_name: "Florea Bogdan", sender_email: "florea.bogdan@alextours.ro", content: "Cineva vrea cafea virtuală? ☕😄 Bună dimineața!" },
  { channel: "general", sender_name: "Constantin Ana", sender_email: "constantin.ana@alextours.ro", content: "Am actualizat materialele de marketing pentru campania de vară! Arată super 🌞" },
  { channel: "general", sender_name: "Nistor Laura", sender_email: "nistor.laura@alextours.ro", content: "Newsletter-ul lunii mai a fost trimis la 2800 abonați! Rata de deschidere 38% 🚀" },
  { channel: "general", sender_name: "Rusu Ioana", sender_email: "rusu.ioana@alextours.ro", content: "Raportul financiar aprilie este gata. Rezultate foarte bune! 📊" },
  { channel: "general", sender_name: "Gheorghe Mihai", sender_email: "gheorghe.mihai@alextours.ro", content: "Am rezolvat toate ticketele de suport din săptămâna asta ✅" },
  { channel: "general", sender_name: "Marin Alexandru", sender_email: "marin.alexandru@alextours.ro", content: "Logistica pentru turul Turcia din 20 mai este confirmată 🇹🇷" },
  { channel: "tours", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Turul Grecia are 18 participanți confirmați! Aproape sold out 🎉" },
  { channel: "tours", sender_name: "Dumitrescu Andrei", sender_email: "dumitrescu.andrei@alextours.ro", content: "Am pregătit ghidul de destinație pentru Istanbul. Clienții vor fi încântați!" },
  { channel: "tours", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Feedback fantastic de la turul Egipt din luna trecută! 5 stele 🌟" },
  { channel: "tours", sender_name: "Vlad Radu", sender_email: "vlad.radu@alextours.ro", content: "Pregătesc itinerariul pentru turul Dubai din iunie. Cine vrea să revizuiască?" },
  { channel: "bookings", sender_name: "Popa Cristina", sender_email: "popa.cristina@alextours.ro", content: "Client nou VIP - pachet all-inclusive Maldive confirmat! 🏝️ Valoare mare!" },
  { channel: "bookings", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: "Am primit 5 cereri de ofertă pentru grupuri corporate în această săptămână!" },
  { channel: "bookings", sender_name: "Serban Andreea", sender_email: "serban.andreea@alextours.ro", content: "Confirmăm rezervarea familia Ionescu - Italia 2 săptămâni, total 4200 EUR ✅" },
  { channel: "bookings", sender_name: "Popa Cristina", sender_email: "popa.cristina@alextours.ro", content: "Avem 12 rezervări noi în mai față de 8 în aprilie. Creștere de 50%! 📈" },
  { channel: "marketing", sender_name: "Nistor Laura", sender_email: "nistor.laura@alextours.ro", content: "Campania Google Ads pentru vara 2026 a generat 350 lead-uri noi în mai! 🚀" },
  { channel: "marketing", sender_name: "Constantin Ana", sender_email: "constantin.ana@alextours.ro", content: "Postarea despre Santorini a atins 1200 likes pe Instagram! Record nou 📸" },
  { channel: "marketing", sender_name: "Dinu Catalin", sender_email: "dinu.catalin@alextours.ro", content: "Am pregătit planul de conținut pentru iunie-august. Vă trimit documentul!" },
  { channel: "marketing", sender_name: "Nistor Laura", sender_email: "nistor.laura@alextours.ro", content: "Colaborarea cu influencerul de travel a adus 800 urmăritori noi pe Instagram 🎯" },
  { channel: "random", sender_name: "Florea Bogdan", sender_email: "florea.bogdan@alextours.ro", content: "Cineva știe un restaurant bun în centrul Bucureștiului pentru client important?" },
  { channel: "random", sender_name: "Popa Cristina", sender_email: "popa.cristina@alextours.ro", content: "Eu recomand Lacrimi și Sfinți sau Caru cu Bere pentru atmosferă 🍽️" },
  { channel: "random", sender_name: "Gheorghe Mihai", sender_email: "gheorghe.mihai@alextours.ro", content: "Weekend-ul trecut am fost în Sinaia - perfect pentru recomandări clienți!" },
  { channel: "general", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: "Felicitări echipei pentru rezultatele din mai! Suntem pe drumul cel bun 🏆" },
];

const MAY_TASKS = [
  { title: "Ofertă Grecia vara 2026", description: "Pachet complet Santorini + Atena - prețuri și itinerar detaliat", priority: "high", status: "done", assigned_to_name: "Ionescu Maria", assigned_to_email: "ionescu.maria@alextours.ro", due_date: "2026-05-10", created_by_name: "Alina" },
  { title: "Campanie social media vara", description: "Postări și stories pentru destinațiile de vară - Grecia, Turcia, Italia", priority: "high", status: "done", assigned_to_name: "Nistor Laura", assigned_to_email: "nistor.laura@alextours.ro", due_date: "2026-05-15", created_by_name: "Alina" },
  { title: "Raport lunar aprilie", description: "Compilare date financiare și operaționale aprilie 2026", priority: "high", status: "done", assigned_to_name: "Rusu Ioana", assigned_to_email: "rusu.ioana@alextours.ro", due_date: "2026-05-05", created_by_name: "Alina" },
  { title: "Negociere contracte hoteluri Turcia", description: "Contracte hoteluri Istanbul și Antalya pentru sezon", priority: "medium", status: "done", assigned_to_name: "Popescu Ion", assigned_to_email: "popescu.ion@alextours.ro", due_date: "2026-05-20", created_by_name: "Alina" },
  { title: "Actualizare site - destinații noi", description: "Adăugare Bali, Japonia și Portugalia cu prețuri și galerie foto", priority: "medium", status: "in_progress", assigned_to_name: "Constantin Ana", assigned_to_email: "constantin.ana@alextours.ro", due_date: "2026-05-30", created_by_name: "Alina" },
  { title: "Pregătire tur Turcia 20 mai", description: "Logistică completă - transport, cazare, ghid, documente participanți", priority: "high", status: "done", assigned_to_name: "Dumitrescu Andrei", assigned_to_email: "dumitrescu.andrei@alextours.ro", due_date: "2026-05-18", created_by_name: "Alina" },
  { title: "Oferte corporate Q2", description: "Pachete personalizate pentru 5 companii interesate de teambuilding", priority: "high", status: "in_progress", assigned_to_name: "Serban Andreea", assigned_to_email: "serban.andreea@alextours.ro", due_date: "2026-05-28", created_by_name: "Alina" },
  { title: "Newsletter mai 2026", description: "Redactare și trimitere newsletter cu ofertele lunii", priority: "medium", status: "done", assigned_to_name: "Dinu Catalin", assigned_to_email: "dinu.catalin@alextours.ro", due_date: "2026-05-16", created_by_name: "Alina" },
  { title: "Rezolvare reclamații clienți", description: "Follow-up reclamații primite în aprilie - 3 cazuri în așteptare", priority: "high", status: "done", assigned_to_name: "Matei Raluca", assigned_to_email: "matei.raluca@alextours.ro", due_date: "2026-05-08", created_by_name: "Alina" },
  { title: "Coordonare transport aeroport", description: "Coordonare transfer aeroport pentru turul Grecia - 18 persoane", priority: "medium", status: "done", assigned_to_name: "Bucur Silviu", assigned_to_email: "bucur.silviu@alextours.ro", due_date: "2026-05-14", created_by_name: "Alina" },
  { title: "Pregătire oferte toamnă", description: "Destinații septembrie-noiembrie: Maroc, Egypt, Dubai", priority: "medium", status: "in_progress", assigned_to_name: "Popa Cristina", assigned_to_email: "popa.cristina@alextours.ro", due_date: "2026-05-31", created_by_name: "Alina" },
  { title: "Training sistem rezervări online", description: "Sesiune training pentru angajații noi pe sistemul de rezervări", priority: "low", status: "todo", assigned_to_name: "Florea Bogdan", assigned_to_email: "florea.bogdan@alextours.ro", due_date: "2026-05-29", created_by_name: "Alina" },
];

const MAY_MOOD = [
  { week: "2026-W18", date: "2026-05-04" },
  { week: "2026-W19", date: "2026-05-11" },
  { week: "2026-W20", date: "2026-05-18" },
  { week: "2026-W21", date: "2026-05-25" },
];

const MOOD_DATA = {
  "2026-05-04": ["😊","😊","😊","😐","😊","😊","😐","😊","😊","😊","😊","😊","😊","😐","😊","😊"],
  "2026-05-11": ["😊","😊","😐","😊","😊","😊","😊","😊","😊","😔","😊","😐","😊","😊","😊","😊"],
  "2026-05-18": ["😐","😊","😊","😊","😊","😔","😊","😊","😐","😊","😊","😊","😊","😊","😐","😊"],
  "2026-05-25": ["😊","😊","😊","😊","😊","😊","😊","😊","😊","😐","😔","😊","😊","😊","😊","😊"],
};

const LEAVE_DATA = [
  { employee_email: "popescu.ion@alextours.ro", employee_name: "Popescu Ion", type: "concediu_odihna", start_date: "2026-05-08", end_date: "2026-05-08", reason: "Zi personală", status: "approved" },
  { employee_email: "ionescu.maria@alextours.ro", employee_name: "Ionescu Maria", type: "concediu_odihna", start_date: "2026-05-11", end_date: "2026-05-11", reason: "Zi personală", status: "approved" },
  { employee_email: "constantin.ana@alextours.ro", employee_name: "Constantin Ana", type: "concediu_odihna", start_date: "2026-05-22", end_date: "2026-05-22", reason: "Zi personală", status: "approved" },
  { employee_email: "dumitrescu.andrei@alextours.ro", employee_name: "Dumitrescu Andrei", type: "concediu_odihna", start_date: "2026-05-12", end_date: "2026-05-12", reason: "Zi personală", status: "approved" },
  { employee_email: "nistor.laura@alextours.ro", employee_name: "Nistor Laura", type: "concediu_medical", start_date: "2026-05-20", end_date: "2026-05-20", reason: "Consultație medicală", status: "approved" },
  { employee_email: "marin.alexandru@alextours.ro", employee_name: "Marin Alexandru", type: "concediu_odihna", start_date: "2026-05-18", end_date: "2026-05-18", reason: "Zi personală", status: "approved" },
  { employee_email: "popa.cristina@alextours.ro", employee_name: "Popa Cristina", type: "concediu_odihna", start_date: "2026-05-25", end_date: "2026-05-26", reason: "Mini-vacanță", status: "pending" },
  { employee_email: "florea.bogdan@alextours.ro", employee_name: "Florea Bogdan", type: "concediu_odihna", start_date: "2026-06-02", end_date: "2026-06-06", reason: "Concediu de vară", status: "pending" },
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
  console.log("📅 Adăugare prezență mai 2026...");
  for (const emp of MAY_SCHEDULE) {
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
      } else {
        await appClient.entities.Attendance.create({
          employee_email: emp.email,
          employee_name: emp.name,
          date,
          check_in: data.ci,
          status: "present",
          work_location: data.loc,
        });
        await appClient.entities.AttendanceEvent.create({ employee_email: emp.email, employee_name: emp.name, date, time: data.ci, event_type: "check_in" });
        await appClient.entities.AttendanceEvent.create({ employee_email: emp.email, employee_name: emp.name, date, time: data.bs, event_type: "break_start" });
        await appClient.entities.AttendanceEvent.create({ employee_email: emp.email, employee_name: emp.name, date, time: data.be, event_type: "break_end" });
        await appClient.entities.AttendanceEvent.create({ employee_email: emp.email, employee_name: emp.name, date, time: data.co, event_type: "check_out" });
      }
    }
  }
  console.log("✅ Prezență gata!");
};

export const seedMessages = async () => {
  console.log("💬 Adăugare mesaje mai 2026...");
  for (const msg of MAY_MESSAGES) {
    await appClient.entities.Message.create({
      channel: msg.channel,
      channel_type: "channel",
      sender_name: msg.sender_name,
      sender_email: msg.sender_email,
      content: msg.content,
    });
  }
  console.log("✅ Mesaje gata!");
};

export const seedTasks = async () => {
  console.log("✅ Adăugare sarcini mai 2026...");
  for (const task of MAY_TASKS) {
    await appClient.entities.Task.create(task);
  }
  console.log("✅ Sarcini gata!");
};

export const seedMoodVotes = async () => {
  console.log("😊 Adăugare mood votes mai 2026...");
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
    }
  }
  console.log("✅ Mood votes gata!");
};

export const seedLeaveRequests = async () => {
  console.log("📋 Adăugare cereri concediu...");
  for (const leave of LEAVE_DATA) {
    await appClient.entities.LeaveRequest.create(leave);
  }
  console.log("✅ Cereri concediu gata!");
};

export const seedClients = async () => {
  const CLIENTS = [
    { full_name: "Dumitru Vasile", email: "dumitru.vasile@gmail.com", phone: "0721345678", city: "București", status: "activ", last_tour: "Turcia 2026", tours_count: "5", notes: "Preferă hoteluri 5 stele" },
    { full_name: "Popa Andreea", email: "popa.andreea@gmail.com", phone: "0734567890", city: "Cluj-Napoca", status: "activ", last_tour: "Grecia 2026", tours_count: "7", notes: "Client fidel, reducere 10%" },
    { full_name: "Marin Cristian", email: "marin.cristian@yahoo.com", phone: "0756789012", city: "Timișoara", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de Maldive" },
    { full_name: "Nicolescu Ioana", email: "nicolescu.ioana@gmail.com", phone: "0712345678", city: "Iași", status: "activ", last_tour: "Egipt 2025", tours_count: "3", notes: "" },
    { full_name: "Florea Alexandru", email: "florea.alex@gmail.com", phone: "0745678901", city: "Constanța", status: "inactiv", last_tour: "Bulgaria 2024", tours_count: "1", notes: "Nu a mai răspuns la oferte" },
    { full_name: "Stan Mihaela", email: "stan.mihaela@gmail.com", phone: "0723456789", city: "Brașov", status: "activ", last_tour: "Italia 2026", tours_count: "4", notes: "Preferă city break-uri" },
    { full_name: "Radu George", email: "radu.george@yahoo.com", phone: "0767890123", city: "București", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de pachete familie" },
    { full_name: "Ionescu Roxana", email: "ionescu.roxana@gmail.com", phone: "0731234567", city: "Sibiu", status: "activ", last_tour: "Spania 2025", tours_count: "6", notes: "Preferă vacanțe culturale" },
    { full_name: "Gheorghiu Dan", email: "gheorghiu.dan@yahoo.com", phone: "0742345678", city: "Galați", status: "activ", last_tour: "Dubai 2026", tours_count: "2", notes: "" },
    { full_name: "Marinescu Ana", email: "marinescu.ana@gmail.com", phone: "0753456789", city: "Ploiești", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de croaziere" },
    { full_name: "Barbu Sorin", email: "barbu.sorin@gmail.com", phone: "0708901234", city: "Bacău", status: "activ", last_tour: "Egipt 2026", tours_count: "5", notes: "Client VIP" },
    { full_name: "Alexandrescu Mihai", email: "alexandrescu.mihai@gmail.com", phone: "0721456789", city: "București", status: "activ", last_tour: "Bali 2026", tours_count: "3", notes: "Preferă destinații exotice" },
    { full_name: "Tudor Elena", email: "tudor.elena@yahoo.com", phone: "0734678901", city: "Cluj-Napoca", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de luna de miere" },
    { full_name: "Neagu Florin", email: "neagu.florin@gmail.com", phone: "0756890123", city: "Timișoara", status: "activ", last_tour: "Portugalia 2026", tours_count: "2", notes: "" },
    { full_name: "Costea Diana", email: "costea.diana@gmail.com", phone: "0712567890", city: "Iași", status: "activ", last_tour: "Thailanda 2025", tours_count: "4", notes: "Rezervă mereu pentru 2 persoane" },
    { full_name: "Preda Vasile", email: "preda.vasile@yahoo.com", phone: "0745789012", city: "Constanța", status: "inactiv", last_tour: "Grecia 2024", tours_count: "1", notes: "Nemulțumit de ultimul tur" },
    { full_name: "Popescu Catalin", email: "popescu.catalin@yahoo.com", phone: "0786789012", city: "Arad", status: "activ", last_tour: "Italia 2026", tours_count: "3", notes: "Preferă hoteluri boutique" },
    { full_name: "Niculae Maria", email: "niculae.maria@gmail.com", phone: "0797890123", city: "Pitești", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de Japonia" },
    { full_name: "Constantin Victor", email: "constantin.victor@gmail.com", phone: "0764567890", city: "Craiova", status: "activ", last_tour: "Grecia 2026", tours_count: "4", notes: "Rezervă mereu cu familia" },
    { full_name: "Barbu Sorin", email: "barbu2.sorin@gmail.com", phone: "0708901235", city: "Iași", status: "activ", last_tour: "Dubai 2026", tours_count: "2", notes: "Client nou recomandat" },
  ];
  for (const client of CLIENTS) await appClient.entities.Client.create(client);
  console.log("✅ Clienți gata!");
};

export const seedCalendar = async () => {
  const EVENTS = [
    { title: "Ședință săptămânală echipă", date: "2026-05-04", time: "10:00", duration: "60", description: "Revizuire obiective săptămânale și planificare mai", color: "teal", created_by_name: "Alina" },
    { title: "Întâlnire furnizori hoteluri", date: "2026-05-05", time: "09:00", duration: "90", description: "Negociere contracte vara 2026 - Grecia și Turcia", color: "green", created_by_name: "Alina" },
    { title: "Lansare campanie vară", date: "2026-05-07", time: "14:00", duration: "60", description: "Lansare oficială campanie marketing vara 2026", color: "amber", created_by_name: "Alina" },
    { title: "Tur Grecia - plecare", date: "2026-05-15", time: "06:00", duration: "30", description: "Plecare tur Grecia - 18 participanți, aeroport Otopeni", color: "purple", created_by_name: "Alina" },
    { title: "Ședință lunară mai", date: "2026-05-12", time: "10:00", duration: "90", description: "Raport progres mai și obiective iunie", color: "teal", created_by_name: "Alina" },
    { title: "Workshop marketing digital", date: "2026-05-20", time: "13:00", duration: "180", description: "Social media, SEO și campanii plătite - toate departamentele", color: "purple", created_by_name: "Alina" },
    { title: "Tur Turcia - plecare", date: "2026-05-20", time: "07:00", duration: "30", description: "Plecare tur Istanbul - 12 participanți", color: "amber", created_by_name: "Alina" },
    { title: "Lansare oferte toamnă 2026", date: "2026-05-27", time: "15:00", duration: "90", description: "Prezentare și lansare pachete septembrie-noiembrie 2026", color: "teal", created_by_name: "Alina" },
    { title: "Evaluare performanță Q1", date: "2026-05-28", time: "09:00", duration: "240", description: "Evaluare individuală toți angajații - sesiuni de 15 minute", color: "red", created_by_name: "Alina" },
    { title: "Team building online", date: "2026-05-29", time: "17:00", duration: "90", description: "Activitate de echipă - trivia și jocuri virtuale 🎮", color: "green", created_by_name: "Alina" },
  ];
  for (const event of EVENTS) await appClient.entities.CalendarEvent.create(event);
  console.log("✅ Calendar gata!");
};

export const seedRooms = async () => {
  const ROOMS = [
    { name: "Sala Principală", description: "Sala pentru ședințe de echipă", meeting_url: "https://meet.google.com/abc-defg-hij", topic: "Ședință săptămânală", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
    { name: "Sala Vânzări", description: "Prezentări și negocieri cu clienți", meeting_url: "https://meet.google.com/klm-nopq-rst", topic: "Prezentare oferte", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
    { name: "Sala Training", description: "Sesiuni de training și onboarding", meeting_url: "https://meet.google.com/uvw-xyz-123", topic: "Training angajați", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
    { name: "Sala Marketing", description: "Brainstorming și campanii", meeting_url: "https://meet.google.com/mkt-room-456", topic: "Strategie marketing", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
  ];
  for (const room of ROOMS) await appClient.entities.Room.create(room);
  console.log("✅ Săli gata!");
};

export const seedDatabase = async () => {
  console.log("🌱 Populare completă...");
  try {
    for (const emp of EMPLOYEES) await appClient.entities.Employee.create(emp);
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