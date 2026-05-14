import { Company, PaginatedResponse } from './types'

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Minera San Cristóbal',
    industry: 'mineria',
    city: 'Potosí',
    country: 'Bolivia',
    score: 92,
    temperature: 'caliente',
    signals: {
      signals: [
        { id: '1', type: 'expansion', name: 'Expansión reciente', description: 'Proyecto de ampliación detectado', active: true, points: 20 },
        { id: '2', type: 'tender', name: 'Licitación pública', description: 'Participación en SICOES', active: true, points: 20 },
        { id: '3', type: 'news', name: 'Noticia de crecimiento', description: 'Inversión nueva reportada', active: true, points: 15 },
      ],
      total_points: 55,
    },
    contacts: [
      { id: 'c1', company_id: '1', name: 'Jorge Mendez', title: 'Gerente General', email: 'jorge@minera.bo', linkedin_url: 'https://linkedin.com/in/jorgemendez', phone: '+591-1234567', reliability: 'high', last_updated_at: '2024-05-14' },
      { id: 'c2', company_id: '1', name: 'Patricia Ruiz', title: 'Jefe de Compras', email: 'patricia@minera.bo', linkedin_url: 'https://linkedin.com/in/patriciaru', phone: '+591-1234568', reliability: 'high', last_updated_at: '2024-05-14' },
      { id: 'c3', company_id: '1', name: 'Marco Condori', title: 'Supervisor de Operaciones', email: 'marco@minera.bo', reliability: 'medium', last_updated_at: '2024-05-10' },
    ],
    tenders: [
      { id: 't1', title: 'Suministro de equipos mineros', description: 'Búsqueda de proveedores', date: '2024-05-10', status: 'pending' },
    ],
    score_justification: 'Empresa grande en sector estratégico (minería) con señales de crecimiento e inversión. Participación activa en licitaciones públicas.',
    last_updated: '2024-05-14',
  },
  {
    id: '2',
    name: 'LogistiCenter Bolivia',
    industry: 'logistica',
    city: 'Santa Cruz',
    country: 'Bolivia',
    score: 78,
    temperature: 'caliente',
    signals: {
      signals: [
        { id: '1', type: 'expansion', name: 'Expansión reciente', description: 'Nueva sucursal abierta', active: true, points: 20 },
        { id: '2', type: 'tender', name: 'Licitación pública', description: 'Participación en SICOES', active: true, points: 20 },
      ],
      total_points: 40,
    },
    contacts: [
      { id: 'c1', company_id: '2', name: 'Carlos López', title: 'Gerente General', email: 'carlos@logisticenter.bo', linkedin_url: 'https://linkedin.com/in/carloslopez', phone: '+591-2234567', reliability: 'high', last_updated_at: '2024-05-12' },
      { id: 'c2', company_id: '2', name: 'Débora Fernández', title: 'Gerente de Logística', email: 'debora@logisticenter.bo', linkedin_url: 'https://linkedin.com/in/deboraf', reliability: 'high', last_updated_at: '2024-05-12' },
    ],
    tenders: [],
    score_justification: 'Empresa de logística con crecimiento reciente. Posicionada en región de alta demanda comercial.',
    last_updated: '2024-05-12',
  },
  {
    id: '3',
    name: 'Agroindustria Arica',
    industry: 'agro',
    city: 'Arica',
    country: 'Bolivia',
    score: 65,
    temperature: 'tibio',
    signals: {
      signals: [
        { id: '1', type: 'news', name: 'Noticia de crecimiento', description: 'Reportaje sobre modernización', active: true, points: 15 },
      ],
      total_points: 15,
    },
    contacts: [
      { id: 'c1', company_id: '3', name: 'Fernando Díaz', title: 'Director Comercial', email: 'fernando@agroindustria.bo', linkedin_url: 'https://linkedin.com/in/fernandodiaz', reliability: 'medium', last_updated_at: '2024-05-11' },
      { id: 'c2', company_id: '3', name: 'Elena Pacta', title: 'Jefe de Operaciones', phone: '+591-3234567', reliability: 'medium', last_updated_at: '2024-05-08' },
    ],
    tenders: [],
    score_justification: 'Empresa agroindustrial con señales moderadas de crecimiento. Sector estratégico pero tamaño mediano.',
    last_updated: '2024-05-11',
  },
  {
    id: '4',
    name: 'Industrial Metals SA',
    industry: 'industria',
    city: 'La Paz',
    country: 'Bolivia',
    score: 58,
    temperature: 'tibio',
    signals: {
      signals: [
        { id: '1', type: 'expansion', name: 'Expansión reciente', description: 'Nueva línea de producción', active: true, points: 20 },
      ],
      total_points: 20,
    },
    contacts: [
      { id: 'c1', company_id: '4', name: 'Roberto Silva', title: 'Gerente de Operaciones', email: 'roberto@industrialmetals.bo', linkedin_url: 'https://linkedin.com/in/robertosilva', reliability: 'medium', last_updated_at: '2024-05-13' },
    ],
    tenders: [],
    score_justification: null,
    last_updated: '2024-05-13',
  },
  {
    id: '5',
    name: 'Almacenes Mercosur',
    industry: 'almacenamiento',
    city: 'Cochabamba',
    country: 'Bolivia',
    score: 72,
    temperature: 'caliente',
    signals: {
      signals: [
        { id: '1', type: 'tender', name: 'Licitación pública', description: 'Participación en SICOES', active: true, points: 20 },
        { id: '2', type: 'news', name: 'Noticia de crecimiento', description: 'Expansión a nueva región', active: true, points: 15 },
      ],
      total_points: 35,
    },
    contacts: [
      { id: 'c1', company_id: '5', name: 'Mariana Gómez', title: 'Gerente General', email: 'mariana@mercosur.bo', linkedin_url: 'https://linkedin.com/in/marianagomez', phone: '+591-4234567', reliability: 'high', last_updated_at: '2024-05-14' },
      { id: 'c2', company_id: '5', name: 'Gustavo Aramayo', title: 'Gerente de Compras', email: 'gustavo@mercosur.bo', reliability: 'high', last_updated_at: '2024-05-14' },
    ],
    tenders: [
      { id: 't1', title: 'Sistema de gestión de almacenes', description: 'Software de logística', date: '2024-05-08', status: 'pending' },
    ],
    score_justification: 'Empresa de almacenamiento con participación en licitaciones públicas. Sector de logística en expansión.',
    last_updated: '2024-05-14',
  },
  {
    id: '6',
    name: 'Transportes Integrados',
    industry: 'logistica',
    city: 'Oruro',
    country: 'Bolivia',
    score: 45,
    temperature: 'tibio',
    signals: {
      signals: [
        { id: '1', type: 'news', name: 'Noticia de crecimiento', description: 'Adquisición de nueva flota', active: true, points: 15 },
      ],
      total_points: 15,
    },
    contacts: [
      { id: 'c1', company_id: '6', name: 'Luis Quispe', title: 'Gerente Comercial', email: 'luis@transportesint.bo', phone: '+591-5234567', reliability: 'low', last_updated_at: '2024-05-10' },
    ],
    tenders: [],
    score_justification: 'Empresa de transporte con señales moderadas. Oportunidad para soluciones de logística.',
    last_updated: '2024-05-10',
  },
  {
    id: '7',
    name: 'Agrícola de Altura',
    industry: 'agro',
    city: 'Potosí',
    country: 'Bolivia',
    score: 35,
    temperature: 'frío',
    signals: {
      signals: [],
      total_points: 0,
    },
    contacts: [],
    tenders: [],
    score_justification: null,
    last_updated: '2024-05-13',
  },
  {
    id: '8',
    name: 'Manufactura Textil',
    industry: 'industria',
    city: 'La Paz',
    country: 'Bolivia',
    score: 52,
    temperature: 'tibio',
    signals: {
      signals: [
        { id: '1', type: 'expansion', name: 'Expansión reciente', description: 'Renovación de planta', active: true, points: 20 },
      ],
      total_points: 20,
    },
    contacts: [
      { id: 'c1', company_id: '8', name: 'Javier Toledo', title: 'Director de Producción', email: 'javier@textilmanu.bo', linkedin_url: 'https://linkedin.com/in/javiertoledo', reliability: 'medium', last_updated_at: '2024-05-09' },
    ],
    tenders: [],
    score_justification: 'Empresa manufacturera con señales moderadas de inversión en infraestructura.',
    last_updated: '2024-05-09',
  },
  {
    id: '9',
    name: 'Minería Potosí Plus',
    industry: 'mineria',
    city: 'Potosí',
    country: 'Bolivia',
    score: 89,
    temperature: 'caliente',
    signals: {
      signals: [
        { id: '1', type: 'tender', name: 'Licitación pública', description: 'Participación en SICOES', active: true, points: 20 },
        { id: '2', type: 'expansion', name: 'Expansión reciente', description: 'Nueva concesión otorgada', active: true, points: 20 },
        { id: '3', type: 'news', name: 'Noticia de crecimiento', description: 'Inversión extranjera reportada', active: true, points: 15 },
      ],
      total_points: 55,
    },
    contacts: [
      { id: 'c1', company_id: '9', name: 'Andrés Morales', title: 'Gerente General', email: 'andres@mineriapplus.bo', linkedin_url: 'https://linkedin.com/in/andresmorales', phone: '+591-6234567', reliability: 'high', last_updated_at: '2024-05-14' },
      { id: 'c2', company_id: '9', name: 'Susana Gutiérrez', title: 'Gerente de Operaciones', email: 'susana@mineriapplus.bo', linkedin_url: 'https://linkedin.com/in/susanag', reliability: 'high', last_updated_at: '2024-05-14' },
      { id: 'c3', company_id: '9', name: 'Rodrigo Ayllón', title: 'Jefe de Compras', phone: '+591-6234568', reliability: 'medium', last_updated_at: '2024-05-12' },
    ],
    tenders: [
      { id: 't1', title: 'Equipos de perforación', description: 'Búsqueda de proveedores internacionales', date: '2024-05-15', status: 'pending' },
    ],
    score_justification: 'Empresa minera con múltiples señales de expansión y presencia en licitaciones. Sector prioritario.',
    last_updated: '2024-05-14',
  },
  {
    id: '10',
    name: 'Centro Logístico del Este',
    industry: 'almacenamiento',
    city: 'Santa Cruz',
    country: 'Bolivia',
    score: 68,
    temperature: 'tibio',
    signals: {
      signals: [
        { id: '1', type: 'expansion', name: 'Expansión reciente', description: 'Aumento de capacidad de almacenamiento', active: true, points: 20 },
      ],
      total_points: 20,
    },
    contacts: [
      { id: 'c1', company_id: '10', name: 'Daniela Ruiz', title: 'Gerente de Operaciones', email: 'daniela@centrologistico.bo', linkedin_url: 'https://linkedin.com/in/danielaruiz', reliability: 'high', last_updated_at: '2024-05-11' },
    ],
    tenders: [],
    score_justification: 'Centro de distribución con crecimiento en infraestructura. Potencial cliente para soluciones de logística.',
    last_updated: '2024-05-11',
  },
]

export function getMockCompanies(): PaginatedResponse<Company> {
  return {
    data: mockCompanies,
    total: mockCompanies.length,
    page: 1,
    page_size: 20,
    total_pages: 1,
  }
}
