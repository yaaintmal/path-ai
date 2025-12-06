export interface AuthField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  icon?: string;
}

export interface AuthConfig {
  login: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    fields: AuthField[];
    footerText: string;
    footerLinkText: string;
  };
  register: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    fields: AuthField[];
    footerText: string;
    footerLinkText: string;
  };
  social: {
    google: string;
    github: string;
  };
}
