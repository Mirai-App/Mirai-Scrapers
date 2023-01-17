type DNS = {
  name: string;
  primary: {
    ipv4: string;
    ipv6: string;
  };
  secondary?: {
    ipv4: string;
    ipv6: string;
  };
};
