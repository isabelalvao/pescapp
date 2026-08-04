import type { SourceReference } from "@/lib/domain/types";

export const sources = {
  dgrm: {
    provider: "DGRM",
    label: "Pesca lúdica — DGRM",
    url: "https://www.dgrm.pt/web/guest/coluna-3",
    authoritative: true
  },
  dgrmLicences: {
    provider: "DGRM",
    label: "Licenças de pesca lúdica",
    url: "https://www.dgrm.pt/licencas",
    authoritative: true
  },
  apa: {
    provider: "APA",
    label: "InfoÁgua — APA",
    url: "https://infoagua.apambiente.pt/pt/",
    authoritative: true
  },
  ipma: {
    provider: "IPMA",
    label: "IPMA — Mar",
    url: "https://www.ipma.pt/pt/maritima/",
    authoritative: true
  },
  amn: {
    provider: "Autoridade Marítima Nacional",
    label: "Capitania do Porto de Vila do Conde",
    url: "https://www.amn.pt/DGAM/Capitanias/VilaConde/Paginas/Capitania-do-Porto-de-Vila-do-Conde.aspx",
    authoritative: true
  },
  openMeteo: {
    provider: "Open-Meteo Marine",
    label: "Open-Meteo Marine API — fonte secundária",
    url: "https://open-meteo.com/en/docs/marine-weather-api",
    authoritative: false
  },
  worldTides: {
    provider: "WorldTides",
    label: "WorldTides API",
    url: "https://www.worldtides.info/",
    authoritative: false
  },
  ih: {
    provider: "Instituto Hidrográfico",
    label: "Previsão Oceanográfica — Tabelas de Marés",
    url: "https://www.hidrografico.pt/paginas-genericas/dt/doc/previsao-oceanografica/",
    authoritative: true
  },
  icnf: {
    provider: "ICNF",
    label: "Pesca lúdica e desportiva em águas interiores",
    url: "https://www.icnf.pt/pesca/pescaludicaedesportiva",
    authoritative: true
  },
  worms: {
    provider: "WoRMS",
    label: "World Register of Marine Species",
    url: "https://www.marinespecies.org/",
    authoritative: true
  },
  demo: {
    provider: "PescApp",
    label: "Dados de demonstração PescApp",
    url: "/sobre-dados",
    authoritative: false
  }
} satisfies Record<string, SourceReference>;
