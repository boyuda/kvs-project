import { redirect } from 'next/navigation';

export default function Page() {
  // return <h1 className="text-texts">hello</h1>;
  redirect('/auth/sign-in');
}
