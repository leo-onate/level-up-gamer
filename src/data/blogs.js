
export const blogPosts = [
  {
    id: "setup-economico-2025",
    title: "Cico (2025)",
    date: "2025-10-20",
    category: "Guías",
    cover: "/blogsimg/xocas.jpg", 
    excerpt: "Componentes clave, periféricos y trucos para que rinda sin gastar de más.",
    content: `
    En esta guía te muestro qué priorizar para un setup económico:
    1) Monitor 1080p 144Hz (si juegas shooters).
    2) SSD NVMe 500GB (Windows + juegos).
    3) Mouse con buen sensor (no es necesario que sea caro).
    Consejos extra:
    - Mantén drivers y BIOS al día.
    - Limpia el polvo para evitar throttling.
    `
  },
  {
    id: "mejores-gratis-octubre",
    title: "Top juegos gratuitos del mes (PC, PlayStation, Xbox)",
    date: "2025-10-05",
    category: "Noticias",
    cover: "/blogsimg/juegos.jpg",
    excerpt: "Nuestro resumen mensual de los mejores juegos free-to-play.",
    content: `
    Este mes destacan:
    - Fortnite (PC/Consolas): ritmo rápido, equipos, destructibilidad.
    - Warframe (PC/Consolas): acción cooperativa, progreso profundo.
    - Rocket League: ideal para jugar con amigos y progresar en mecánicas.
    `
  },
  {
    id: "comparativa-mouses-2025",
    title: "Comparativa: 5 mouses gamer que valen la pena (2025)",
    date: "2025-09-25",
    category: "Reseñas",
    cover: "/blogsimg/mouse.jpeg",
    excerpt: "Sensor, peso, forma y switches: lo que realmente importa.",
    content: `
    Probamos 5 modelos populares:
    - Modelo Logitech G Pro: liviano, ideal claw grip.
    - Modelo Razer DeathAdder: batería duradera, buen software.
    - Modelo SteelSeries Rival 3: económicos y rendidores.
    -Modelo Corsair M65: peso ajustable, precisión.
    - Modelo HyperX Pulsefire: buena ergonomía, RGB personalizable.
    Conclusión: compra por forma y peso, no por RGB.
    `
  }
];

// Útil para formatear la fecha como "20 oct 2025"
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit", month: "short", year: "numeric"
  });
}
