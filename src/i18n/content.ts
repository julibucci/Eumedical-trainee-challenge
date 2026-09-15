import type { Language } from "../store/languageStore";

type NavLink = { href: string; label: string };

export type SiteContent = {
  header: {
    nav: NavLink[];
    cta: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    titleBlue: string;
    titleGreen: string;
    subtitle: string;
    stats: { paises: string; idiomas: string; disponibilidad: string };
  };
  capabilitiesBento: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    moreInfo: string;
    items: Record<string, { title: string; description: string; detail: string }>;
  };
  servicesJourney: {
    eyebrow: string;
    title: string;
    steps: Record<string, string>;
    moreLink: string;
  };
  extendedServicesGrid: {
    eyebrow: string;
    title: string;
    categories: Record<string, string>;
    descriptions: Record<string, string>;
  };
  coverageBlock: {
    eyebrow: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
  };
  trustMetrics: {
    title: string;
    metrics: Record<string, string>;
  };
  testimonialsCarousel: {
    title: string;
    prevAria: string;
    nextAria: string;
    regionAria: string;
    items: Record<string, { text: string; location: string }>;
  };
  closingCta: {
    titleLead: string;
    titleHighlight: string;
    subtitle: string;
    cta: string;
  };
  contactSection: {
    eyebrow: string;
    title: string;
    address: string;
    linkedinAriaReal: string;
    linkedinAriaPlaceholder: string;
    form: {
      nombre: string;
      apellido: string;
      email: string;
      emailPlaceholder: string;
      mensaje: string;
      privacyPrefix: string;
      privacyLink: string;
      privacySuffix: string;
      submit: string;
      errors: { nombre: string; apellido: string; email: string; mensaje: string; aceptaTerminos: string };
    };
    success: { title: string; message: string; resetLink: string };
  };
  footer: {
    nav: NavLink[];
    joinUs: string;
    terms: string;
    privacy: string;
  };
};

