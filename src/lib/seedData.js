import { appClient } from "@/api/appClient";

const EMPLOYEES = [
  { full_name: "Popescu Ion", email: "popescu.ion@alextours.ro", role: "tour_guide", department: "Operations", status: "active", productivity_score: 85, current_status: "acasa", gender: "m" },
  { full_name: "Ionescu Maria", email: "ionescu.maria@alextours.ro", role: "booking_agent", department: "Sales", status: "active", productivity_score: 92, current_status: "acasa", gender: "f" },
  { full_name: "Constantin Ana", email: "constantin.ana@alextours.ro", role: "marketing", department: "Marketing", status: "active", productivity_score: 78, current_status: "acasa", gender: "f" },
  { full_name: "Gheorghe Mihai", email: "gheorghe.mihai@alextours.ro", role: "customer_support", department: "Customer Service", status: "active", productivity_score: 88, current_status: "acasa", gender: "m" },
  { full_name: "Stanescu Elena", email: "stanescu.elena@alextours.ro", role: "finance", department: "Finance", status: "active", productivity_score: 95, current_status: "acasa", gender: "f" },
  { full_name: "Dumitrescu Andrei", email: "dumitrescu.andrei@alextours.ro", role: "tour_guide", department: "Operations", status: "active", productivity_score: 82, current_status: "acasa", gender: "m" },
  { full_name: "Popa Cristina", email: "popa.cristina@alextours.ro", role: "booking_agent", department: "Sales", status: "active", productivity_score: 89, current_status: "acasa", gender: "f" },
  { full_name: "Marin Alexandru", email: "marin.alexandru@alextours.ro", role: "operations", department: "Operations", status: "active", productivity_score: 76, current_status: "acasa", gender: "m" },
  { full_name: "Nistor Laura", email: "nistor.laura@alextours.ro", role: "marketing", department: "Marketing", status: "active", productivity_score: 91, current_status: "acasa", gender: "f" },
  { full_name: "Florea Bogdan", email: "florea.bogdan@alextours.ro", role: "customer_support", department: "Customer Service", status: "active", productivity_score: 84, current_status: "acasa", gender: "m" },
  { full_name: "Rusu Ioana", email: "rusu.ioana@alextours.ro", role: "finance", department: "Finance", status: "active", productivity_score: 93, current_status: "acasa", gender: "f" },
];

