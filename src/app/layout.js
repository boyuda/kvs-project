import './globals.css';

export const metadata = {
  title: {
    template: '%s - KVS',
    default: 'Klientų Valdymo Sistema',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