export const content: Record<Language, SiteContent> = {
  es: {
    header: {
      nav: [
        { href: "#servicios", label: "Servicios" },
        { href: "#cobertura", label: "Cobertura" },
        { href: "#nosotros", label: "Sobre nosotros" },
        { href: "#contacto", label: "Contacto" },
      ],
      cta: "Hablá con nosotros",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },
    hero: {
      eyebrow: "Tu salud, estés donde estés",
      titleBlue: "Atención médica de calidad",
      titleGreen: "en cualquier país, en tu idioma.",
      subtitle:
        "Capacidades médicas propias en más de 80 países: Know How local, un enfoque holístico de la salud y una experiencia de paciente pensada de punta a punta.",
      stats: { paises: "países con cobertura", idiomas: "idiomas de atención", disponibilidad: "siempre disponibles" },
    },
    capabilitiesBento: {
      eyebrow: "Lo que nos distingue",
      titleLead: "Cuatro capacidades, una misma",
      titleHighlight: "red médica",
      moreInfo: "Más información",
      items: {
        "red-medica": {
          title: "Red médica propia",
          description: "Nuestra red médica propia disponible en más de 80 países y más de 10 idiomas.",
          detail:
            "Médicos y especialistas propios, no tercerizados: mismo estándar de calidad y protocolo de seguimiento sin importar el país desde el que se atienda al paciente.",
        },
        "atencion-digital": {
          title: "Atención médica digital 24/7",
          description: "Accesibles en cualquier momento, desde cualquier lugar.",
          detail:
            "Teleconsulta inmediata con receta local válida, sin turnos ni esperas — la misma calidad de atención presencial, en el idioma del paciente.",
        },
        tecnologia: {
          title: "Tecnología avanzada",
          description: "Sin desarrollo de IT. Segura, fiable, user-friendly y avanzada.",
          detail:
            "Plataforma propia lista para integrarse a cualquier operación existente, sin proyectos de IT a cargo del cliente ni fricción de implementación.",
        },
        "medicos-domicilio": {
          title: "Médicos a domicilio",
          description: "Coordinación de visitas médicas a domicilio en España, Portugal, Italia y Francia.",
          detail:
            "Gestionamos la visita de principio a fin: selección del profesional, traslado y reporte médico posterior, sin que el paciente tenga que moverse.",
        },
      },
    },
    servicesJourney: {
      eyebrow: "De punta a punta",
      title: "Todo lo que rodea a una consulta médica",
      steps: {
        teleconsulta: "Teleconsulta",
        coordinacion: "Coordinación",
        especialistas: "Especialistas",
        "soporte-hospitalario": "Soporte hospitalario",
        seguimiento: "Seguimiento",
      },
      moreLink: "+ 9 servicios más ↓",
    },
    extendedServicesGrid: {
      eyebrow: "Catálogo completo",
      title: "14 servicios, 3 formas de acompañarte",
      categories: {
        "atencion-medica": "Atención médica",
        "coordinacion-logistica": "Coordinación y logística",
        "soporte-especializado": "Soporte especializado",
      },
      descriptions: {
        "fit-to-fly": "Certificación médica para volar seguro.",
        "house-calls": "Atención médica domiciliaria.",
        teleconsultation: "Acceso inmediato con receta local.",
        "medical-rounds": "Evaluación de salud grupal.",
        "specialist-doctors": "Acceso a especialistas.",
        "ambulance-coordination": "Gestión de traslados de emergencia.",
        "clinic-coordination": "Organización de servicios en clínicas.",
        "medical-escort": "Acompañamiento en viajes.",
        "medical-operation-center": "Coordinación médica continua.",
        "medical-audits": "Validación de diagnósticos y tratamientos.",
        "hospital-support": "Soporte durante la estadía hospitalaria.",
        "global-remote-guidance": "Orientación médica remota.",
        "socio-sanitary-support": "Asistencia social y de salud.",
        "medical-support-events": "Cobertura médica en eventos.",
      },
    },
    coverageBlock: {
      eyebrow: "Cobertura global",
      title: "Asistencia sanitaria sin fronteras",
      paragraph1:
        "Somos una compañía de asistencia sanitaria digital con capacidad internacional para responder a las necesidades de pacientes y empresas alrededor del mundo.",
      paragraph2:
        "Ponemos a disposición de nuestros partners el acceso al Know How local en más de 80 países, con un enfoque holístico en todos los casos que gestionamos, traduciéndose en una experiencia de cliente única a través de un servicio sobresaliente.",
    },
    trustMetrics: {
      title: "¿Por qué elegir eumedical?",
      metrics: {
        pacientes: "Pacientes satisfechos",
        medicos: "Médicos expertos",
        recetas: "Recetas aceptadas",
        especialidades: "Especialidades médicas",
      },
    },
    testimonialsCarousel: {
      title: "Nuestra calidad siempre prevalece",
      prevAria: "Testimonio anterior",
      nextAria: "Testimonio siguiente",
      regionAria: "Testimonios de clientes",
      items: {
        "testimonial-1": {
          text: "Viajamos por trabajo a tres países distintos en el mismo mes y en cada uno tuvimos un médico disponible en minutos, en nuestro idioma. Es la tranquilidad que buscábamos para no frenar el viaje por un imprevisto de salud.",
          location: "Buenos Aires, Argentina",
        },
        "testimonial-2": {
          text: "Tuve que hacer una teleconsulta a las 3 de la mañana en un hotel en Asia y en menos de 10 minutos ya estaba hablando con un médico que entendía perfectamente mi situación.",
          location: "Tokio, Japón",
        },
        "testimonial-3": {
          text: "La coordinación con la clínica local fue impecable: nos explicaron cada paso y no tuvimos que lidiar con el idioma ni con el sistema de salud del país en ningún momento.",
          location: "Ciudad de México, México",
        },
        "testimonial-4": {
          text: "El tiempo de respuesta fue lo que más nos sorprendió: pedimos ayuda médica un domingo feriado y nos contactaron casi de inmediato con una solución concreta.",
          location: "Madrid, España",
        },
      },
    },
    closingCta: {
      titleLead: "Viajá tranquilo.",
      titleHighlight: "De tu salud nos ocupamos nosotros.",
      subtitle: "Dondequiera que estés, tenés un médico disponible en tu idioma, las 24 horas.",
      cta: "Reservar consulta",
    },
    contactSection: {
      eyebrow: "Contacto",
      title: "¿Charlamos sobre tu caso?",
      address: "Madrid, España",
      linkedinAriaReal: "Perfil de LinkedIn de Eumedical (abre en una pestaña nueva)",
      linkedinAriaPlaceholder: "Perfil de LinkedIn de Eumedical (próximamente)",
      form: {
        nombre: "NOMBRE",
        apellido: "APELLIDO",
        email: "EMAIL",
        emailPlaceholder: "nombre@correo.com",
        mensaje: "Mensaje",
        privacyPrefix: "Acepto la ",
        privacyLink: "política de privacidad",
        privacySuffix: " y el tratamiento de mis datos para gestionar mi consulta",
        submit: "Enviar mensaje",
        errors: {
          nombre: "Este campo es obligatorio.",
          apellido: "Este campo es obligatorio.",
          email: "Ingresá un correo electrónico válido.",
          mensaje: "Contanos en qué podemos ayudarte.",
          aceptaTerminos: "Tenés que aceptar la política de privacidad para continuar.",
        },
      },
      success: {
        title: "¡Gracias!",
        message: "Te vamos a contactar a la brevedad.",
        resetLink: "Enviar otro mensaje",
      },
    },
    footer: {
      nav: [
        { href: "#hero", label: "Inicio" },
        { href: "#servicios", label: "Servicios" },
        { href: "#cobertura", label: "Cobertura" },
        { href: "#nosotros", label: "Sobre nosotros" },
        { href: "#contacto", label: "Contacto" },
      ],
      joinUs: "Únete a nuestro equipo",
      terms: "Términos y condiciones",
      privacy: "Política de privacidad",
    },
  },
  en: {
    header: {
      nav: [
        { href: "#servicios", label: "Services" },
        { href: "#cobertura", label: "Coverage" },
        { href: "#nosotros", label: "About us" },
        { href: "#contacto", label: "Contact" },
      ],
      cta: "Talk to us",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      eyebrow: "Your health, wherever you are",
      titleBlue: "Quality medical care",
      titleGreen: "in any country, in your language.",
      subtitle:
        "Our own medical capabilities in more than 80 countries: local know-how, a holistic approach to health, and a patient experience designed end to end.",
      stats: { paises: "countries covered", idiomas: "languages supported", disponibilidad: "always available" },
    },
    capabilitiesBento: {
      eyebrow: "What sets us apart",
      titleLead: "Four capabilities, one",
      titleHighlight: "medical network",
      moreInfo: "Learn more",
      items: {
        "red-medica": {
          title: "Our own medical network",
          description: "Our own medical network available in more than 80 countries and 10+ languages.",
          detail:
            "In-house doctors and specialists, never outsourced: the same quality standard and follow-up protocol no matter which country the patient is treated from.",
        },
        "atencion-digital": {
          title: "24/7 digital medical care",
          description: "Accessible anytime, from anywhere.",
          detail:
            "Immediate teleconsultation with a valid local prescription, no appointments or waiting — the same quality as an in-person visit, in the patient's own language.",
        },
        tecnologia: {
          title: "Advanced technology",
          description: "No IT development required. Secure, reliable, user-friendly and advanced.",
          detail:
            "Our own platform, ready to integrate with any existing operation — no IT projects on the client's side and no implementation friction.",
        },
        "medicos-domicilio": {
          title: "Doctors at home",
          description: "Coordination of at-home medical visits in Spain, Portugal, Italy and France.",
          detail:
            "We manage the visit end to end: choosing the professional, travel, and the follow-up medical report — the patient never has to move.",
        },
      },
    },
    servicesJourney: {
      eyebrow: "End to end",
      title: "Everything that surrounds a medical consultation",
      steps: {
        teleconsulta: "Teleconsultation",
        coordinacion: "Coordination",
        especialistas: "Specialists",
        "soporte-hospitalario": "Hospital support",
        seguimiento: "Follow-up",
      },
      moreLink: "+ 9 more services ↓",
    },
    extendedServicesGrid: {
      eyebrow: "Full catalog",
      title: "14 services, 3 ways to support you",
      categories: {
        "atencion-medica": "Medical care",
        "coordinacion-logistica": "Coordination and logistics",
        "soporte-especializado": "Specialized support",
      },
      descriptions: {
        "fit-to-fly": "Medical certification to fly safely.",
        "house-calls": "At-home medical care.",
        teleconsultation: "Immediate access with a local prescription.",
        "medical-rounds": "Group health assessment.",
        "specialist-doctors": "Access to specialists.",
        "ambulance-coordination": "Management of emergency transfers.",
        "clinic-coordination": "Organization of services across clinics.",
        "medical-escort": "Medical accompaniment during travel.",
        "medical-operation-center": "Continuous medical coordination.",
        "medical-audits": "Validation of diagnoses and treatments.",
        "hospital-support": "Support throughout the hospital stay.",
        "global-remote-guidance": "Remote medical guidance.",
        "socio-sanitary-support": "Social and health assistance.",
        "medical-support-events": "Medical coverage at events.",
      },
    },
    coverageBlock: {
      eyebrow: "Global coverage",
      title: "Healthcare without borders",
      paragraph1:
        "We are a digital healthcare assistance company with international capacity to respond to the needs of patients and companies around the world.",
      paragraph2:
        "We give our partners access to local know-how in more than 80 countries, with a holistic approach in every case we manage — translating into a unique client experience through outstanding service.",
    },
    trustMetrics: {
      title: "Why choose eumedical?",
      metrics: {
        pacientes: "Satisfied patients",
        medicos: "Expert doctors",
        recetas: "Prescriptions accepted",
        especialidades: "Medical specialties",
      },
    },
    testimonialsCarousel: {
      title: "Our quality always prevails",
      prevAria: "Previous testimonial",
      nextAria: "Next testimonial",
      regionAria: "Client testimonials",
      items: {
        "testimonial-1": {
          text: "We traveled for work to three different countries in the same month, and in each one we had a doctor available within minutes, in our own language. It's the peace of mind we were looking for, so a health issue would never stop the trip.",
          location: "Buenos Aires, Argentina",
        },
        "testimonial-2": {
          text: "I had to do a teleconsultation at 3am in a hotel in Asia, and in less than 10 minutes I was already talking to a doctor who completely understood my situation.",
          location: "Tokyo, Japan",
        },
        "testimonial-3": {
          text: "The coordination with the local clinic was flawless: they explained every step and we never had to deal with the language or the local healthcare system on our own.",
          location: "Mexico City, Mexico",
        },
        "testimonial-4": {
          text: "The response time was what surprised us the most: we asked for medical help on a holiday Sunday and they got back to us almost immediately with a concrete solution.",
          location: "Madrid, Spain",
        },
      },
    },
    closingCta: {
      titleLead: "Travel with peace of mind.",
      titleHighlight: "We'll take care of your health.",
      subtitle: "Wherever you are, you have a doctor available in your language, 24 hours a day.",
      cta: "Book a consultation",
    },
    contactSection: {
      eyebrow: "Contact",
      title: "Shall we talk about your case?",
      address: "Madrid, Spain",
      linkedinAriaReal: "Eumedical's LinkedIn profile (opens in a new tab)",
      linkedinAriaPlaceholder: "Eumedical's LinkedIn profile (coming soon)",
      form: {
        nombre: "FIRST NAME",
        apellido: "LAST NAME",
        email: "EMAIL",
        emailPlaceholder: "name@email.com",
        mensaje: "Message",
        privacyPrefix: "I accept the ",
        privacyLink: "privacy policy",
        privacySuffix: " and the processing of my data to manage my inquiry",
        submit: "Send message",
        errors: {
          nombre: "This field is required.",
          apellido: "This field is required.",
          email: "Enter a valid email address.",
          mensaje: "Tell us how we can help you.",
          aceptaTerminos: "You need to accept the privacy policy to continue.",
        },
      },
      success: {
        title: "Thank you!",
        message: "We'll get back to you shortly.",
        resetLink: "Send another message",
      },
    },
    footer: {
      nav: [
        { href: "#hero", label: "Home" },
        { href: "#servicios", label: "Services" },
        { href: "#cobertura", label: "Coverage" },
        { href: "#nosotros", label: "About us" },
        { href: "#contacto", label: "Contact" },
      ],
      joinUs: "Join our team",
      terms: "Terms and conditions",
      privacy: "Privacy policy",
    },
  },
};