const SCHEDULE = [
  { email: "popescu.ion@alextours.ro", name: "Popescu Ion", ci: ["09:02","08:55","09:10","09:00","08:48","09:05","08:58","09:03","08:50","09:15","09:00","08:45","09:08","09:02","08:55","09:10","09:00","08:48","09:05","08:58","09:03","08:50"], bs: ["12:30","12:45","13:00","12:30","12:15","12:40","12:35","12:30","12:45","13:00","12:30","12:15","12:40","12:35","12:30","12:45","13:00","12:30","12:15","12:40","12:35","12:30"], be: ["13:00","13:15","13:30","13:00","12:45","13:10","13:05","13:00","13:15","13:30","13:00","12:45","13:10","13:05","13:00","13:15","13:30","13:00","12:45","13:10","13:05","13:00"], co: ["17:30","17:45","17:20","18:00","17:15","17:30","17:45","17:30","17:45","17:20","18:00","17:15","17:30","17:45","17:30","17:45","17:20","18:00","17:15","17:30","17:45","17:30"], loc: ["acasa","teren","acasa","sedinta","acasa","teren","acasa","acasa","teren","acasa","sedinta","acasa","teren","acasa","acasa","teren","acasa","sedinta","acasa","teren","acasa","acasa"], abs: [3,8,15] },
  { email: "ionescu.maria@alextours.ro", name: "Ionescu Maria", ci: ["08:45","08:50","09:00","08:40","08:55","09:05","08:45","08:50","09:00","08:40","08:55","09:05","08:45","08:50","09:00","08:40","08:55","09:05","08:45","08:50","09:00","08:40"], bs: ["12:00","12:30","12:15","12:00","12:30","12:45","12:00","12:30","12:15","12:00","12:30","12:45","12:00","12:30","12:15","12:00","12:30","12:45","12:00","12:30","12:15","12:00"], be: ["12:30","13:00","12:45","12:30","13:00","13:15","12:30","13:00","12:45","12:30","13:00","13:15","12:30","13:00","12:45","12:30","13:00","13:15","12:30","13:00","12:45","12:30"], co: ["17:00","17:30","17:15","17:00","17:30","17:45","17:00","17:30","17:15","17:00","17:30","17:45","17:00","17:30","17:15","17:00","17:30","17:45","17:00","17:30","17:15","17:00"], loc: ["acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa"], abs: [5,12] },
  { email: "constantin.ana@alextours.ro", name: "Constantin Ana", ci: ["09:15","09:00","09:20","09:10","09:05","09:15","09:00","09:20","09:10","09:05","09:15","09:00","09:20","09:10","09:05","09:15","09:00","09:20","09:10","09:05","09:15","09:00"], bs: ["13:00","12:30","13:15","13:00","12:30","13:00","12:30","13:15","13:00","12:30","13:00","12:30","13:15","13:00","12:30","13:00","12:30","13:15","13:00","12:30","13:00","12:30"], be: ["13:30","13:00","13:45","13:30","13:00","13:30","13:00","13:45","13:30","13:00","13:30","13:00","13:45","13:30","13:00","13:30","13:00","13:45","13:30","13:00","13:30","13:00"], co: ["17:45","17:30","18:00","17:45","17:30","17:45","17:30","18:00","17:45","17:30","17:45","17:30","18:00","17:45","17:30","17:45","17:30","18:00","17:45","17:30","17:45","17:30"], loc: ["acasa","teren","acasa","teren","acasa","acasa","teren","acasa","teren","acasa","acasa","teren","acasa","teren","acasa","acasa","teren","acasa","teren","acasa","acasa","teren"], abs: [7,14,21] },
  { email: "gheorghe.mihai@alextours.ro", name: "Gheorghe Mihai", ci: ["09:00","09:30","09:00","09:05","09:00","08:55","09:00","09:30","09:00","09:05","09:00","08:55","09:00","09:30","09:00","09:05","09:00","08:55","09:00","09:30","09:00","09:05"], bs: ["12:30","13:00","12:30","12:00","12:30","12:30","12:30","13:00","12:30","12:00","12:30","12:30","12:30","13:00","12:30","12:00","12:30","12:30","12:30","13:00","12:30","12:00"], be: ["13:00","13:30","13:00","12:30","13:00","13:00","13:00","13:30","13:00","12:30","13:00","13:00","13:00","13:30","13:00","12:30","13:00","13:00","13:00","13:30","13:00","12:30"], co: ["17:30","18:00","17:30","17:00","17:30","17:30","17:30","18:00","17:30","17:00","17:30","17:30","17:30","18:00","17:30","17:00","17:30","17:30","17:30","18:00","17:30","17:00"], loc: ["acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa"], abs: [10,17] },
  { email: "stanescu.elena@alextours.ro", name: "Stanescu Elena", ci: ["08:30","08:45","08:30","08:40","08:30","08:45","08:30","08:45","08:30","08:40","08:30","08:45","08:30","08:45","08:30","08:40","08:30","08:45","08:30","08:45","08:30","08:40"], bs: ["12:00","12:15","12:00","12:00","12:00","12:15","12:00","12:15","12:00","12:00","12:00","12:15","12:00","12:15","12:00","12:00","12:00","12:15","12:00","12:15","12:00","12:00"], be: ["12:30","12:45","12:30","12:30","12:30","12:45","12:30","12:45","12:30","12:30","12:30","12:45","12:30","12:45","12:30","12:30","12:30","12:45","12:30","12:45","12:30","12:30"], co: ["16:30","17:00","16:45","17:00","16:30","17:00","16:30","17:00","16:45","17:00","16:30","17:00","16:30","17:00","16:45","17:00","16:30","17:00","16:30","17:00","16:45","17:00"], loc: ["acasa","acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta"], abs: [2] },
  { email: "dumitrescu.andrei@alextours.ro", name: "Dumitrescu Andrei", ci: ["08:55","09:05","09:00","08:50","09:10","08:45","09:00","08:55","09:05","09:00","08:50","09:10","08:45","09:00","08:55","09:05","09:00","08:50","09:10","08:45","09:00","08:55"], bs: ["12:30","13:00","12:30","12:15","12:45","12:00","12:30","12:30","13:00","12:30","12:15","12:45","12:00","12:30","12:30","13:00","12:30","12:15","12:45","12:00","12:30","12:30"], be: ["13:00","13:30","13:00","12:45","13:15","12:30","13:00","13:00","13:30","13:00","12:45","13:15","12:30","13:00","13:00","13:30","13:00","12:45","13:15","12:30","13:00","13:00"], co: ["17:30","18:00","17:30","17:15","17:45","17:00","17:30","17:30","18:00","17:30","17:15","17:45","17:00","17:30","17:30","18:00","17:30","17:15","17:45","17:00","17:30","17:30"], loc: ["teren","acasa","teren","acasa","sedinta","acasa","teren","teren","acasa","teren","acasa","sedinta","acasa","teren","teren","acasa","teren","acasa","sedinta","acasa","teren","teren"], abs: [4,11,18] },
  { email: "popa.cristina@alextours.ro", name: "Popa Cristina", ci: ["08:50","09:00","08:45","09:10","08:55","09:00","08:50","09:00","08:45","09:10","08:55","09:00","08:50","09:00","08:45","09:10","08:55","09:00","08:50","09:00","08:45","09:10"], bs: ["12:15","12:30","12:00","12:45","12:30","12:15","12:15","12:30","12:00","12:45","12:30","12:15","12:15","12:30","12:00","12:45","12:30","12:15","12:15","12:30","12:00","12:45"], be: ["12:45","13:00","12:30","13:15","13:00","12:45","12:45","13:00","12:30","13:15","13:00","12:45","12:45","13:00","12:30","13:15","13:00","12:45","12:45","13:00","12:30","13:15"], co: ["17:15","17:30","17:00","17:45","17:30","17:15","17:15","17:30","17:00","17:45","17:30","17:15","17:15","17:30","17:00","17:45","17:30","17:15","17:15","17:30","17:00","17:45"], loc: ["acasa","acasa","acasa","teren","acasa","sedinta","acasa","acasa","acasa","teren","acasa","sedinta","acasa","acasa","acasa","teren","acasa","sedinta","acasa","acasa","acasa","teren"], abs: [6,13] },
  { email: "marin.alexandru@alextours.ro", name: "Marin Alexandru", ci: ["09:10","09:00","08:55","09:15","09:05","08:50","09:10","09:00","08:55","09:15","09:05","08:50","09:10","09:00","08:55","09:15","09:05","08:50","09:10","09:00","08:55","09:15"], bs: ["12:45","12:30","12:15","13:00","12:30","12:00","12:45","12:30","12:15","13:00","12:30","12:00","12:45","12:30","12:15","13:00","12:30","12:00","12:45","12:30","12:15","13:00"], be: ["13:15","13:00","12:45","13:30","13:00","12:30","13:15","13:00","12:45","13:30","13:00","12:30","13:15","13:00","12:45","13:30","13:00","12:30","13:15","13:00","12:45","13:30"], co: ["17:45","17:30","17:15","18:00","17:30","17:00","17:45","17:30","17:15","18:00","17:30","17:00","17:45","17:30","17:15","18:00","17:30","17:00","17:45","17:30","17:15","18:00"], loc: ["teren","acasa","acasa","teren","sedinta","acasa","teren","acasa","acasa","teren","sedinta","acasa","teren","acasa","acasa","teren","sedinta","acasa","teren","acasa","acasa","teren"], abs: [9,16] },
  { email: "nistor.laura@alextours.ro", name: "Nistor Laura", ci: ["08:40","08:55","09:05","08:45","09:00","08:50","08:40","08:55","09:05","08:45","09:00","08:50","08:40","08:55","09:05","08:45","09:00","08:50","08:40","08:55","09:05","08:45"], bs: ["12:10","12:25","12:35","12:15","12:30","12:20","12:10","12:25","12:35","12:15","12:30","12:20","12:10","12:25","12:35","12:15","12:30","12:20","12:10","12:25","12:35","12:15"], be: ["12:40","12:55","13:05","12:45","13:00","12:50","12:40","12:55","13:05","12:45","13:00","12:50","12:40","12:55","13:05","12:45","13:00","12:50","12:40","12:55","13:05","12:45"], co: ["17:10","17:25","17:35","17:15","17:30","17:20","17:10","17:25","17:35","17:15","17:30","17:20","17:10","17:25","17:35","17:15","17:30","17:20","17:10","17:25","17:35","17:15"], loc: ["acasa","marketing","acasa","acasa","teren","acasa","acasa","marketing","acasa","acasa","teren","acasa","acasa","marketing","acasa","acasa","teren","acasa","acasa","marketing","acasa","acasa"], abs: [1,19] },
  { email: "florea.bogdan@alextours.ro", name: "Florea Bogdan", ci: ["09:05","08:50","09:15","09:00","08:45","09:10","09:05","08:50","09:15","09:00","08:45","09:10","09:05","08:50","09:15","09:00","08:45","09:10","09:05","08:50","09:15","09:00"], bs: ["12:35","12:20","12:45","12:30","12:15","12:40","12:35","12:20","12:45","12:30","12:15","12:40","12:35","12:20","12:45","12:30","12:15","12:40","12:35","12:20","12:45","12:30"], be: ["13:05","12:50","13:15","13:00","12:45","13:10","13:05","12:50","13:15","13:00","12:45","13:10","13:05","12:50","13:15","13:00","12:45","13:10","13:05","12:50","13:15","13:00"], co: ["17:35","17:20","17:45","17:30","17:15","17:40","17:35","17:20","17:45","17:30","17:15","17:40","17:35","17:20","17:45","17:30","17:15","17:40","17:35","17:20","17:45","17:30"], loc: ["acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa","acasa","teren","acasa","acasa","sedinta","acasa"], abs: [20] },
  { email: "rusu.ioana@alextours.ro", name: "Rusu Ioana", ci: ["08:35","08:50","08:40","08:55","08:30","08:45","08:35","08:50","08:40","08:55","08:30","08:45","08:35","08:50","08:40","08:55","08:30","08:45","08:35","08:50","08:40","08:55"], bs: ["12:05","12:20","12:10","12:25","12:00","12:15","12:05","12:20","12:10","12:25","12:00","12:15","12:05","12:20","12:10","12:25","12:00","12:15","12:05","12:20","12:10","12:25"], be: ["12:35","12:50","12:40","12:55","12:30","12:45","12:35","12:50","12:40","12:55","12:30","12:45","12:35","12:50","12:40","12:55","12:30","12:45","12:35","12:50","12:40","12:55"], co: ["16:35","16:50","16:40","16:55","16:30","16:45","16:35","16:50","16:40","16:55","16:30","16:45","16:35","16:50","16:40","16:55","16:30","16:45","16:35","16:50","16:40","16:55"], loc: ["acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta","acasa","acasa","acasa","acasa","acasa","sedinta","acasa"], abs: [] },
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
    { channel: "general", channel_type: "channel", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: "Bună dimineața echipei! 👋" },
    { channel: "general", channel_type: "channel", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Am finalizat pachetele pentru sezonul următor!" },
    { channel: "tours", channel_type: "channel", sender_name: "Dumitrescu Andrei", sender_email: "dumitrescu.andrei@alextours.ro", content: "Avem 5 rezervări noi luna aceasta!" },
    { channel: "bookings", channel_type: "channel", sender_name: "Popa Cristina", sender_email: "popa.cristina@alextours.ro", content: "Client nou - pachet all-inclusive confirmat!" },
    { channel: "marketing", channel_type: "channel", sender_name: "Nistor Laura", sender_email: "nistor.laura@alextours.ro", content: `Campania lunii ${monthStr} a generat 200 lead-uri noi!` },
    { channel: "general", channel_type: "channel", sender_name: "Rusu Ioana", sender_email: "rusu.ioana@alextours.ro", content: "Raportul financiar e gata!" },
    { channel: "random", channel_type: "channel", sender_name: "Florea Bogdan", sender_email: "florea.bogdan@alextours.ro", content: "Cineva vrea cafea? ☕" },
    { channel: "general", channel_type: "channel", sender_name: "Marin Alexandru", sender_email: "marin.alexandru@alextours.ro", content: "Operațiunile pentru luna viitoare sunt planificate!" },
  ];
};

