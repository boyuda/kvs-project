import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: {
    template: '%s - KVS',
    default: 'Klientų Valdymo Sistema',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        {children}
      </body>
    </html>
  );
}
