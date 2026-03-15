import { appClient } from "@/api/appClient";

const employees = [
  { full_name: "Popescu Ion", email: "popescu.ion@alextours.ro", role: "tour_guide", department: "Operations", status: "active", productivity_score: 85, current_status: "acasa" },
  { full_name: "Ionescu Maria", email: "ionescu.maria@alextours.ro", role: "booking_agent", department: "Sales", status: "active", productivity_score: 92, current_status: "acasa" },
  { full_name: "Constantin Ana", email: "constantin.ana@alextours.ro", role: "marketing", department: "Marketing", status: "active", productivity_score: 78, current_status: "acasa" },
  { full_name: "Gheorghe Mihai", email: "gheorghe.mihai@alextours.ro", role: "customer_support", department: "Customer Service", status: "active", productivity_score: 88, current_status: "acasa" },
  { full_name: "Stanescu Elena", email: "stanescu.elena@alextours.ro", role: "finance", department: "Finance", status: "active", productivity_score: 95, current_status: "acasa" },
];

const tasks = [
  { title: "Pregătire ofertă Grecia 2026", description: "Creare pachet turistic pentru sezonul estival", priority: "high", status: "in_progress", assigned_to_name: "Ionescu Maria", assigned_to_email: "ionescu.maria@alextours.ro", due_date: "2026-04-01", created_by_name: "Alina" },
  { title: "Actualizare site web", description: "Adăugare destinații noi pentru vara 2026", priority: "medium", status: "todo", assigned_to_name: "Constantin Ana", assigned_to_email: "constantin.ana@alextours.ro", due_date: "2026-03-20", created_by_name: "Alina" },
  { title: "Raport lunar vânzări", description: "Compilare date vânzări februarie 2026", priority: "high", status: "done", assigned_to_name: "Stanescu Elena", assigned_to_email: "stanescu.elena@alextours.ro", due_date: "2026-03-05", created_by_name: "Alina" },
  { title: "Contactare furnizori hoteluri", description: "Negociere contracte pentru sezon", priority: "medium", status: "in_progress", assigned_to_name: "Popescu Ion", assigned_to_email: "popescu.ion@alextours.ro", due_date: "2026-03-25", created_by_name: "Alina" },
  { title: "Campanie social media Paste", description: "Creare conținut pentru sărbători", priority: "low", status: "todo", assigned_to_name: "Constantin Ana", assigned_to_email: "constantin.ana@alextours.ro", due_date: "2026-03-30", created_by_name: "Alina" },
  { title: "Training angajați noi", description: "Sesiune de onboarding pentru noii colegi", priority: "medium", status: "todo", assigned_to_name: "Gheorghe Mihai", assigned_to_email: "gheorghe.mihai@alextours.ro", due_date: "2026-03-22", created_by_name: "Alina" },
];

const attendance = [
  { employee_name: "Popescu Ion", employee_email: "popescu.ion@alextours.ro", date: "2026-03-13", check_in: "09:00", status: "present", work_location: "acasa" },
  { employee_name: "Ionescu Maria", employee_email: "ionescu.maria@alextours.ro", date: "2026-03-13", check_in: "08:45", status: "present", work_location: "acasa" },
  { employee_name: "Constantin Ana", employee_email: "constantin.ana@alextours.ro", date: "2026-03-13", check_in: "09:15", status: "present", work_location: "teren" },
  { employee_name: "Gheorghe Mihai", employee_email: "gheorghe.mihai@alextours.ro", date: "2026-03-13", check_in: "09:00", status: "present", work_location: "acasa" },
  { employee_name: "Stanescu Elena", employee_email: "stanescu.elena@alextours.ro", date: "2026-03-13", check_in: "08:30", status: "present", work_location: "acasa" },
  { employee_name: "Popescu Ion", employee_email: "popescu.ion@alextours.ro", date: "2026-03-12", check_in: "09:10", status: "present", work_location: "acasa" },
  { employee_name: "Ionescu Maria", employee_email: "ionescu.maria@alextours.ro", date: "2026-03-12", check_in: "08:50", status: "present", work_location: "acasa" },
  { employee_name: "Constantin Ana", employee_email: "constantin.ana@alextours.ro", date: "2026-03-12", check_in: "09:00", status: "absent", work_location: "acasa" },
  { employee_name: "Gheorghe Mihai", employee_email: "gheorghe.mihai@alextours.ro", date: "2026-03-12", check_in: "09:30", status: "present", work_location: "sedinta" },
  { employee_name: "Stanescu Elena", employee_email: "stanescu.elena@alextours.ro", date: "2026-03-12", check_in: "08:45", status: "present", work_location: "acasa" },
  { employee_name: "Popescu Ion", employee_email: "popescu.ion@alextours.ro", date: "2026-03-11", check_in: "09:00", status: "present", work_location: "teren" },
  { employee_name: "Ionescu Maria", employee_email: "ionescu.maria@alextours.ro", date: "2026-03-11", check_in: "09:00", status: "present", work_location: "acasa" },
  { employee_name: "Constantin Ana", employee_email: "constantin.ana@alextours.ro", date: "2026-03-11", check_in: "09:00", status: "present", work_location: "acasa" },
  { employee_name: "Gheorghe Mihai", employee_email: "gheorghe.mihai@alextours.ro", date: "2026-03-11", check_in: "09:00", status: "absent", work_location: "acasa" },
  { employee_name: "Stanescu Elena", employee_email: "stanescu.elena@alextours.ro", date: "2026-03-11", check_in: "08:30", status: "present", work_location: "acasa" },
];

