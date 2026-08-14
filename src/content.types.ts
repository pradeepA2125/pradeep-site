export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  name: string;
  blurb: string;
  href?: string;
  stack: string[];
  year: string;
}

export interface Role {
  title: string;
  org: string;
  period: string;
  startYear: number;
  points: string[];
}

export interface Lift {
  name: string;
  value: string;
}

export interface NamedLink {
  label: string;
  href: string;
}

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface SiteContent {
  name: string;
  tagline: string;
  location: string;
  hero: {
    headline: string;
    body: string;
    /** Field-note card in the hero — the photo plus its caption. */
    photo: Photo;
    noteCaption: string;
    cta: NamedLink;
    scrollHint: string;
  };
  metrics: Metric[];
  projects: Project[];
  roles: Role[];
  resumeHref: string;
  interstitial: { quote: string; attribution: string; photo: Photo };
  training: { heading: string; body: string; lifts: Lift[]; photo: Photo };
  riding: { heading: string; body: string; photo: Photo };
  contact: { heading: string; email: string; links: NamedLink[] };
}