const generateTasks = (year, month) => {
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  const destinations = ["Grecia", "Turcia", "Italia", "Spania", "Egipt", "Dubai"];
  const dest = destinations[month % destinations.length];
  const isDone = month < new Date().getMonth() + 1;
  return [
    { title: `Ofertă ${dest} ${year}`, description: `Pachet turistic ${dest}`, priority: "high", status: isDone ? "done" : "in_progress", assigned_to_name: "Ionescu Maria", assigned_to_email: "ionescu.maria@alextours.ro", due_date: `${monthStr}-10`, created_by_name: "Alina" },
    { title: `Campanie social media ${dest}`, description: `Postări pentru ${dest}`, priority: "medium", status: isDone ? "done" : "in_progress", assigned_to_name: "Nistor Laura", assigned_to_email: "nistor.laura@alextours.ro", due_date: `${monthStr}-15`, created_by_name: "Alina" },
    { title: `Raport lunar ${monthStr}`, description: "Compilare date", priority: "high", status: isDone ? "done" : "todo", assigned_to_name: "Rusu Ioana", assigned_to_email: "rusu.ioana@alextours.ro", due_date: `${monthStr}-25`, created_by_name: "Alina" },
    { title: `Negociere furnizori ${dest}`, description: "Contracte și prețuri", priority: "medium", status: isDone ? "done" : "todo", assigned_to_name: "Popescu Ion", assigned_to_email: "popescu.ion@alextours.ro", due_date: `${monthStr}-20`, created_by_name: "Alina" },
    { title: "Training echipă", description: "Sesiune onboarding", priority: "low", status: isDone ? "done" : "todo", assigned_to_name: "Florea Bogdan", assigned_to_email: "florea.bogdan@alextours.ro", due_date: `${monthStr}-28`, created_by_name: "Alina" },
    { title: `Rezervări ${dest} confirmate`, description: "Confirmare rezervări clienți", priority: "high", status: isDone ? "done" : "in_progress", assigned_to_name: "Popa Cristina", assigned_to_email: "popa.cristina@alextours.ro", due_date: `${monthStr}-12`, created_by_name: "Alina" },
    { title: "Actualizare site web", description: "Destinații noi pe site", priority: "medium", status: isDone ? "done" : "todo", assigned_to_name: "Constantin Ana", assigned_to_email: "constantin.ana@alextours.ro", due_date: `${monthStr}-18`, created_by_name: "Alina" },
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
];

const CALENDAR_EVENTS = [
  { title: "Ședință săptămânală echipă", date: "2026-04-06", time: "10:00", duration: "60", description: "Revizuire obiective", color: "teal", created_by_name: "Alina" },
  { title: "Prezentare oferte vara 2026", date: "2026-04-15", time: "14:00", duration: "90", description: "Pachete noi pentru clienți", color: "purple", created_by_name: "Alina" },
  { title: "Training sistem rezervări", date: "2026-04-22", time: "11:00", duration: "120", description: "Training angajați noi", color: "amber", created_by_name: "Alina" },
  { title: "Întâlnire furnizori", date: "2026-05-05", time: "09:00", duration: "60", description: "Negociere contracte", color: "green", created_by_name: "Alina" },
  { title: "Ședință lunară", date: "2026-05-12", time: "10:00", duration: "60", description: "Raport mai", color: "teal", created_by_name: "Alina" },
  { title: "Workshop marketing digital", date: "2026-05-20", time: "13:00", duration: "180", description: "Social media și SEO", color: "purple", created_by_name: "Alina" },
  { title: "Ședință trimestrială", date: "2026-06-03", time: "10:00", duration: "120", description: "Raport trimestrul 2", color: "teal", created_by_name: "Alina" },
  { title: "Lansare oferte toamnă", date: "2026-06-15", time: "14:00", duration: "90", description: "Prezentare destinații toamnă", color: "amber", created_by_name: "Alina" },
  { title: "Team building online", date: "2026-06-26", time: "16:00", duration: "120", description: "Activitate echipă", color: "green", created_by_name: "Alina" },
  { title: "Ședință lunară iulie", date: "2026-07-07", time: "10:00", duration: "60", description: "Raport iulie", color: "teal", created_by_name: "Alina" },
  { title: "Evaluare performanță", date: "2026-07-20", time: "09:00", duration: "180", description: "Evaluare semestrială angajați", color: "red", created_by_name: "Alina" },
  { title: "Planificare sezon toamnă", date: "2026-08-04", time: "10:00", duration: "90", description: "Strategie septembrie-noiembrie", color: "purple", created_by_name: "Alina" },
  { title: "Ședință finală august", date: "2026-08-18", time: "10:00", duration: "60", description: "Raport august", color: "teal", created_by_name: "Alina" },
];

const ROOMS = [
  { name: "Sala Principală", description: "Sala pentru ședințe de echipă", meeting_url: "https://meet.google.com/abc-defg-hij", topic: "Ședință săptămânală", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
  { name: "Sala Vânzări", description: "Prezentări și negocieri cu clienți", meeting_url: "https://meet.google.com/klm-nopq-rst", topic: "Prezentare oferte", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
  { name: "Sala Training", description: "Sesiuni de training și onboarding", meeting_url: "https://meet.google.com/uvw-xyz-123", topic: "Training angajați", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
  { name: "Sala Marketing", description: "Brainstorming și campanii", meeting_url: "https://meet.google.com/mkt-room-456", topic: "Strategie marketing", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
];

export const seedDatabase = async () => {
  console.log("🌱 Începe popularea bazei de date...");
  try {
    console.log("👥 Adăugare angajați...");
    for (const emp of EMPLOYEES) {
      await appClient.entities.Employee.create(emp);
    }

    console.log("📅 Adăugare date martie-august 2026...");
    for (let month = 3; month <= 8; month++) {
      console.log(`  Luna ${month}...`);
      const { records, events } = generateMonthData(2026, month);
      for (const rec of records) await appClient.entities.Attendance.create(rec);
      for (const ev of events) await appClient.entities.AttendanceEvent.create(ev);
      const msgs = generateMessages(2026, month);
      for (const msg of msgs) await appClient.entities.Message.create(msg);
      const tasksList = generateTasks(2026, month);
      for (const task of tasksList) await appClient.entities.Task.create(task);
    }

    console.log("👤 Adăugare clienți...");
    for (const client of CLIENTS) await appClient.entities.Client.create(client);

    console.log("📆 Adăugare calendar...");
    for (const event of CALENDAR_EVENTS) await appClient.entities.CalendarEvent.create(event);

    console.log("🏠 Adăugare săli...");
    for (const room of ROOMS) await appClient.entities.Room.create(room);

    console.log("✅ Gata!");
    return true;
  } catch (err) {
    console.error("❌ Eroare:", err);
    return false;
  }
};