const messages = [
  { channel: "general", channel_type: "channel", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: "Bună dimineața tuturor! 👋" },
  { channel: "general", channel_type: "channel", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Bună! Astăzi am întâlnire cu furnizorul de la Rhodos." },
  { channel: "general", channel_type: "channel", sender_name: "Constantin Ana", sender_email: "constantin.ana@alextours.ro", content: "Am postat noile oferte de Paște pe Instagram! Verificați!" },
  { channel: "tours", channel_type: "channel", sender_name: "Popescu Ion", sender_email: "popescu.ion@alextours.ro", content: "Pachetul Grecia 7 nopți este gata de publicare." },
  { channel: "tours", channel_type: "channel", sender_name: "Ionescu Maria", sender_email: "ionescu.maria@alextours.ro", content: "Prețul pentru Santorini trebuie actualizat, am primit oferta nouă." },
  { channel: "bookings", channel_type: "channel", sender_name: "Gheorghe Mihai", sender_email: "gheorghe.mihai@alextours.ro", content: "Avem 3 rezervări noi pentru Turcia în această săptămână!" },
  { channel: "marketing", channel_type: "channel", sender_name: "Constantin Ana", sender_email: "constantin.ana@alextours.ro", content: "Campania de Paște a generat 150 de lead-uri noi. Excelent!" },
];

const clients = [
  { full_name: "Dumitru Vasile", email: "dumitru.vasile@gmail.com", phone: "0721345678", city: "București", status: "activ", last_tour: "Turcia 2025", tours_count: "3", notes: "Preferă hoteluri 5 stele" },
  { full_name: "Popa Andreea", email: "popa.andreea@gmail.com", phone: "0734567890", city: "Cluj-Napoca", status: "activ", last_tour: "Grecia 2025", tours_count: "5", notes: "Client fidel, reducere 10%" },
  { full_name: "Marin Cristian", email: "marin.cristian@yahoo.com", phone: "0756789012", city: "Timișoara", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de Maldive" },
  { full_name: "Nicolescu Ioana", email: "nicolescu.ioana@gmail.com", phone: "0712345678", city: "Iași", status: "activ", last_tour: "Egipt 2025", tours_count: "2", notes: "" },
  { full_name: "Florea Alexandru", email: "florea.alex@gmail.com", phone: "0745678901", city: "Constanța", status: "inactiv", last_tour: "Bulgaria 2024", tours_count: "1", notes: "Nu a mai răspuns la oferte" },
  { full_name: "Stan Mihaela", email: "stan.mihaela@gmail.com", phone: "0723456789", city: "Brașov", status: "activ", last_tour: "Italia 2025", tours_count: "4", notes: "Preferă city break-uri" },
  { full_name: "Radu George", email: "radu.george@yahoo.com", phone: "0767890123", city: "București", status: "prospect", last_tour: "", tours_count: "0", notes: "Interesat de pachete familie" },
];

const calendarEvents = [
  { title: "Ședință săptămânală echipă", date: "2026-03-16", time: "10:00", duration: "60", description: "Revizuire obiective săptămână", color: "teal", created_by_name: "Alina" },
  { title: "Prezentare oferte vara 2026", date: "2026-03-18", time: "14:00", duration: "90", description: "Prezentare pachete noi pentru clienți", color: "purple", created_by_name: "Alina" },
  { title: "Training sistem rezervări", date: "2026-03-20", time: "11:00", duration: "120", description: "Sesiune training pentru angajați noi", color: "amber", created_by_name: "Alina" },
  { title: "Întâlnire furnizori hoteluri", date: "2026-03-25", time: "09:00", duration: "60", description: "Negociere contracte sezon estival", color: "green", created_by_name: "Alina" },
  { title: "Deadline raport lunar", date: "2026-03-31", time: "17:00", duration: "30", description: "Termen limită raport financiar martie", color: "red", created_by_name: "Alina" },
];

const rooms = [
  { name: "Sala Principală", description: "Sala pentru ședințe de echipă", meeting_url: "https://meet.google.com/abc-defg-hij", topic: "Ședință săptămânală", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
  { name: "Sala Vânzări", description: "Prezentări și negocieri cu clienți", meeting_url: "https://meet.google.com/klm-nopq-rst", topic: "Prezentare oferte", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
  { name: "Sala Training", description: "Sesiuni de training și onboarding", meeting_url: "https://meet.google.com/uvw-xyz-123", topic: "Training angajați", status: "available", current_participants: 0, scheduled_by_name: "Alina" },
];

export const seedDatabase = async () => {
  console.log("🌱 Începe popularea bazei de date...");

  try {
    console.log("👥 Adăugare angajați...");
    for (const emp of employees) {
      await appClient.entities.Employee.create(emp);
    }

    console.log("✅ Adăugare sarcini...");
    for (const task of tasks) {
      await appClient.entities.Task.create(task);
    }

    console.log("📅 Adăugare prezență...");
    for (const rec of attendance) {
      await appClient.entities.Attendance.create(rec);
    }

    console.log("💬 Adăugare mesaje...");
    for (const msg of messages) {
      await appClient.entities.Message.create(msg);
    }

    console.log("👤 Adăugare clienți...");
    for (const client of clients) {
      await appClient.entities.Client.create(client);
    }

    console.log("📆 Adăugare evenimente calendar...");
    for (const event of calendarEvents) {
      await appClient.entities.CalendarEvent.create(event);
    }

    console.log("🏠 Adăugare săli...");
    for (const room of rooms) {
      await appClient.entities.Room.create(room);
    }

    console.log("✅ Baza de date populată cu succes!");
    return true;
  } catch (err) {
    console.error("❌ Eroare:", err);
    return false;
  }
};